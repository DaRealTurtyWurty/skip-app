/*
  Warnings:

  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Object";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SkipObject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "images" TEXT,
    "taken" BOOLEAN NOT NULL DEFAULT false,
    "takenQuantity" INTEGER NOT NULL DEFAULT 0,
    "quantityMin" INTEGER NOT NULL DEFAULT 1,
    "quantityMax" INTEGER NOT NULL DEFAULT 1,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
