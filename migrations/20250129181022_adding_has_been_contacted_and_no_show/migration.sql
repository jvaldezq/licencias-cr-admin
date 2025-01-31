-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "hasBeenContacted" BOOLEAN DEFAULT false,
ADD COLUMN     "noShow" BOOLEAN DEFAULT false;
