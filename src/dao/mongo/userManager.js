import UserModel from "../models/user.schema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

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

  async getUserById(id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(user.password, salt);
    user.password = hashedPwd;
    const newUser = await UserModel.insertMany(user);
    return newUser;
  }

  async valUser(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) return false;

    const validPassword = await bcrypt.compareSync(password, user.password);

    return validPassword ? user : false;
  }
}
