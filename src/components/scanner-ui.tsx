'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { processScan } from '@/lib/actions';
import type { Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlacklistAlert } from './blacklist-alert';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, User, XCircle, QrCode } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Проверка...
        </>
      ) : (
        <>
          <QrCode className="mr-2 h-4 w-4" /> Проверить
        </>
      )}
    </Button>
  );
}

export function ScannerUI() {
  const [state, formAction] = useFormState(processScan, { success: false });
  const [scannedGuest, setScannedGuest] = useState<Guest | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const [key, setKey] = useState(Date.now()); // to reset form

  const handleFormAction = async (formData: FormData) => {
    const result = await processScan(undefined, formData.get('guestId') as string);
    setScannedGuest(result.guest || null);
    
    if (result.success) {
      toast({
        title: 'Доступ разрешен',
        description: `Гость ${result.guest?.full_name} успешно прошел проверку.`,
        className: 'bg-green-600 border-green-500 text-white',
      });
    } else {
      if (result.error === 'Guest is blacklisted') {
        setIsAlertOpen(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: result.error === 'Guest not found' ? 'Гость не найден.' : 'Гость уже прошел сегодня.',
        });
      }
    }
    // Reset the form input
    const form = document.getElementById('scan-form') as HTMLFormElement;
    form?.reset();
    setKey(Date.now());
  };


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center font-headline">
          Проверка доступа
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form id="scan-form" action={handleFormAction} className="space-y-4" key={key}>
          <Input
            name="guestId"
            placeholder="Введите ID гостя (e.g., qr-guest-1)"
            className="text-center h-12 text-lg"
            autoFocus
          />
          <SubmitButton />
        </form>

        {scannedGuest && (
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Avatar className="h-24 w-24 border-4 border-muted">
                  <AvatarImage src={scannedGuest.photo} alt={scannedGuest.full_name} data-ai-hint="person portrait" />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{scannedGuest.full_name}</h3>
                  <p className="text-muted-foreground">{scannedGuest.phone}</p>
                </div>
                 {state.success ? (
                    <Badge className="bg-green-600 hover:bg-green-500 text-white">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Доступ разрешен
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Доступ запрещен
                    </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <BlacklistAlert
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          guestName={scannedGuest?.full_name || 'Гость'}
        />
      </CardContent>
    </Card>
  );
}
