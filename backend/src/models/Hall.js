
import mongoose from 'mongoose';

// Matches the frontend `Hall` interface in services/hallService.ts
const hallSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['Auditorium', 'Lecture Room', 'Laboratory'],
      required: true,
    },
  },
  { timestamps: true },
);

export const Hall = mongoose.model('Hall', hallSchema);

