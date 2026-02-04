/**
 * Utility functions that don't require server actions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a room is currently active (not ended or deleted)
 */
export function isRoomActive(room: { status: string; endDate: Date }): boolean {
  if (room.status === 'deleted') return false;
  if (room.status === 'ended') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(room.endDate);
  endDate.setHours(0, 0, 0, 0);

  return endDate >= today;
}
