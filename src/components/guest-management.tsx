'use client';

import { useState, useMemo } from 'react';
import type { Guest } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { PlusCircle, Search, User, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GuestForm } from './guest-form';
import { ScrollArea } from './ui/scroll-area';

type GuestManagementProps = {
  initialGuests: Guest[];
};

export function GuestManagement({ initialGuests }: GuestManagementProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const filteredGuests = useMemo(() => {
    return guests
      .filter((guest) =>
        guest.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((guest) => {
        if (filter === 'all') return true;
        if (filter === 'blacklisted') return guest.is_blacklisted;
        if (filter === 'list') return guest.guest_category === 'list';
        if (filter === 'ticket_buyer') return guest.guest_category === 'ticket_buyer';
        return true;
      });
  }, [guests, searchTerm, filter]);

  const handleAddGuest = () => {
    setEditingGuest(null);
    setIsDialogOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по ФИО..."
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
              <SelectItem value="list">Списки</SelectItem>
              <SelectItem value="ticket_buyer">Билеты</SelectItem>
              <SelectItem value="blacklisted">Черный список</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddGuest} className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Добавить гостя
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Гость</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={guest.photo} alt={guest.full_name} data-ai-hint="person portrait" />
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
                    <Badge variant="secondary">
                      {guest.guest_category === 'list'
                        ? 'По списку'
                        : 'Купил билет'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {guest.is_blacklisted ? (
                      <Badge variant="destructive">В черном списке</Badge>
                    ) : (
                      <Badge variant="outline">Чист</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGuest(guest)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGuest ? 'Редактировать гостя' : 'Добавить гостя'}
            </DialogTitle>
          </DialogHeader>
          <GuestForm
            guest={editingGuest}
            onFinished={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
