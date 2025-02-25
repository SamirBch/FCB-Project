-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scorer" TEXT NOT NULL,
    "assist" TEXT NOT NULL,
    "matchDate" DATETIME NOT NULL,
    "competition" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "opponent" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "season" TEXT NOT NULL
);
