<script setup>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = ref(null)

editor.value = new Editor({
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl prose-p:my-1 mx-auto focus:outline-none dark:prose-invert',
    },
  },
  content: `<p>I'm running Tiptap with Vue.js. 🎉</p>`,
  extensions: [StarterKit],
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<template>
  <div class="tiptap-editor min-h-screen">
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    >
      <div class="bubble-menu">
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
      </div>
    </bubble-menu>
    <editor-content :editor="editor" />
  </div>
</template>

<style lang="scss">
.bubble-menu {
  background-color: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-700);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem 0.2rem;

  button {
    background-color: unset;
    padding: 0.2rem 0.8rem;
    border-radius: 0.4rem;

    &:hover {
      background-color: var(--color-neutral-700);
    }

    &.is-active {
      color: var(--color-blue-500);
      background-color: var(--color-neutral-700);

      &:hover {
        background-color: var(--color-neutral-900);
      }
    }
  }
}
</style>
