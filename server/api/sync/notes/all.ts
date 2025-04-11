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
   * Get all the notes from the remote db
   * and all the notes from the local db
   */
  const serverNotes = await db.query.note.findMany({
    where: (note, { eq }) => eq(note.userId, session.user.id),
  })

  /**
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
   * Hashes don't match, we have a couple of things we need to check
   * who has the latest note, remote or local?
   *
   * I probably have to check each note, it's almost as if we need version control
   * for each of them?
   *
   * to prevent data loss we'll need to check inside the body for differences, and merge accordingly
   * realistically when doing a full sync that's not possible
   *
   * so we could take the approach of always taking the latest, no matter what
   *
   * flow is this
   *
   * you edit a note, it goes in a queue at a certain time
   *
   * network error!
   *
   * go on a different device, edit the same note - network ok -> synced to the server at later time
   *
   * go online with other device, queue clears - IF we have something in the queue that's OLDER than
   * something in the server, we can look into doing a merge
   *
   * parsing the content and looking for differences, injecting the changes and doing a diff?
   *
   *
   */
})
