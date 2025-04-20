import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import DocumentType from "../models/DocumentType.js";
import Document from "../models/Document.js";
import { DocumentStatus } from "../utils/enums.js";
import "../models/index.js";

dotenv.config();
const dbURI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");

    // Crearea utilizatorului John Wayne
    let existingUser = await User.findOne({ email: "john.wayne@bexilon.com" });
    if (!existingUser) {
      const user = new User({
        name: "John Wayne",
        email: "john.wayne@bexilon.com",
        password: "parolaputernica", // * hashed by pre-save hook
      });
      await user.save();
      console.log("Test user John Wayne created successfully");
    } else {
      console.log("Test user John Wayne already exists");
    }

    let existingUser2 = await User.findOne({ email: "john.wick@bexilon.com" });
    if (!existingUser2) {
      const user2 = new User({
        name: "John Wick",
        email: "john.wick@bexilon.com",
        password: "dontfdogs",
        role: "hr",
      });
      await user2.save();
      console.log("Test user John Wick (HR) created successfully");
    } else {
      console.log("Test user John Wick already exists");
    }

    let existingUser3 = await User.findOne({
      email: "lamine.yamal99@yahoo.es",
    });
    if (!existingUser3) {
      const user3 = new User({
        name: "Lamine Yamal",
        email: "lamine.yamal99@yahoo.es",
        password: "messi19",
        role: "admin",
      });
      await user3.save();
      console.log("Test user Lamine Yamal (Admin) created successfully");
    } else {
      console.log("Test user Lamine Yamal already exists");
    }

    const adminUser = await User.findOne({ email: "lamine.yamal99@yahoo.es" });
    const johnWayne = await User.findOne({ email: "john.wayne@bexilon.com" });

    if (!adminUser || !johnWayne) {
      throw new Error("Admin user or John Wayne not found");
    }

    // ! document type for passport
    let passportType = await DocumentType.findOne({ name: "Passport" });
    if (!passportType) {
      passportType = new DocumentType({
        name: "Passport",
        description: "Your passport document",
        allowedUploads: ["pdf", "jpg", "png"],
        requiredDocuments: [], // * VA FI DOCUMENTTYPE TYPE// TODO schimbat, avem nevoie de un obiect cu id-uri pentru ca unele documente necesita alte documente "basic" gen buletin.
        // TODO FIECARE DOCUMENT SINGULAR NU ARE NEVOIE DE REQUIRED DOCUMENTS, FIECARE REQUEST ARE
        requiresHRApproval: false,
        createdBy: adminUser._id,
        isActive: true,
      });
      await passportType.save();
      console.log("Passport DocumentType created successfully");
    } else {
      console.log("Passport DocumentType already exists");
    }

    // ! john wayne passport for test
    const existingPassport = await Document.findOne({
      userId: johnWayne._id,
      documentType: passportType._id,
    });
    if (!existingPassport) {
      const passportDocument = new Document({
        name: "John Wayne's Passport",
        description: "Passport document for John Wayne",
        userId: johnWayne._id,
        documentType: passportType._id,
        file: {
          data: Buffer.from("dummy passport data"),
          contentType: "application/pdf",
          size: 1024,
          originalName: "passport.pdf",
        },
        status: DocumentStatus.Pending,
        feedback: "",
        requiredDocuments: [],
      });
      await passportDocument.save();
      console.log("Passport Document created successfully");
    } else {
      console.log("Passport Document for John Wayne already exists");
    }

    console.log("All test data created successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB or creating test data:", error);
  }
};

export default connectDB;
