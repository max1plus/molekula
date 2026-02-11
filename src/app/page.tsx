import { getGuests, getAttendanceLogs } from '@/lib/actions';
import { GuestManagement } from '@/components/guest-management';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default async function GuestsPage() {
  const guests = await getGuests();

  const today = new Date();
  if (today.getHours() < 6) {
    today.setDate(today.getDate() - 1);
  }
  today.setHours(18, 0, 0, 0);
  
  const todaysLogs = await getAttendanceLogs(today);


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Список гостей</h1>
        <p className="text-muted-foreground">
          Управляйте доступом, ищите и редактируйте информацию о гостях.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <GuestManagement initialGuests={guests} todaysLogs={todaysLogs} />
      </Suspense>
    </div>
  );
}
