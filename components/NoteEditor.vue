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
    class="text-4xl font-bold focus:outline-none w-full"
    type="text"
    v-model="title"
    @input="saveTitle"
    placeholder="Title"
  />
  <div v-if="editor">
    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        Strike
      </button>
    </bubble-menu>

    <floating-menu
      class="floating-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        Bullet list
      </button>
    </floating-menu>
  </div>

  <TiptapEditorContent
    :editor="editor"
    @input="saveContent"
    @keydown.backspace="saveContent"
    @paste="saveContent"
  />
</template>

<script setup lang="ts">
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
import { db } from '~/lib/dexie'

const props = defineProps({
  content: {
    type: Object,
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

const title = ref(props.title || 'Untitled note')

const isSyncing = ref(false)

const editor = useEditor({
  content: props.content,
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert focus:outline-none min-h-screen',
    },
  },
  extensions: [TiptapStarterKit],
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})

const saveNote = async (field: 'title' | 'content', value: any) => {
  if (field === 'content') {
    await nextTick()

    value = unref(editor)?.getJSON()
  }

  try {
    await db.notes.update(props.noteId, {
      [field]: value,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error saving ${field}`, error)
  }
}

const saveTitle = () => saveNote('title', title.value)
const saveContent = () => saveNote('content', null)

onMounted(() => {
  if (!!unref(editor)) {
    let content = null
    try {
      content = props.content
    } catch (error) {
      return
    }

    unref(editor)?.commands.setContent(props.content)
  }
})
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}

/* Bubble menu */
.bubble-menu {
  background-color: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  padding: 0.2rem;

  button {
    background-color: unset;

    &:hover {
      background-color: var(--gray-3);
    }

    &.is-active {
      background-color: var(--purple);

      &:hover {
        background-color: var(--purple-contrast);
      }
    }
  }
}

/* Floating menu */
.floating-menu {
  display: flex;
  background-color: var(--gray-3);
  padding: 0.1rem;
  border-radius: 0.5rem;

  button {
    background-color: unset;
    padding: 0.275rem 0.425rem;
    border-radius: 0.3rem;

    &:hover {
      background-color: var(--gray-3);
    }

    &.is-active {
      background-color: var(--white);
      color: var(--purple);

      &:hover {
        color: var(--purple-contrast);
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
