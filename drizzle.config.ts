import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const DB_FILE_NAME = process.env.DB_FILE_NAME;

console.log('Database file name:', DB_FILE_NAME);

export default defineConfig({
  out: './src/db',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: "file:./tasks.db",
  },
});
