export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const { data: noteId } = await useFetch('/api/createNote', {
      method: 'POST',
    })

    return navigateTo(`/notes/${noteId.value?.noteId}`)
  } catch (error) {
    console.error('Failed to create note:', error)
    return navigateTo('/notes')
  }
})
