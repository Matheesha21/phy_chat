

// Prisma enum values can't contain spaces, so we map between the DB enum
// (`LectureRoom`) and the display value the frontend expects (`Lecture Room`).

export const hallTypeToApi = {
  Auditorium: 'Auditorium',
  LectureRoom: 'Lecture Room',
  Laboratory: 'Laboratory'
};

export const hallTypeToDb = {
  Auditorium: 'Auditorium',
  'Lecture Room': 'LectureRoom',
  Laboratory: 'Laboratory'
};

// Convert a Prisma Hall row into the shape the frontend consumes.
export function serializeHall(hall) {
  return {
    ...hall,
    type: hallTypeToApi[hall.type] ?? hall.type
  };
}