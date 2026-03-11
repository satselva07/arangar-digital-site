-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "notificationChannels" TEXT[],
ADD COLUMN     "notificationError" TEXT,
ADD COLUMN     "notificationLastTriedAt" TIMESTAMP(3),
ADD COLUMN     "notificationStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "VolunteerBooking" ADD COLUMN     "notificationChannels" TEXT[],
ADD COLUMN     "notificationError" TEXT,
ADD COLUMN     "notificationLastTriedAt" TIMESTAMP(3),
ADD COLUMN     "notificationStatus" TEXT NOT NULL DEFAULT 'PENDING';
