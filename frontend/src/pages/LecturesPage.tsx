import React, { useEffect, useState } from 'react';
import { Lecture, lectureService } from '../services/lectureService';
import { LectureCard } from '../components/Cards/LectureCard';
import { toast } from 'sonner';
export const LecturesPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await lectureService.getLectures();
        setLectures(data);
      } catch (error) {
        toast.error('Failed to load lectures');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLectures();
  }, []);
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Lecture Schedule
        </h2>
        <p className="text-muted-foreground">
          View upcoming lectures and their locations.
        </p>
      </div>

      {isLoading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) =>
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-5 h-48 animate-pulse">
          
              <div className="w-16 h-6 bg-secondary rounded mb-4"></div>
              <div className="w-3/4 h-6 bg-secondary rounded mb-6"></div>
              <div className="space-y-3">
                <div className="w-full h-4 bg-secondary rounded"></div>
                <div className="w-5/6 h-4 bg-secondary rounded"></div>
              </div>
            </div>
        )}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) =>
        <LectureCard key={lecture.id} lecture={lecture} />
        )}
        </div>
      }
    </div>);

};