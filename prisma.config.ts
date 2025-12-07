import { defineConfig, env } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  // Prisma 7 expects a top-level `datasource` key for CLI commands like
  // `prisma db push` instead of the old `url` field in schema.prisma.
  datasource: {
    url: env('DATABASE_URL'),
  },
})
