'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Guest, AttendanceLog } from './types';

const GuestSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(3, 'ФИО должно быть не менее 3 символов'),
  phone: z.string().min(5, 'Неверный формат телефона'),
  description: z.string().optional(),
  is_blacklisted: z
    .string()
    .transform((val) => val === 'on')
    .or(z.boolean()),
  photo: z.string().url('Неверный URL фото').optional().or(z.literal('')),
});

export async function getGuests(): Promise<Guest[]> {
  const guestsCol = collection(db, 'guests');
  const guestSnapshot = await getDocs(guestsCol);
  const guestList = guestSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Guest[];
  return guestList;
}

export async function getAttendanceLogs(date: Date): Promise<AttendanceLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const logsCol = collection(db, 'attendance_logs');
  const q = query(
    logsCol,
    where('check_in_time', '>=', Timestamp.fromDate(startOfDay)),
    where('check_in_time', '<=', Timestamp.fromDate(endOfDay))
  );

  const logSnapshot = await getDocs(q);
  const logList = logSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      check_in_time: data.check_in_time.toDate(), // Convert Timestamp to Date
    } as AttendanceLog;
  });

  return logList;
}

export async function processScan(prevState: any, formData: FormData) {
  'use server';
  const guestId = formData.get('guestId') as string;

  // Check working hours (18:00 - 06:00)
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour >= 6 && currentHour < 18) {
    return { success: false, error: 'Bar is closed', guest: null };
  }

  const guestRef = doc(db, 'guests', guestId);
  const guestSnap = await getDoc(guestRef);

  if (!guestSnap.exists()) {
    return { success: false, error: 'Guest not found', guest: null };
  }

  const guest = { id: guestSnap.id, ...guestSnap.data() } as Guest;

  if (guest.is_blacklisted) {
    return { success: false, error: 'Guest is blacklisted', guest };
  }

  // Check if already checked in today (since last 18:00)
  const today = new Date();
  if (today.getHours() < 6) {
    // If it's after midnight but before 6am, check from yesterday 18:00
    today.setDate(today.getDate() - 1);
  }
  today.setHours(18, 0, 0, 0);

  const logsCol = collection(db, 'attendance_logs');
  const q = query(
    logsCol,
    where('guest_id', '==', guestId),
    where('check_in_time', '>=', Timestamp.fromDate(today))
  );
  const existingLog = await getDocs(q);

  if (!existingLog.empty) {
    return { success: false, error: 'Guest already checked in today', guest };
  }

  await addDoc(collection(db, 'attendance_logs'), {
    guest_id: guest.id,
    guest_name: guest.full_name,
    check_in_time: serverTimestamp(),
    admin_id: 'admin-001', // Placeholder admin ID
  });

  revalidatePath('/scanner');
  revalidatePath('/attendance');
  revalidatePath('/');
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
  const photoUrl = data.photo || `https://picsum.photos/seed/${Math.random()}/400/400`;

  const guestData = {
    ...data,
    photo: photoUrl,
    guest_category: 'list' as const,
  };

  try {
    if (id) {
      const guestRef = doc(db, 'guests', id);
      await updateDoc(guestRef, guestData);
    } else {
      await addDoc(collection(db, 'guests'), guestData);
    }
  } catch (error) {
    return { message: 'Ошибка сохранения в базу данных.' };
  }

  revalidatePath('/');
  return { message: 'Гость сохранен.' };
}
