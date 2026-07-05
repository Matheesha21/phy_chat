
import mongoose from 'mongoose';

// Matches the frontend `Lecture` interface in services/lectureService.ts
const lectureSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    time: { type: String, required: true },
    lecturer: { type: String, required: true },
    hall: { type: String, required: true },
    day: { type: String, required: true },
  },
  { timestamps: true },
);

export const Lecture = mongoose.model('Lecture', lectureSchema);

