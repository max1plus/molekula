'use client';

import { useState, useMemo } from 'react';
import type { Guest, AttendanceLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, User, CheckCircle } from 'lucide-react';
import { GuestDetails } from './guest-details';
import { ScrollArea } from './ui/scroll-area';

type GuestManagementProps = {
  initialGuests: Guest[];
  todaysLogs: AttendanceLog[];
};

export function GuestManagement({ initialGuests, todaysLogs }: GuestManagementProps) {
  const [guests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);

  const checkedInGuestIds = useMemo(() => new Set(todaysLogs.map(log => log.guest_id)), [todaysLogs]);

  const filteredGuests = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    
    const filterByCategory = (guest: Guest) => {
        if (filter === 'all') return true;
        if (filter === 'blacklisted') return guest.is_blacklisted;
        if (filter === 'checked_in') return checkedInGuestIds.has(guest.id);
        if (filter === 'not_checked_in') return !checkedInGuestIds.has(guest.id);
        return true;
    }

    let sortedGuests = [...guests].sort((a, b) => {
        const aChecked = checkedInGuestIds.has(a.id);
        const bChecked = checkedInGuestIds.has(b.id);
        if (aChecked && !bChecked) return 1;
        if (!aChecked && bChecked) return -1;
        return a.full_name.localeCompare(b.full_name);
    });

    if (!lowerCaseSearchTerm) {
      return sortedGuests.filter(filterByCategory);
    }

    return sortedGuests
      .filter(
        (guest) =>
          guest.full_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          guest.phone.replace(/\D/g, '').includes(lowerCaseSearchTerm.replace(/\D/g, ''))
      )
      .filter(filterByCategory);
  }, [guests, searchTerm, filter, checkedInGuestIds]);

  const handleViewGuest = (guest: Guest) => {
    setViewingGuest(guest);
  };

  const handleCloseDialog = () => {
    setViewingGuest(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по ФИО или телефону..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Фильтр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="checked_in">Пришли</SelectItem>
              <SelectItem value="not_checked_in">Не пришли</SelectItem>
              <SelectItem value="blacklisted">Черный список</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Гость</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <TableRow
                    key={guest.id}
                    onClick={() => handleViewGuest(guest)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={guest.photo}
                            alt={guest.full_name}
                            data-ai-hint="person portrait"
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{guest.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {guest.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {guest.is_blacklisted ? (
                        <Badge variant="destructive">В черном списке</Badge>
                      ) : checkedInGuestIds.has(guest.id) ? (
                        <Badge className="bg-green-600 hover:bg-green-500 text-white">
                          <CheckCircle className="mr-1 h-3 w-3" /> Пришел
                        </Badge>
                      ) : (
                        <Badge variant="outline">Ожидается</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Гости не найдены.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <GuestDetails
        guest={viewingGuest}
        isOpen={!!viewingGuest}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
