-- CreateTable
CREATE TABLE "OwnersOnObject" (
    "id" TEXT NOT NULL,
    "objectId" INTEGER NOT NULL,
    "author" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OwnersOnObject_pkey" PRIMARY KEY ("id","objectId")
);

-- CreateTable
CREATE TABLE "Object" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sp2type" TEXT NOT NULL,
    "sp2name" TEXT NOT NULL,
    "sp2questions" TEXT NOT NULL,
    "upFloors" INTEGER NOT NULL,
    "isUnderFloor" BOOLEAN NOT NULL,
    "underFloors" INTEGER NOT NULL,
    "fireRoomArea" DOUBLE PRECISION NOT NULL,
    "tradeArea" DOUBLE PRECISION NOT NULL,
    "blackTradeRooms" BOOLEAN NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "class" TEXT NOT NULL,
    "degree" TEXT NOT NULL,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OwnersOnObject" ADD CONSTRAINT "OwnersOnObject_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
