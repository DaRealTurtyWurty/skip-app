/*
  Warnings:

  - You are about to drop the column `image` on the `Object` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Object" (
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
INSERT INTO "new_Object" ("createdAt", "description", "id", "latitude", "longitude", "name", "quantityMax", "quantityMin", "taken", "takenQuantity") SELECT "createdAt", "description", "id", "latitude", "longitude", "name", "quantityMax", "quantityMin", "taken", "takenQuantity" FROM "Object";
DROP TABLE "Object";
ALTER TABLE "new_Object" RENAME TO "Object";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
