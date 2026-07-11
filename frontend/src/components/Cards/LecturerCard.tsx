import React from 'react';
import { Lecturer } from '../../services/lecturerService';
import { Mail, Clock, MapPin } from 'lucide-react';
interface LecturerCardProps {
  lecturer: Lecturer;
}
export const LecturerCard: React.FC<LecturerCardProps> = ({ lecturer }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
          {lecturer.name.
          split(' ').
          map((n) => n[0]).
          join('').
          substring(0, 2)}
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{lecturer.name}</h3>
          <p className="text-sm text-primary font-medium">{lecturer.title}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground font-medium">
          Specialization
        </p>
        <p className="text-sm text-foreground">{lecturer.specialization}</p>
      </div>

      <div className="mt-auto space-y-3 pt-4 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Mail className="w-4 h-4 text-primary/70" />
          <a
            href={`mailto:${lecturer.email}`}
            className="hover:text-primary transition-colors truncate">
            
            {lecturer.email}
          </a>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary/70" />
          <span className="truncate">{lecturer.officeHours}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary/70" />
          <span>{lecturer.room}</span>
        </div>
      </div>
    </div>);

};