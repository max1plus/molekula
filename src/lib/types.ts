export type Guest = {
  id: string;
  full_name: string;
  photo: string;
  phone: string;
  description: string;
  is_blacklisted: boolean;
  guest_category: 'list';
};

export type AttendanceLog = {
  id: string;
  guest_id: string;
  guest_name: string;
  check_in_time: any; // Using `any` for Firebase Timestamp
  admin_id: string;
};
