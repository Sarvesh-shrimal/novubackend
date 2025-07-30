const { Novu } = require('@novu/node');
const studentinfoModell = require("../Modells/studentinfoModell");

const novu = new Novu("cac2fe9e773b5ab3e65a7d7979d9f1a2");

const studentinfo = async (req, res) => {
  try {
    const { student_id, description } = req.body;

    const newUser = new studentinfoModell({
      student_id,
      description
    });
    await newUser.save();

    // Identify subscriber
    let response;
    try {
      response = await novu.subscribers.identify(student_id, {
        firstName: "Student", // You can make dynamic
      });
    } catch (err) {
      console.error("Novu identify error:", err);
      return res.status(500).json({ error: "Failed to identify subscriber in Novu" });
    }

    // Trigger notification
 

    const resp = await novu.trigger('onboarding-demo-workflow', {
      to: {
        subscriberId: student_id
      },
      payload: {
        student_id,
        description
      }
    });
    res.status(200).json({ msg: "Info saved and notification sent" });

  } catch (error) {
    console.error("Error in studentinfo:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { studentinfo };