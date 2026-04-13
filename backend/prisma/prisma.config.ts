import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'migrations'),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/hotel_booking',
  },
})
