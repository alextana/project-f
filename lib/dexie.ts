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

interface NoteQueue {
  id: string
  noteId: string
  userId: string | 'local'
  title?: string | null
  content?: string | null
  action: 'update' | 'create' | 'delete'
  status: 'completed' | 'pending' | 'error' | 'conflict'
  createdAt: string
  completedAt: string | null
}

const db = new Dexie('Notes') as Dexie & {
  notes: EntityTable<Note, 'id'>
  noteAccess: EntityTable<NoteAccess>
  noteQueue: EntityTable<NoteQueue, 'noteId'>
}

db.version(3).stores({
  notes: '&id, title, content, userId, updatedAt, deletedAt, createdAt',
  noteAccess: '[noteId+userId], noteId, userId, createdAt',
  noteQueue: '&id, noteId, userId, title, content, action, status',
})

export type { Note, NoteAccess, NoteQueue }
export { db }
