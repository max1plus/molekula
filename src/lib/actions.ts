'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import {
  guests,
  attendanceLogs,
  addGuestToStore,
  updateGuestInStore,
  addLogToStore,
} from './data';
import type { Guest } from './types';

const GuestSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(3, 'ФИО должно быть не менее 3 символов'),
  phone: z.string().min(5, 'Неверный формат телефона'),
  description: z.string().optional(),
  is_blacklisted: z.boolean(),
  guest_category: z.enum(['list', 'ticket_buyer']),
  photo: z.string().url('Неверный URL фото').optional(),
});

export async function getGuests(): Promise<Guest[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return guests;
}

export async function processScan(prevState: any, formData: FormData) {
  'use server';
  const guestId = formData.get('guestId') as string;
  await new Promise((resolve) => setTimeout(resolve, 500));
  const guest = guests.find((g) => g.id === guestId);

  if (!guest) {
    return { success: false, error: 'Guest not found', guest: null };
  }

  if (guest.is_blacklisted) {
    return { success: false, error: 'Guest is blacklisted', guest };
  }

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyCheckedIn = attendanceLogs.some(
    (log) =>
      log.guest_id === guestId &&
      new Date(log.check_in_time).getTime() > today.getTime()
  );

  if (alreadyCheckedIn) {
    return { success: false, error: 'Guest already checked in today', guest };
  }

  addLogToStore({
    id: `log-${Date.now()}`,
    guest_id: guest.id,
    check_in_time: new Date(),
    admin_id: 'admin-001', // Placeholder admin ID
  });

  revalidatePath('/scanner');
  return { success: true, guest, error: null };
}

export async function saveGuest(prevState: any, formData: FormData) {
  'use server';
  const validatedFields = GuestSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Ошибка валидации.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, ...data } = validatedFields.data;

  // Simulate file upload
  await new Promise((resolve) => setTimeout(resolve, 500));
  const photoUrl = data.photo || 'https://picsum.photos/seed/newguest/400/400';

  if (id) {
    // Update existing guest
    const existingGuest = guests.find((g) => g.id === id);
    if (existingGuest) {
      const updatedGuest = { ...existingGuest, ...data, photo: photoUrl };
      updateGuestInStore(updatedGuest);
    }
  } else {
    // Create new guest
    const newGuest: Guest = {
      id: `qr-guest-${Date.now()}`,
      ...data,
      photo: photoUrl,
    };
    addGuestToStore(newGuest);
  }

  revalidatePath('/');
  return { message: 'Гость сохранен.' };
}
