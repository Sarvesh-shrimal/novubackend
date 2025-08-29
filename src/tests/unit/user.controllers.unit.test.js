// tests/UserController.test.js
// ESM-style Jest test using top-level await

// Mock the user model module (constructor + static methods)
jest.unstable_mockModule("../../Modells/userModells.js", () => {
  class MockUser {
    constructor(data) {
      Object.assign(this, data);
    }
  }
  // instance save() and static methods are jest.fn mocks so tests can control them
  MockUser.prototype.save = jest.fn();
  MockUser.find = jest.fn();
  MockUser.findOne = jest.fn();

  return { default: MockUser };
});

// Mock bcrypt and jsonwebtoken
jest.unstable_mockModule("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// imports (after mocks)
const UserModule = await import("../../Modells/userModells.js");
const User = UserModule.default;

const bcrypt = await import("bcrypt");
const jwt = await import("jsonwebtoken");

const controller = await import("../../controllers/Usercontrollers.js");

describe("User Controller (unit)", () => {
  let req, res;

  beforeAll(() => {
    // make sure PASSKEY is defined for jwt.sign call
    process.env.PASSKEY = "testkey";
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("Registeruser - success", async () => {
    req.body = {
      name: "testing",
      email: "testing@gmail.com",
      password: "plainpass",
      student_id: "A112",
    };

    // Setup bcrypt and save mock
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedpass");
    User.prototype.save.mockResolvedValue({ _id: "1", ...req.body, password: "hashedpass" });

    await controller.Registeruser(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, "salt");
    expect(User.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "User registered successfully" });
  });

  test("allusers - success", async () => {
    const users = [{ email: "testing@gmail.com" }];
    User.find.mockResolvedValue(users);

    await controller.allusers(req, res);

    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: users });
  });

  test("Login - success", async () => {
    const email = "testing@gmail.com";
    const password = "plainpass";
    const fakeUser = { _id: "1", email, password: "hashedpass" };

    req.body = { email, password };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    await controller.Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, fakeUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: fakeUser._id },
      process.env.PASSKEY,
      { expiresIn: "1d" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "token123", user: fakeUser });
  });
});
