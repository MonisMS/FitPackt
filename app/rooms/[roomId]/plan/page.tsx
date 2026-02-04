import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships, plans } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import PlanForm from './PlanForm';

export default async function PlanPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get room
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    redirect('/dashboard');
  }

  // Check if user is a member
  const membership = await db.query.roomMemberships.findFirst({
    where: and(
      eq(roomMemberships.roomId, roomId),
      eq(roomMemberships.userId, user.id)
    ),
  });

  if (!membership) {
    redirect('/dashboard');
  }

  // Get plan
  const plan = await db.query.plans.findFirst({
    where: eq(plans.roomId, roomId),
    with: {
      updatedBy: true,
    },
  });

  const isActive = room.status === 'active' && new Date(room.endDate) >= new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/rooms/${roomId}`}
            className="text-sm text-gray-600 hover:text-black mb-4 inline-block"
          >
            ← Back to {room.name}
          </Link>
          <h1 className="text-3xl font-bold mb-2">Plan</h1>
          <p className="text-gray-600">
            Define what you want to achieve and how you'll get there
          </p>
        </div>

        {!isActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              This room has ended. The plan is read-only.
            </p>
          </div>
        )}

        {plan && plan.updatedBy && (
          <div className="bg-gray-100 rounded-lg p-3 mb-6 text-sm text-gray-600">
            Last updated by <span className="font-medium">{plan.updatedBy.name}</span> on{' '}
            {new Date(plan.updatedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            • Version {plan.version}
          </div>
        )}

        <PlanForm
          roomId={roomId}
          userId={user.id}
          existingPlan={plan}
          isReadOnly={!isActive}
        />
      </div>
    </div>
  );
}
