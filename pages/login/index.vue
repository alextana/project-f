<template>
  Login please!

  <Button @click="login" label="Login with Google" />

  <pre>{{ session.data }}</pre>
  <Button v-if="session.data" @click="signOut()">Sign out</Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { signIn, signOut, useSession } from '~/lib/auth-client'
const session = useSession()

const login = async () =>
  await signIn.social({
    provider: 'google',
    callbackURL: '/',
    errorCallbackURL: '/error',
    newUserCallbackURL: '/',
  })
</script>
