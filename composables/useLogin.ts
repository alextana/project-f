import { signIn } from '~/lib/auth-client'

interface SocialSignInOptions {
  callbackURL: string
  errorCallbackURL: string
  newUserCallbackURL: string
}

type Providers =
  | 'apple'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'google'
  | 'spotify'
  | 'twitch'
  | 'twitter'

export const useLogin = () => {
  const socialSignIn = async (
    provider: Providers,
    options: SocialSignInOptions
  ) => {
    await signIn.social({
      provider,
      callbackURL: options.callbackURL,
      errorCallbackURL: options.errorCallbackURL,
      newUserCallbackURL: options.newUserCallbackURL,
    })
  }

  return {
    socialSignIn,
  }
}
