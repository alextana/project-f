import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: string
  title: string | null
  content: string | null
  userId: string
  updatedAt: string
  deletedAt: string | null
  createdAt: string
  isPublic: boolean
}

interface NoteAccess {
  noteId: string
  userId: string
  createdAt: string
}

const db = new Dexie('Notes') as Dexie & {
  notes: EntityTable<Note, 'id'>
  noteAccess: EntityTable<NoteAccess>
}

db.version(2).stores({
  notes: '&id, title, content, userId, updatedAt, deletedAt, createdAt',
  noteAccess: '[noteId+userId], noteId, userId, createdAt',
})

export type { Note, NoteAccess }
export { db }
