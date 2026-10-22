import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const households = sqliteTable('households', {
  ownerId: text('owner_id').primaryKey(),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(0),
});
export const medicalFiles = sqliteTable('medical_files', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  profileId: text('profile_id').notNull(),
  visitId: text('visit_id').notNull().default(''),
  title: text('title').notNull(),
  fileName: text('file_name').notNull(),
  mime: text('mime').notNull(),
  bytes: integer('bytes').notNull(),
  kind: text('kind').notNull(),
  addedBy: text('added_by').notNull(),
  createdAt: text('created_at').notNull(),
});
