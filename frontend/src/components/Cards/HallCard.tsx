import React from 'react';
import { Hall } from '../../services/hallService';
import { MapPin, Users, Projector } from 'lucide-react';
import { cn } from '../Layout/Sidebar';
interface HallCardProps {
  hall: Hall;
}
export const HallCard: React.FC<HallCardProps> = ({ hall }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-foreground">{hall.name}</h3>
        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium',
            hall.type === 'Auditorium' && 'bg-purple-100 text-purple-700',
            hall.type === 'Lecture Room' && 'bg-blue-100 text-blue-700',
            hall.type === 'Laboratory' && 'bg-green-100 text-green-700'
          )}>
          
          {hall.type}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" />
          <span>{hall.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary/70" />
          <span>Capacity: {hall.capacity} students</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Projector className="w-4 h-4 text-primary/70" />
          <span>
            {hall.hasProjector ? 'Projector Available' : 'No Projector'}
          </span>
        </div>
      </div>
    </div>);

};