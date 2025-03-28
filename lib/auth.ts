import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../server/utils/db' // your drizzle instance
import * as schema from '../server/db/schema' // your schema

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "sqlite",
    schema: {
      ...schema,
    },
  }),
})
