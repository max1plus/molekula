import type { Guest, AttendanceLog } from './types';

// In-memory store for demonstration purposes
export let guests: Guest[] = [
  {
    id: 'qr-guest-1',
    full_name: 'Иван Иванов',
    photo: 'https://picsum.photos/seed/guest1/400/400',
    phone: '+7 (999) 123-45-67',
    description: 'Постоянный гость, предпочитает крафтовое пиво.',
    is_blacklisted: false,
    guest_category: 'list',
  },
  {
    id: 'qr-guest-2',
    full_name: 'Мария Кузнецова',
    photo: 'https://picsum.photos/seed/guest2/400/400',
    phone: '+7 (999) 234-56-78',
    description: 'Купила билет на концерт. Аллергия на орехи.',
    is_blacklisted: false,
    guest_category: 'ticket_buyer',
  },
  {
    id: 'qr-guest-3',
    full_name: 'Пётр Сидоров',
    photo: 'https://picsum.photos/seed/guest3/400/400',
    phone: '+7 (999) 345-67-89',
    description: 'Конфликтный. Устроил драку 15.05.2024.',
    is_blacklisted: true,
    guest_category: 'list',
  },
  {
    id: 'qr-guest-4',
    full_name: 'Анна Попова',
    photo: 'https://picsum.photos/seed/guest4/400/400',
    phone: '+7 (999) 456-78-90',
    description: 'VIP-гость, друг владельца.',
    is_blacklisted: false,
    guest_category: 'list',
  },
  {
    id: 'qr-guest-5',
    full_name: 'Сергей Фёдоров',
    photo: 'https://picsum.photos/seed/guest5/400/400',
    phone: '+7 (999) 567-89-01',
    description: 'Купил билет онлайн.',
    is_blacklisted: false,
    guest_category: 'ticket_buyer',
  },
];

export let attendanceLogs: AttendanceLog[] = [];

// Functions to manipulate the in-memory store
export const addGuestToStore = (guest: Guest) => {
  guests.push(guest);
};

export const updateGuestInStore = (updatedGuest: Guest) => {
  guests = guests.map((g) => (g.id === updatedGuest.id ? updatedGuest : g));
};

export const addLogToStore = (log: AttendanceLog) => {
  attendanceLogs.push(log);
};
