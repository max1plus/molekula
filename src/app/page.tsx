import { getGuests } from '@/lib/actions';
import { GuestManagement } from '@/components/guest-management';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function GuestsPage() {
  const guests = await getGuests();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Список гостей</h1>
        <p className="text-muted-foreground">
          Управляйте доступом, ищите и редактируйте информацию о гостях.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <GuestManagement initialGuests={guests} />
      </Suspense>
    </div>
  );
}
