const supertest = require("supertest")
const app = require("../../../index.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModells = require("../../Modells/userModells.js")

// Mock dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
// jest.mock("../../Modells/userModells");
jest.mock("../../middlewares/auth.js", () => {
  return (req, res, next) => next();
});

describe("Auth Api with bcrypt", () => {
  beforeAll(() => {
    process.env.PASSKEY = "testsecret"; // mock env secret
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // test("Signup should create user in DB", async () => {
  //   const res = await supertest(app).post("/api/user-register").send({
  //     name: "test user",
  //     student_id: "A112",
  //     email: "test@example.com",
  //     password: "password123",
  //   });

  //   expect(res.status).toBe(201);

  //   // Check database
  //   const user = await userModells.findOne({ email: "test@example.com" });
  //   expect(user).not.toBeNull();
  //   expect(user.name).toBe("test user");
  // });

  // test("Signup should hash password and create", async () => {
  //   bcrypt.genSalt.mockResolvedValue("fakeSalt");
  //   bcrypt.hash.mockResolvedValue("hashedpassword");
  //   userModells.create.mockResolvedValue({
  //     name: "testingwith",
  //     student_id: "A1",
  //     email: "testing@gmail.com",
  //     password: "hashedpassword",
  //   });

  //   const res = await supertest(app).post("/api/user-register").send({
  //     name: "testingwith",
  //     student_id: "A112",
  //     email: "testing@gmail.com",
  //     password: "password",
  //   });

  //   expect(res.status).toBe(201);
  //   expect(userModells.prototype.save).toHaveBeenCalled();
  //   expect(bcrypt.hash).toHaveBeenCalledWith("password", "fakeSalt");
  // });

  // test(" Signup should return error all field are required", async () => {
  //   bcrypt.genSalt.mockResolvedValue("fakeSalt");
  //   bcrypt.hash.mockResolvedValue("hashedpassword");
  //   userModells.create.mockResolvedValue({
  //     student_id: "A112",
  //     email: "testing@gmail.com",
  //     password: "hashedpassword",
  //   });

  //   const res = await supertest(app).post("/api/user-register").send({
  //     student_id: "A112",
  //     email: "testing@gmail.com",
  //     password: "hashedpassword",
  //   });

  //   expect(res.status).toBe(400);
  //   expect(res.body.msg);
  // })

  // test("Login should return JWT token", async () => {
  //   const fakeUser = {
  //     email: "123456789@gmail.com",
  //     password: "hashedpassword",
  //   };

  //   userModells.findOne.mockResolvedValue(fakeUser);
  //   bcrypt.compare.mockResolvedValue(true);
  //   jwt.sign.mockReturnValue("mocked-jwt-token");

  //   const res = await supertest(app).post("/api/login").send({
  //     email: "123456789@gmail.com",
  //     password: "12345678",
  //   });

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("token", "mocked-jwt-token");
  // });

  // test(" Get all user should return all users ", async () => {

  //   const mockUser = [
  //     { name: 'user1', email: "user1@gmail.com" },
  //     { name: 'user2', email: "user2@gmail.com" },
  //   ];

  //   userModells.find.mockResolvedValue(mockUser);

  //   const res = await supertest(app).get("/api/all-user");

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("data")
  //   expect(res.body.data).toEqual(mockUser)

  // })

  test("Signup should create user in DB", async () => {
    bcrypt.genSalt.mockResolvedValue("fakeSalt");
    bcrypt.hash.mockResolvedValue("hashedpassword");
    const res = await supertest(app).post("/api/user-register").send({
      name: "test-userwi",
      student_id: "A112",
      email: "test12@example.com",
      password: "password",
    });

    expect(res.status).toBe(201);

    const user = await userModells.findOne({ email: "test12@example.com" });
    expect(user).not.toBeNull();
    expect(user.name).toBe("test-userwi");
  });

  test("Signup should return error if missing fields", async () => {
    const res = await supertest(app).post("/api/user-register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation Error");
  });

  test("Login should return JWT token", async () => {
    // First create a real user in DB
    const user = new userModells({
      name: "login user",
      student_id: "A113",
      email: "login@example.com",
      password: "hashedpassword", // already hashed
    });
    await user.save();

    // Mock bcrypt + jwt
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocked-jwt-token");

    const res = await supertest(app).post("/api/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "mocked-jwt-token");
  });

  test("Get all user should return all users", async () => {
    await userModells.create([
      { name: "user1", email: "user1@gmail.com", student_id: "A1", password: "pass" },
      { name: "user2", email: "user2@gmail.com", student_id: "A2", password: "pass" }
    ]);

    const res = await supertest(app).get("/api/all-user");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.length).toBe(2);
  });

});
