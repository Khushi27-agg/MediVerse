const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  const accounts = [
    { name: "Jane Doe", email: "patient@demo.com", password: "demo123", role: "patient" },
    { name: "Dr. Demo Doctor", email: "doctor@demo.com", password: "demo123", role: "doctor" },
  ];

  for (const acc of accounts) {
    const existing = await User.findOne({ email: acc.email });
    if (!existing) {
      const hashed = await bcrypt.hash(acc.password, 10);
      await User.create({ ...acc, password: hashed });
      console.log("Created:", acc.email);
    } else {
      console.log("Already exists:", acc.email);
    }
  }

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch(console.error);
