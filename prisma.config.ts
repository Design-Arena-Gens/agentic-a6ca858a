import { defineConfig } from '@prisma/client/generator-build';

export default defineConfig({
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db'
  }
});
