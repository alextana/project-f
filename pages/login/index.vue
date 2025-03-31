<template>
  Login please!

  <UButton @click="login()" label="Login with Google" />

  <pre>{{ session.data }}</pre>
  <UButton v-if="session.data" @click="signOut()">Sign out</UButton>
</template>

<script setup lang="ts">
import { signOut, useSession } from '~/lib/auth-client'
const session = useSession()
const { socialSignIn } = useLogin()

const login = () =>
  socialSignIn('google', {
    callbackURL: '/notes?loggedIn=true',
    errorCallbackURL: '/login/error',
    newUserCallbackURL: '/first-login',
  })
</script>
