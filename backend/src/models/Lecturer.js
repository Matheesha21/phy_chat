
import mongoose from 'mongoose';

// Matches the frontend `Lecturer` interface in services/lecturerService.ts
const lecturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    specialization: { type: String, required: true },
    email: { type: String, required: true },
    officeHours: { type: String, required: true },
    room: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export const Lecturer = mongoose.model('Lecturer', lecturerSchema);

