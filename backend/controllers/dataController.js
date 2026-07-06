

import { prisma } from '../config/db.js';
import { serializeHall } from '../lib/hallType.js';

// GET /api/lectures
export async function getLectures(_req, res, next) {
  try {
    const lectures = await prisma.lecture.findMany();
    res.json(lectures);
  } catch (err) {
    next(err);
  }
}

// GET /api/lecturers
export async function getLecturers(_req, res, next) {
  try {
    const lecturers = await prisma.lecturer.findMany();
    res.json(lecturers);
  } catch (err) {
    next(err);
  }
}

// GET /api/halls
export async function getHalls(_req, res, next) {
  try {
    const halls = await prisma.hall.findMany();
    res.json(halls.map(serializeHall));
  } catch (err) {
    next(err);
  }
}