

import dotenv from 'dotenv';
import { prisma, connectDB, disconnectDB } from './config/db.js';

dotenv.config();

// Mirrors the mock data the frontend currently ships with.
const lectures = [
{ courseCode: 'PHY301', courseName: 'Quantum Mechanics', time: '09:00 AM - 11:00 AM', lecturer: 'Dr. N. Perera', hall: 'Hall A', day: 'Monday' },
{ courseCode: 'PHY202', courseName: 'Thermodynamics', time: '11:00 AM - 01:00 PM', lecturer: 'Prof. S. Silva', hall: 'Hall B', day: 'Monday' },
{ courseCode: 'PHY101', courseName: 'Classical Mechanics', time: '08:00 AM - 10:00 AM', lecturer: 'Dr. K. Bandara', hall: 'Main Auditorium', day: 'Tuesday' },
{ courseCode: 'PHY405', courseName: 'Solid State Physics', time: '01:00 PM - 03:00 PM', lecturer: 'Dr. N. Perera', hall: 'Hall C', day: 'Wednesday' }];


const lecturers = [
{ name: 'Dr. N. Perera', title: 'Senior Lecturer', specialization: 'Quantum Physics', email: 'n.perera@sci.sjp.ac.lk', officeHours: 'Tue & Thu, 10:00 AM - 12:00 PM', room: 'Room 402' },
{ name: 'Prof. S. Silva', title: 'Professor', specialization: 'Thermodynamics & Statistical Mechanics', email: 's.silva@sci.sjp.ac.lk', officeHours: 'Mon & Wed, 01:00 PM - 03:00 PM', room: 'Room 405' },
{ name: 'Dr. K. Bandara', title: 'Lecturer', specialization: 'Classical Mechanics', email: 'k.bandara@sci.sjp.ac.lk', officeHours: 'Fri, 09:00 AM - 11:00 AM', room: 'Room 301' }];


// `type` uses the Prisma enum values (no spaces).
const halls = [
{ name: 'Main Auditorium', location: 'Science Faculty Building, Ground Floor', capacity: 300, hasProjector: true, type: 'Auditorium' },
{ name: 'Hall A', location: 'Physics Department, 1st Floor', capacity: 100, hasProjector: true, type: 'LectureRoom' },
{ name: 'Hall B', location: 'Physics Department, 1st Floor', capacity: 80, hasProjector: true, type: 'LectureRoom' },
{ name: 'Advanced Physics Lab', location: 'Physics Department, 2nd Floor', capacity: 40, hasProjector: false, type: 'Laboratory' }];


async function seed() {
  await connectDB();

  // Clear existing rows (order doesn't matter — no relations).
  await Promise.all([
  prisma.lecture.deleteMany(),
  prisma.lecturer.deleteMany(),
  prisma.hall.deleteMany()]
  );

  await Promise.all([
  prisma.lecture.createMany({ data: lectures }),
  prisma.lecturer.createMany({ data: lecturers }),
  prisma.hall.createMany({ data: halls })]
  );

  console.log('Seeded lectures, lecturers, and halls.');
  await disconnectDB();
}

seed().catch(async (err) => {
  console.error(err);
  await disconnectDB();
  process.exit(1);
});