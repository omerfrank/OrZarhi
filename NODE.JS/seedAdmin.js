import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.js'; // Adjust path if needed


const createAdmin = async () => {
  try {
    // 1. Connect to Database
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in .env");
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB...");

    // 2. Check if an admin already exists
    // We check for ANY user with role 'admin' to avoid creating duplicates
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log("Admin user already exists. Skipping creation.");
      process.exit(0);
    }

    // 3. Create the Admin User
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = "SuperAdmin";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: 'admin', // This sets the permissions
      favorites: []
    });

    await newAdmin.save();
    console.log(`Admin user created successfully! Email: ${email}`);

  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    // 4. Close connection
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();