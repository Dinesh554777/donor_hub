import React from 'react';
import { BloodStock } from '../types';
import { EditIcon } from './icons';

interface BloodStockCardProps {
  stock: BloodStock;
  onEdit?: () => void;
}

const BloodStockCard: React.FC<BloodStockCardProps> = ({ stock, onEdit }) => {
  const getBorderColor = () => {
    if (stock.units < 10) return 'border-red-300 bg-red-50';
    if (stock.units < 20) return 'border-yellow-300 bg-yellow-50';
    return 'border-green-300 bg-green-50';
  }

  const getTextColor = () => {
    if (stock.units < 10) return 'text-red-600';
    if (stock.units < 20) return 'text-yellow-600';
    return 'text-green-600';
  }

  return (
    <div className={`relative border rounded-lg p-3 text-center ${getBorderColor()}`}>
       {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={`Edit stock for ${stock.type}`}
        >
          <EditIcon className="w-4 h-4" />
        </button>
      )}
      <div className={`text-3xl font-bold ${getTextColor()}`}>{stock.type}</div>
      <div className="text-gray-700 font-semibold">{stock.units}</div>
      <div className="text-xs text-gray-500">Units</div>
    </div>
  );
};

export default BloodStockCard;