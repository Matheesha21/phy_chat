import React, { useEffect, useState } from 'react';
import { Hall, hallService } from '../services/hallService';
import { HallCard } from '../components/Cards/HallCard';
import { toast } from 'sonner';
export const HallsPage: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const data = await hallService.getHalls();
        setHalls(data);
      } catch (error) {
        toast.error('Failed to load halls');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHalls();
  }, []);
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Lecture Halls
        </h2>
        <p className="text-muted-foreground">
          Information about department venues and facilities.
        </p>
      </div>

      {isLoading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) =>
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-5 h-40 animate-pulse">
          
              <div className="flex justify-between mb-4">
                <div className="w-1/2 h-6 bg-secondary rounded"></div>
                <div className="w-1/4 h-6 bg-secondary rounded-full"></div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="w-full h-4 bg-secondary rounded"></div>
                <div className="w-3/4 h-4 bg-secondary rounded"></div>
              </div>
            </div>
        )}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) =>
        <HallCard key={hall.id} hall={hall} />
        )}
        </div>
      }
    </div>);

};