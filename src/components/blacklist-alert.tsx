'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ShieldAlert } from 'lucide-react';

type BlacklistAlertProps = {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
};

export function BlacklistAlert({
  isOpen,
  onClose,
  guestName,
}: BlacklistAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-destructive border-red-400 text-destructive-foreground">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center gap-4">
            <ShieldAlert className="h-24 w-24" />
            <AlertDialogTitle className="text-4xl font-headline font-bold">
              ДОСТУП ЗАПРЕЩЕН
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-center text-lg text-red-200 pt-4">
            Гость <span className="font-bold">{guestName}</span> находится в
            черном списке. Не пропускать.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
          >
            ПОНЯТНО
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
