/**
 * Utility functions that don't require server actions
 */

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
