export type Guest = {
  id: string;
  full_name: string;
  photo: string;
  phone: string;
  description: string;
  is_blacklisted: boolean;
  guest_category: 'list' | 'ticket_buyer';
};

export type AttendanceLog = {
  id: string;
  guest_id: string;
  check_in_time: Date;
  admin_id: string;
};
