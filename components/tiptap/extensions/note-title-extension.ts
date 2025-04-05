import { TiptapExtensionsNoteTitle } from '#components'
import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'vueComponent',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'note-title',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['note-title', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapExtensionsNoteTitle)
  },
})
