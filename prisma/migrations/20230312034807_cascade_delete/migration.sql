-- DropForeignKey
ALTER TABLE "OwnersOnObject" DROP CONSTRAINT "OwnersOnObject_objectId_fkey";

-- AddForeignKey
ALTER TABLE "OwnersOnObject" ADD CONSTRAINT "OwnersOnObject_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
