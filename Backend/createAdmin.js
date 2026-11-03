import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "./models/userSchema.js";

config({ path: "./config.env" });

const createInitialAdmin = async () => {
  try {
    // IMPORTANT: dbName must match Backend/database/dbConnection.js exactly ("Life_Care_Hospital")
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Life_Care_Hospital",
    });
    console.log("Connected to MongoDB database: Life_Care_Hospital");

    const adminEmail = process.argv[2] || "admin@gmail.com";
    const adminPassword = process.argv[3] || "Admin@12345";

    // Delete existing user with this email in Life_Care_Hospital if any, to ensure fresh password hash & Admin role
    await User.deleteOne({ email: adminEmail });

    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      phone: "9876543210",
      aadhar: "123456789012",
      dob: new Date("1995-01-01"),
      gender: "Male",
      password: adminPassword,
      role: "Admin",
    });

    console.log("\n==========================================");
    console.log(" SUCCESS: Admin Created in Life_Care_Hospital!");
    console.log(" Email   : " + admin.email);
    console.log(" Password: " + adminPassword);
    console.log(" Role    : " + admin.role);
    console.log("==========================================\n");
    console.log("Now login at the Admin panel with these exact credentials!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createInitialAdmin();
