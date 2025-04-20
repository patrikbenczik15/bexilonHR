import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import DocumentRequest from "../models/DocumentRequest.js";
import DocumentType from "../models/DocumentType.js";
import Document from "../models/Document.js";
import { DocumentStatus, UserRole, RequestStatus } from "../utils/enums.js";
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
    let buletinType = await DocumentType.findOne({ name: "Buletin" });
    if (!buletinType) {
      buletinType = new DocumentType({
        name: "Buletin",
        description: "Document de identitate oficial",
        allowedUploads: ["pdf", "jpg", "jpeg", "png"],
        requiredDocuments: [],
        requiresHRApproval: false,
        createdBy: adminUser._id,
        isActive: true,
      });
      await buletinType.save();
      console.log("Buletin document type created successfully");
    } else {
      console.log("Buletin document type already exists");
    }

    let concediuType = await DocumentType.findOne({ name: "Cerere Concediu" });
    if (!concediuType) {
      concediuType = new DocumentType({
        name: "Cerere Concediu",
        description: "Cerere pentru concediu de odihnă",
        allowedUploads: ["pdf", "doc", "docx"],
        requiredDocuments: [buletinType._id],
        requiresHRApproval: true,
        createdBy: adminUser._id,
        isActive: true,
      });
      await concediuType.save();
      console.log("Cerere Concediu document type created successfully");
    } else {
      console.log("Cerere Concediu document type already exists");
    }

    let buletinDocument = await Document.findOne({
      userId: johnWayne._id,
      documentType: buletinType._id,
    });

    if (!buletinDocument) {
      const dummyPdfBuffer = Buffer.from("%PDF-1.5 dummy content for testing");

      buletinDocument = new Document({
        name: "Buletin John Wayne",
        userId: johnWayne._id,
        documentType: buletinType._id,
        file: {
          data: dummyPdfBuffer,
          contentType: "application/pdf",
          size: dummyPdfBuffer.length,
          originalName: "buletin_john_wayne.pdf",
        },
        status: DocumentStatus.Valid, // Validat deja
        approvalHistory: [
          {
            role: UserRole.Employee,
            action: "upload",
            comment: "Încărcare inițială",
            date: new Date(),
          },
          {
            role: UserRole.Employee,
            action: "approve",
            comment: "Document valid",
            date: new Date(),
          },
        ],
      });

      await buletinDocument.save();
      console.log("Buletin document created for John Wayne");

      // ! update john wayne doc list
      await User.findByIdAndUpdate(johnWayne._id, {
        $push: { documents: buletinDocument._id },
      });
    } else {
      console.log("Buletin document already exists for John Wayne");
    }

    let concediuRequest = await DocumentRequest.findOne({
      requesterId: johnWayne._id,
      documentType: concediuType._id,
    });

    if (!concediuRequest) {
      concediuRequest = new DocumentRequest({
        title: "Cerere concediu vară 2025",
        description:
          "Solicit 10 zile de concediu în perioada 15-25 August 2025",
        requesterId: johnWayne._id,
        documentType: concediuType._id,
        requiredDocuments: [buletinType._id],
        submittedDocuments: [buletinDocument._id],
        status: RequestStatus.Pending,
      });

      await concediuRequest.save();
      console.log("Cerere concediu created for John Wayne");

      await User.findByIdAndUpdate(johnWayne._id, {
        $push: { documentRequests: concediuRequest._id },
      });
    } else {
      console.log("Cerere concediu already exists for John Wayne");
    }

    let concediuDocument = await Document.findOne({
      userId: johnWayne._id,
      documentType: concediuType._id,
    });

    if (!concediuDocument) {
      const dummyConcediuBuffer = Buffer.from(
        "%PDF-1.5 Cerere concediu John Wayne pentru perioada 15-25 August 2025"
      );

      concediuDocument = new Document({
        name: "Cerere concediu vară 2025",
        description:
          "Solicit 10 zile de concediu în perioada 15-25 August 2025",
        userId: johnWayne._id,
        documentType: concediuType._id,
        file: {
          data: dummyConcediuBuffer,
          contentType: "application/pdf",
          size: dummyConcediuBuffer.length,
          originalName: "cerere_concediu_john_wayne.pdf",
        },
        status: DocumentStatus.Pending,
        requiredDocuments: [buletinDocument._id],
        approvalHistory: [
          {
            role: UserRole.Employee,
            action: "upload",
            comment: "Încărcare cerere concediu",
            date: new Date(),
          },
        ],
      });

      await concediuDocument.save();
      console.log("Cerere concediu document created for John Wayne");

      // ! update john wayne doc list
      await User.findByIdAndUpdate(johnWayne._id, {
        $push: { documents: concediuDocument._id },
      });

      // ! update doc request
      await DocumentRequest.findByIdAndUpdate(concediuRequest._id, {
        $push: { submittedDocuments: concediuDocument._id },
      });
    } else {
      console.log("Cerere concediu document already exists for John Wayne");
    }
    console.log("All test data created successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB or creating test data:", error);
  }
};

export default connectDB;
