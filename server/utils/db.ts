import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../db/schema'

export const db = drizzle({
  schema,
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})
