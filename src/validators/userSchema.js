const {z} = require("zod");

const registerSchema = z.object({

    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid Email Address"),
    student_id: z.string().min(4, "Id have max 4 no."),
    password: z.string().min(6),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

module.exports = {
    registerSchema, loginSchema
}