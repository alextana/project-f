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

  <div class="notion-editor">
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
      class="editor-menu"
    >
      <div class="bubble-menu">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          title="Bold"
        >
          <UIcon name="lucide-bold" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          title="Italic"
        >
          <UIcon name="lucide-italic" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          title="Strike"
        >
          <UIcon name="lucide-strikethrough" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
          title="Code"
        >
          <UIcon name="lucide-code" size="18" />
        </button>
        <div class="divider"></div>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          title="Heading 1"
        >
          <UIcon name="lucide-heading-1" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          title="Heading 2"
        >
          <UIcon name="lucide-heading-2" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          title="Heading 3"
        >
          <UIcon name="lucide-heading-3" size="18" />
        </button>
        <div class="divider"></div>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          title="Bullet List"
        >
          <UIcon name="lucide-list" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          title="Ordered List"
        >
          <UIcon name="lucide-list-ordered" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          title="Code Block"
        >
          <UIcon name="lucide-file-code" size="18" />
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          title="Blockquote"
        >
          <UIcon name="lucide-quote" size="18" />
        </button>
      </div>
    </bubble-menu>
  </div>

  <TiptapEditorContent
    :editor="editor"
    @input="saveContent"
    @keydown.backspace="saveContent"
    @paste="saveContent"
  />
</template>

<script setup lang="ts">
import { db } from '~/lib/dexie'
import { BubbleMenu } from '@tiptap/vue-3'
import { useSession } from '~/lib/auth-client'
import { nanoid } from 'nanoid'
import superjson from 'superjson'

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
  extensions: [TiptapStarterKit],
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

<style>
.notion-editor {
  transition: 0.5s ease;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.editor-menu {
  width: max-content;
  display: flex;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
}

.editor-menu button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: #5c5c5c;
}

.editor-menu button:hover {
  background-color: #e9e9e9;
}

.editor-menu button.is-active {
  background-color: #e1e1e1;
  color: #000;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  margin: 0 8px;
}

.editor-content {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  min-height: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.editor-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.editor-content p {
  margin: 0.75em 0;
}

.editor-content h1 {
  font-size: 1.75em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content h2 {
  font-size: 1.4em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content h3 {
  font-size: 1.2em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.editor-content ul,
.editor-content ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.editor-content blockquote {
  border-left: 3px solid #e0e0e0;
  padding-left: 1em;
  color: #6c757d;
  margin: 1em 0;
}

.editor-content pre {
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 0.75em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  overflow-x: auto;
}

.editor-content code {
  background-color: #f5f5f5;
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
}

.bubble-menu {
  display: flex;
}
</style>
