import { defineConfig, LoadStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  // port needs to be a number but environment variables are always strings
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD
  dbName: process.env.DB_NAME,
  debug: true,
  entitiesTs: ['src/**/*.entity.ts'],
  entities: ['dist/**/*.entity.js'],
  loadStrategy: LoadStrategy.JOINED,
  extensions: [Migrator, SeedManager],
  migrations: {
    pathTs: 'src/migrations',
    path: 'dist/src/migrations',
  },
  seeder: {
    pathTs: 'src/seeders',
    path: 'dist/src/seeders',
  },
});
