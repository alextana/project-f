<template>
  Login please!

  <UButton @click="login()" label="Login with Google" />

  <pre>{{ session.data }}</pre>
  <UButton v-if="session.data" @click="signOut()">Sign out</UButton>
</template>

<script setup lang="ts">
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
