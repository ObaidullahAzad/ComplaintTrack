import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: ["Product", "Service", "Support"],
  },
  priority: {
    type: String,
    required: [true, "Please select a priority"],
    enum: ["Low", "Medium", "High"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", complaintSchema);
