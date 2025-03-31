import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: string
  title: string | null
  content: string | null
  userId: string
  updatedAt: string
  deletedAt: string | null
  createdAt: string
  isPublic: string
}

interface NoteAccess {
  noteId: string
  userId: string
  createdAt: string
}

interface Settings {
  userId: string
  lastSynced: string
  automaticSync: string
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
  settings: EntityTable<Settings, 'userId'>
}

db.version(4).stores({
  notes: '&id, title, content, userId, updatedAt, deletedAt, createdAt',
  noteAccess: '[noteId+userId], noteId, userId, createdAt',
  noteQueue: '&id, noteId, userId, title, content, action, status',
  settings: '&userId, lastSynced, automaticSync',
})

export type { Note, NoteAccess, NoteQueue }
export { db }
