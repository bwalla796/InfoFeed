import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  test: {
    env: {
      DB_FILE_NAME: ':memory:',
      NODE_ENV: 'test',
    },
  },
});