'use client';

import type { Guest } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Phone, ShieldAlert } from 'lucide-react';

type GuestDetailsProps = {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
};

export function GuestDetails({ guest, isOpen, onClose }: GuestDetailsProps) {
  if (!guest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Анкета гостя</DialogTitle>
          <DialogDescription>
            Подробная информация о госте.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-4 text-center">
          <Avatar className="h-32 w-32 border-4">
            <AvatarImage src={guest.photo} alt={guest.full_name} data-ai-hint="person portrait" />
            <AvatarFallback>
              <User className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold font-headline">{guest.full_name}</h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              {guest.phone}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              По списку
            </Badge>
            {guest.is_blacklisted ? (
              <Badge variant="destructive">
                <ShieldAlert className="mr-1 h-3 w-3" />В черном списке
              </Badge>
            ) : (
              <Badge variant="outline">Чист</Badge>
            )}
          </div>
          {guest.description && (
            <div className="w-full text-sm bg-muted/50 p-3 rounded-lg mt-2 text-left">
                <p className="font-medium">Заметки:</p>
                <p className="text-muted-foreground">{guest.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
