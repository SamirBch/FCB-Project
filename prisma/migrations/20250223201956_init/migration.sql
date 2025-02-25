/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `team` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scorer" TEXT NOT NULL,
    "assist" TEXT NOT NULL,
    "matchDate" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "opponent" TEXT NOT NULL,
    "finish" TEXT NOT NULL
);
INSERT INTO "new_Video" ("assist", "competition", "finish", "id", "matchDate", "minute", "opponent", "scorer", "season", "title", "url") SELECT "assist", "competition", "finish", "id", "matchDate", "minute", "opponent", "scorer", "season", "title", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
