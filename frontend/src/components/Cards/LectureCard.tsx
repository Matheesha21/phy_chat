import React from 'react';
import { Lecture } from '../../services/lectureService';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
interface LectureCardProps {
  lecture: Lecture;
}
export const LectureCard: React.FC<LectureCardProps> = ({ lecture }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold mb-2">
            {lecture.courseCode}
          </span>
          <h3 className="font-bold text-lg text-foreground">
            {lecture.courseName}
          </h3>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary/70" />
          <span>{lecture.day}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary/70" />
          <span>{lecture.time}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <User className="w-4 h-4 text-primary/70" />
          <span>{lecture.lecturer}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary/70" />
          <span>{lecture.hall}</span>
        </div>
      </div>
    </div>);

};