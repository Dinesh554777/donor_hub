
import React from 'react';
import { BloodStock } from '../types';
import { BloodDropIcon } from './icons';

interface BloodStockIndicatorProps {
  stock: BloodStock;
}

const BloodStockIndicator: React.FC<BloodStockIndicatorProps> = ({ stock }) => {
  // FIX: Replaced property 'level' with 'units' to correctly reflect the BloodStock type.
  const getLevelColor = () => {
    if (stock.units < 30) return 'bg-red-500';
    if (stock.units < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // FIX: Replaced property 'level' with 'units'.
  const getBorderColor = () => {
    if (stock.units < 30) return 'border-red-600';
    if (stock.units < 60) return 'border-yellow-600';
    return 'border-green-600';
  }

  return (
    <div className="flex flex-col items-center space-y-2 p-2 rounded-lg bg-gray-50 border">
      <div className="font-bold text-2xl text-red-700">{stock.type}</div>
      <div className="relative w-20 h-28 bg-gray-200 rounded-b-full rounded-t-lg overflow-hidden border-2 border-gray-300 flex items-end">
        <div 
          // FIX: Replaced property 'level' with 'units'.
          className={`absolute bottom-0 w-full transition-all duration-500 ease-out ${getLevelColor()}`}
          // FIX: Replaced property 'level' with 'units' and assumed units can be represented as a percentage for visualization.
          style={{ height: `${stock.units}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <BloodDropIcon className="w-8 h-8 text-white opacity-20" />
        </div>
      </div>
      {/* FIX: Replaced property 'level' with 'units' and changed display from percentage to units. */}
      <div className={`font-semibold text-lg px-2 py-0.5 rounded-md text-white ${getLevelColor()}`}>
        {stock.units} Units
      </div>
    </div>
  );
};

export default BloodStockIndicator;