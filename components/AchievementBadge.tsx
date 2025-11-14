
import React from 'react';
import { Achievement } from '../types';
import { StarIcon, LockIcon } from './icons';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, unlocked }) => {
  const baseClasses = "flex flex-col items-center justify-center p-6 rounded-xl text-center transition-all duration-300 transform";
  const unlockedClasses = "bg-yellow-50 border-2 border-yellow-300 shadow-lg hover:-translate-y-2";
  const lockedClasses = "bg-gray-100 border border-gray-200 text-gray-400";

  return (
    <div className={`${baseClasses} ${unlocked ? unlockedClasses : lockedClasses}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${unlocked ? 'bg-yellow-400 text-white' : 'bg-gray-200'}`}>
        {unlocked ? <StarIcon className="w-8 h-8" /> : <LockIcon className="w-8 h-8" />}
      </div>
      <h3 className={`font-bold text-lg ${unlocked ? 'text-yellow-900' : 'text-gray-600'}`}>{achievement.title}</h3>
      <p className="text-sm mt-1">{achievement.description}</p>
    </div>
  );
};

export default AchievementBadge;
