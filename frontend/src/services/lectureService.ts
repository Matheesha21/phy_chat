import { apiClient } from './api';

export interface Lecture {
  id: string;
  courseCode: string;
  courseName: string;
  time: string;
  lecturer: string;
  hall: string;
  day: string;
}

const mockLectures: Lecture[] = [
{
  id: '1',
  courseCode: 'PHY301',
  courseName: 'Quantum Mechanics',
  time: '09:00 AM - 11:00 AM',
  lecturer: 'Dr. N. Perera',
  hall: 'Hall A',
  day: 'Monday'
},
{
  id: '2',
  courseCode: 'PHY202',
  courseName: 'Thermodynamics',
  time: '11:00 AM - 01:00 PM',
  lecturer: 'Prof. S. Silva',
  hall: 'Hall B',
  day: 'Monday'
},
{
  id: '3',
  courseCode: 'PHY101',
  courseName: 'Classical Mechanics',
  time: '08:00 AM - 10:00 AM',
  lecturer: 'Dr. K. Bandara',
  hall: 'Main Auditorium',
  day: 'Tuesday'
},
{
  id: '4',
  courseCode: 'PHY405',
  courseName: 'Solid State Physics',
  time: '01:00 PM - 03:00 PM',
  lecturer: 'Dr. N. Perera',
  hall: 'Hall C',
  day: 'Wednesday'
}];


export const lectureService = {
  getLectures: () => apiClient.get('/api/lectures', mockLectures)
};