import { faker } from '@faker-js/faker'

function generateTiptapContent() {
  const paragraphCount = faker.number.int({ min: 10, max: 30 })
  const paragraphs = Array.from({ length: paragraphCount }, () =>
    faker.lorem.paragraph()
  )

  const content = paragraphs.map((paragraph) => ({
    type: 'paragraph',
    content: [{ type: 'text', text: paragraph }],
  }))

  return JSON.stringify({
    json: {
      type: 'doc',
      content: content,
    },
  })
}

const notes = Array.from({ length: 100 }, (_, index) => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: generateTiptapContent(),
    userId: `local`,
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: null,
    createdAt: faker.date.past().toISOString(),
    isPublic: faker.datatype.boolean().toString(),
  }
})
import { db } from '~/lib/dexie'

export const seed = async () => {
  try {
    await db.notes.bulkAdd(notes)
  } catch (error) {
    console.error(error)
  }
}
