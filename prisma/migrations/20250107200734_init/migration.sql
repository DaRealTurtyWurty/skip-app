-- CreateTable
CREATE TABLE "Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "taken" BOOLEAN NOT NULL DEFAULT false,
    "takenQuantity" INTEGER NOT NULL DEFAULT 0,
    "quantityMin" INTEGER NOT NULL DEFAULT 1,
    "quantityMax" INTEGER NOT NULL DEFAULT 1,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
