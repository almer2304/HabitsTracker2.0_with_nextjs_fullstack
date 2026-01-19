import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  unique,
  primaryKey
} from "drizzle-orm/pg-core";

// ==========================================
// 1. USER & AUTH TABLES
// ==========================================
export const users = pgTable("user", {
  id: text("id").primaryKey(), // String ID untuk UUID Google/Manual
  name: text("name"),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"), 
  image: text("image"),
  points: integer("points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    // Ini sangat penting agar NextAuth bisa mengenali akun yang unik
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  })
);

export const sessions = pgTable("session", {
  // Gunakan sessionToken sebagai Primary Key atau buat id-nya opsional
  sessionToken: text("sessionToken").primaryKey(), 
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ==========================================
// 2. HABIT TABLES
// ==========================================
export const habits = pgTable("habit", {
  id: serial("id").primaryKey(),
  userId: text("userId") // Diubah ke text
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  currentStreak: integer("currentStreak").default(0).notNull(),
  longestStreak: integer("longestStreak").default(0).notNull(),
  lastCompleted: timestamp("lastCompleted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const habitLogs = pgTable(
  "habit_log",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habitId")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  (table) => ({
    unq: unique().on(table.habitId, table.completedAt),
  })
);

// ==========================================
// 3. SOCIAL TABLES
// ==========================================
export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  userId: text("userId") // Diubah ke text
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = pgTable("comment", {
  id: serial("id").primaryKey(),
  postId: integer("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("userId") // Diubah ke text
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = pgTable("notification", {
  id: serial("id").primaryKey(),
  userId: text("userId") // Diubah ke text
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ==========================================
// 4. GAMIFICATION
// ==========================================
export const badges = pgTable("badge", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  imageIcon: text("imageIcon"),
  requirement: integer("requirement").notNull(),
});

export const userBadges = pgTable("user_badge", {
  id: serial("id").primaryKey(),
  userId: text("userId") // Diubah ke text
    .notNull()
    .references(() => users.id),
  badgeId: integer("badgeId")
    .notNull()
    .references(() => badges.id),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});