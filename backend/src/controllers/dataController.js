
import { Lecture } from '../models/Lecture.js';
import { Lecturer } from '../models/Lecturer.js';
import { Hall } from '../models/Hall.js';

// GET /api/lectures
export async function getLectures(_req, res, next) {
  try {
    const lectures = await Lecture.find().lean();
    res.json(lectures);
  } catch (err) {
    next(err);
  }
}

// GET /api/lecturers
export async function getLecturers(_req, res, next) {
  try {
    const lecturers = await Lecturer.find().lean();
    res.json(lecturers);
  } catch (err) {
    next(err);
  }
}

// GET /api/halls
export async function getHalls(_req, res, next) {
  try {
    const halls = await Hall.find().lean();
    res.json(halls);
  } catch (err) {
    next(err);
  }
}

