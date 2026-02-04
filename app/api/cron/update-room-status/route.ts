import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active rooms
    const activeRooms = await db.query.rooms.findMany({
      where: eq(rooms.status, 'active'),
    });

    let updatedCount = 0;

    // Check each room and update if ended
    for (const room of activeRooms) {
      const endDate = new Date(room.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < today) {
        await db
          .update(rooms)
          .set({ status: 'ended' })
          .where(eq(rooms.id, room.id));
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} room(s)`,
      updatedCount,
    });
  } catch (error) {
    console.error('Error updating room statuses:', error);
    return NextResponse.json(
      { error: 'Failed to update room statuses' },
      { status: 500 }
    );
  }
}
