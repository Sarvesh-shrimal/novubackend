// const Novu = require("@novu/node")
// const studentInfocontrollers = require("../Modells/studentinfoModell.js")
// // const novu = new Novu(process.env.NOVU_API_KEY);

//  const studentinfo = async (req, res) => {
//   try {
//     const { student_id, description } = req.body;

//     // 1. Save student info in DB
//     const newUser = new studentinfoModell({
//       student_id,
//       description,
//     });
//     await newUser.save();

//     // 2. Identify subscriber in Novu (register if not exists)
//     try {
//       await novu.subscribers.identify(student_id, {
//         firstName: "Student", // You can make dynamic (e.g., from DB user record)
//       });
//     } catch (err) {
//       console.error("Novu identify error:", err);
//       return res
//         .status(500)
//         .json({ error: "Failed to identify subscriber in Novu" });
//     }

//     // 3. Trigger notification workflow
//     try {
//       await novu.trigger("task-create", {
//         to: {
//           subscriberId: student_id,
//         },
//         payload: {
//           message: description,
//         },
//       });
//     } catch (err) {
//       console.error("Novu trigger error:", err);
//       return res
//         .status(500)
//         .json({ error: "Failed to trigger Novu notification" });
//     }

//     // 4. Final response
//     res.status(200).json({
//       success: true,
//       msg: "Student info saved and notification sent successfully",
//     });
//   } catch (error) {
//     console.error("Error in studentinfo:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = studentinfo
