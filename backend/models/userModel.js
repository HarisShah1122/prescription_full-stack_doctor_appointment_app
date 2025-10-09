
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: { type: String, default: "" },
  line2: { type: String, default: "" }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  image: { type: String, default: 'data:image/png;base64,iVBORw0K... (shortened placeholder)' },
  phone: { type: String, default: '000000000' },
  address: { type: addressSchema, default: () => ({}) },
  gender: { type: String, default: 'Not Selected' },
  dob: { type: String, default: 'Not Selected' },
  password: { type: String, required: true, select: false }, 
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
