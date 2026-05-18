const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { signToken, cookieOptions } = require("../utils/token");

const ALLOWED_ROLES = ["user", "provider"];

function formatAuthResponse(user, token, message) {
  return {
    message,
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    const { name, password, email, role = "user" } = req.body;

    if (!name || !password || !email) {
      return res.status(400).send({ message: "Name, email, and password are required" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).send({ message: "Invalid role. Must be 'user' or 'provider'" });
    }

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (isUserAlreadyExist) {
      return res.status(400).send({
        message: "User already exist with this email or username",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      password: hash,
      email,
      role,
    });

    const token = signToken(user);
    res.cookie("token", token, cookieOptions());

    return res.status(201).send(formatAuthResponse(user, token, "User created successfully"));
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).send({ message: "Error creating user" });
  }
}

async function login(req, res) {
  try {
    const { email, name, password } = req.body;

    if (!password || (!email && !name)) {
      return res.status(400).send({ message: "Email or name and password are required" });
    }

    const userData = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (!userData) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    const token = signToken(userData);
    res.cookie("token", token, cookieOptions());

    return res.status(200).send(formatAuthResponse(userData, token, "Login successful"));
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(401).send({ message: "Invalid Credentials" });
  }
}

module.exports = {
  register,
  login,
};
