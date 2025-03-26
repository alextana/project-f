import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: string
  title: string | null
  content: string | null
  userId: string
}

const db = new Dexie('Notes') as Dexie & {
  notes: EntityTable<
    Note,
    'id' // primary key "id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  notes: '&id, title, content, userId',
})

export type { Note }
export { db }
