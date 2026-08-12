import cron from "node-cron";
import NotificationModel from "../models/notification.Model";

let notificationCleanupTask: ReturnType<typeof cron.schedule> | null = null;

export const initNotificationCleanupScheduler = () => {
  if (notificationCleanupTask) {
    return notificationCleanupTask;
  }

  notificationCleanupTask = cron.schedule("0 0 0 * * *", async () => {
    try {
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      );
      const result = await NotificationModel.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`Deleted ${result.deletedCount ?? 0} read notifications`);
    } catch (error) {
      console.error("Failed to delete old read notifications", error);
    }
  });

  console.log("Notification cleanup scheduler initialized");
  return notificationCleanupTask;
};
