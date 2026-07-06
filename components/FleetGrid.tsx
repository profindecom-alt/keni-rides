import BikeCard from './BikeCard';
import type { Bike } from '@/lib/bikes';

export default function FleetGrid({ bikes, stagger = 0.07 }: { bikes: Bike[]; stagger?: number }) {
  return (
    <div className="grid grid-3">
      {bikes.map((bike, i) => (
        <BikeCard key={bike.slug} bike={bike} delay={(i % 3) * stagger} />
      ))}
    </div>
  );
}
