import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: undefined,
  },
  password: {
    type: String,
    default: "",
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("find", function () {
  this.populate("cart");
});

userSchema.pre("findOne", function () {
  this.populate("cart");
});

const UserModel = mongoose.model("user", userSchema);
export default UserModel;
