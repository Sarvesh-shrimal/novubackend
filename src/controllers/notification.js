const { Novu } = require("@novu/node");


// Trigger a notification
const sendNotification = async (req, res) => {
    const novu = new Novu(process.env.NOVU_API_KEY);
  try {
    const { subscriberId} = req.body;
    const message = " i am heere";

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
const getNotifications = async (req, res) => {
    const novu = new Novu("4427e7f40fcc94310c78abb45bc3591c");

  try {
    const  {subscriberId}  = req.params;
    const { data } = await novu.subscribers.getNotificationsFeed(subscriberId);
    res.json(data.data || []);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

module.exports = { sendNotification, getNotifications };
