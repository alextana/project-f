<template>
  <div class="info-panel w-full absolute top-0 left-0 px-4 py-2 flex">
    <Transition>
      <UIcon
        v-if="isSyncing"
        name="lucide-refresh-ccw"
        class="animate-spin ml-auto text-gray-400"
      />
    </Transition>
  </div>

  <input
    class="text-4xl font-bold appearance-none focus:outline-none w-full mb-4"
    type="text"
    v-model="title"
    @input="saveTitle"
    placeholder="Title"
  />

  <TiptapEditorContent
    :editor="editor"
    @input="saveContent"
    @keydown.backspace="saveContent"
    @paste="saveContent"
  />
</template>

<script setup lang="ts">
import { db } from '~/lib/dexie'
import { useSession } from '~/lib/auth-client'
import { nanoid } from 'nanoid'
import superjson from 'superjson'
import TiptapNoteTitle from '~/components/tiptap/extensions/note-title-extension'

const session = useSession()

const props = defineProps({
  content: {
    type: String,
    default: {},
  },
  title: {
    type: String,
  },
  noteId: {
    type: String,
    required: true,
  },
})

const { syncLocal } = useSyncDatabase()
const { addActionToQueue } = useSyncQueue()

const title = ref(props.title || 'New note')
const contentVal = ref(null)
const isSyncing = ref(false)

const editor = useEditor({
  content: props.content,
  editorProps: {
    attributes: {
      class:
        'prose max-w-[unset] dark:prose-invert focus:outline-none min-h-screen',
    },
  },
  extensions: [TiptapStarterKit, TiptapNoteTitle],
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})

onMounted(() => {
  if (!!unref(editor)) {
    unref(editor)?.commands.setContent(
      props.content ? superjson.parse(props.content) : ''
    )
  }
})

/**
 * Add to the indexed db queue
 * so it can be worked on in the background
 */
const addToQueueAndSync = useDebounceFn(async () => {
  const id = nanoid()

  await addActionToQueue({
    id: id,
    noteId: props.noteId,
    userId: session.value.data?.user.id as string,
    action: 'update',
    title: title.value,
    content: superjson.stringify(contentVal.value),
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null,
  })
}, 800)

const saveNote = async (field: 'title' | 'content', value: any) => {
  if (field === 'content') {
    await nextTick()

    value = superjson.stringify(unref(editor)?.getJSON())
    contentVal.value = value
  }

  try {
    await db.notes.update(props.noteId, {
      [field]: value,
      updatedAt: new Date().toISOString(),
    })

    syncLocal()
  } catch (error) {
    console.error(`Error saving ${field}`, error)
  }

  // sync if logged in - TODO && if preferences
  if (session.value.data?.user?.id) {
    addToQueueAndSync()
  }
}

const saveTitle = () => saveNote('title', title.value)
const saveContent = () => saveNote('content', null)
</script>
