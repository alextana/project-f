<template>
  <fieldset>
    <legend>Add new note</legend>
    <label>
      title:
      <UInput v-model="title" type="text" />
    </label>
    <br />
    <label>
      content:
      <UInput v-model="content" type="text" />
    </label>
    <br />
    <UButton @click="addNote">Add Note</UButton>
    <p>{{ status }}</p>
  </fieldset>
</template>

<script setup>
import { db } from '~/lib/dexie'
import { nanoid } from 'nanoid'
import { useSession } from '~/lib/auth-client'
const session = useSession()

const status = ref('')
const title = ref('')
const content = ref('')

const addNote = async () => {
  try {
    const id = await db.notes.add({
      id: nanoid(),
      title: title.value,
      content: content.value,
      userId: session.data?.user?.id || 'local',
    })

    status.value = `Note ${title.value}
          successfully added. Got id ${id}`

    title.value = null
    content.value = null
  } catch (error) {
    status = `Failed to add
          ${title.value}: ${error}`
  }
}
</script>
