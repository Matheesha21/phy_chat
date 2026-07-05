import React, { useEffect, useState } from 'react';
import { Lecturer, lecturerService } from '../services/lecturerService';
import { LecturerCard } from '../components/Cards/LecturerCard';
import { toast } from 'sonner';
export const LecturersPage: React.FC = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const data = await lecturerService.getLecturers();
        setLecturers(data);
      } catch (error) {
        toast.error('Failed to load lecturers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLecturers();
  }, []);
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Academic Staff
        </h2>
        <p className="text-muted-foreground">
          Find contact information and office hours for our lecturers.
        </p>
      </div>

      {isLoading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) =>
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-6 h-64 animate-pulse">
          
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-secondary"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-5 bg-secondary rounded"></div>
                  <div className="w-1/2 h-4 bg-secondary rounded"></div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="w-full h-4 bg-secondary rounded"></div>
                <div className="w-full h-4 bg-secondary rounded"></div>
                <div className="w-4/5 h-4 bg-secondary rounded"></div>
              </div>
            </div>
        )}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lecturers.map((lecturer) =>
        <LecturerCard key={lecturer.id} lecturer={lecturer} />
        )}
        </div>
      }
    </div>);

};