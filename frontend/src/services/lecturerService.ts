import { apiClient } from './api';

export interface Lecturer {
  id: string;
  name: string;
  title: string;
  specialization: string;
  email: string;
  officeHours: string;
  room: string;
  imageUrl?: string;
}

const mockLecturers: Lecturer[] = [
{
  id: '1',
  name: 'Dr. N. Perera',
  title: 'Senior Lecturer',
  specialization: 'Quantum Physics',
  email: 'n.perera@sci.sjp.ac.lk',
  officeHours: 'Tue & Thu, 10:00 AM - 12:00 PM',
  room: 'Room 402'
},
{
  id: '2',
  name: 'Prof. S. Silva',
  title: 'Professor',
  specialization: 'Thermodynamics & Statistical Mechanics',
  email: 's.silva@sci.sjp.ac.lk',
  officeHours: 'Mon & Wed, 01:00 PM - 03:00 PM',
  room: 'Room 405'
},
{
  id: '3',
  name: 'Dr. K. Bandara',
  title: 'Lecturer',
  specialization: 'Classical Mechanics',
  email: 'k.bandara@sci.sjp.ac.lk',
  officeHours: 'Fri, 09:00 AM - 11:00 AM',
  room: 'Room 301'
}];


export const lecturerService = {
  getLecturers: () => apiClient.get('/api/lecturers', mockLecturers)
};