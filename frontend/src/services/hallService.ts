import { apiClient } from './api';

export interface Hall {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hasProjector: boolean;
  type: 'Auditorium' | 'Lecture Room' | 'Laboratory';
}

const mockHalls: Hall[] = [
{
  id: '1',
  name: 'Main Auditorium',
  location: 'Science Faculty Building, Ground Floor',
  capacity: 300,
  hasProjector: true,
  type: 'Auditorium'
},
{
  id: '2',
  name: 'Hall A',
  location: 'Physics Department, 1st Floor',
  capacity: 100,
  hasProjector: true,
  type: 'Lecture Room'
},
{
  id: '3',
  name: 'Hall B',
  location: 'Physics Department, 1st Floor',
  capacity: 80,
  hasProjector: true,
  type: 'Lecture Room'
},
{
  id: '4',
  name: 'Advanced Physics Lab',
  location: 'Physics Department, 2nd Floor',
  capacity: 40,
  hasProjector: false,
  type: 'Laboratory'
}];


export const hallService = {
  getHalls: () => apiClient.get('/api/halls', mockHalls)
};