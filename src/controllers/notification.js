import { Novu } from "@novu/node";

// Initialize Novu with API Key (recommended: single instance, not inside every function)
const novu = "fdasfdasdffadsf";

// Trigger a notification
export const sendNotification = async (req, res) => {
  try {
    const { subscriberId } = req.body;
    const message = "I am here";

    await novu.trigger("task-create", {
      to: {
        subscriberId,
      },
      payload: {
        message,
      },
    });

    res.json({ success: true, message: "Notification sent" });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

// Get a subscriber's feed from Novu
export const getNotifications = async (req, res) => {
  try {
    const { subscriberId } = req.params;
    const { data } = await novu.subscribers.getNotificationsFeed(subscriberId);

    res.json(data.data || []);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
