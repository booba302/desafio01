import UserModel from "../models/user.schema.js";
import crypto from "crypto";

export default class UserManager {
  constructor() {}

  async getUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(user) {
    user.salt = crypto.randomBytes(128).toString("base64");
    user.password = crypto
      .createHmac("sha256", user.salt)
      .update(user.password)
      .digest("hex");
    await UserModel.insertMany([user]);
    return user;
  }

  async valUser(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) return false;

    const loginHash = crypto
      .createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    return loginHash == user.password ? user.toObject() : false;
  }
}
