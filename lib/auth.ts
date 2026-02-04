import { auth } from '@clerk/nextjs/server';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();

  if (!user.onboarded) {
    throw new Error('User not onboarded');
  }

  return user;
}
