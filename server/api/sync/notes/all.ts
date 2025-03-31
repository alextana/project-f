import { auth } from '~/lib/auth'
import { db } from '~/server/utils/db'
import CryptoJS from 'crypto-js'
import { Note } from '~/lib/dexie'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You need to be logged in to sync',
    })
  }

  const body = await readBody(event)

  if (!body.action) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Cannot sync without the action type',
    })
  }

  /**
   * Get all the notes from the server
   * and all the notes from the local db
   */
  const serverNotes = await db.query.note.findMany({
    where: (note, { eq }) => eq(note.userId, session.user.id),
  })

  /**
   *
   * @param note
   * @returns
   */

  const hashNote = (note: Note) => {
    const id = CryptoJS.SHA256(note.id || '').toString()
    const title = CryptoJS.SHA256(note.title || '').toString()
    const content = CryptoJS.SHA256(note.content || '').toString()
    const userId = CryptoJS.SHA256(note.userId || '').toString()
    const deletedAt = CryptoJS.SHA256(note.deletedAt || '').toString()
    const updatedAt = CryptoJS.SHA256(note.updatedAt || '').toString()
    const createdAt = CryptoJS.SHA256(note.createdAt || '').toString()
    const isPublic = CryptoJS.SHA256(note.isPublic || 'false').toString()
    return CryptoJS.SHA256(
      id +
        title +
        content +
        userId +
        deletedAt +
        updatedAt +
        createdAt +
        isPublic
    ).toString()
  }

  const generateNotesHash = (notes: any) => {
    const sorted = [...notes].sort((a, b) => {
      if (!a.id || !b.id) return 0
      return a.id - b.id
    })

    let concatenatedHashes = ''

    for (const note of sorted) {
      concatenatedHashes += hashNote(note)
    }

    const combinedHash = CryptoJS.SHA256(concatenatedHashes).toString()
    return combinedHash
  }

  const serverHash = generateNotesHash(serverNotes)
  const localHash = generateNotesHash(body.localNotes)

  if (serverHash === localHash)
    return {
      message: 'Server database is up to date',
    }

  /**
   * if the hashes don't match
   * we can update the db with the local data
   */
  // do something here - sync strategy
})
