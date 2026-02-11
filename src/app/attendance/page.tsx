import { AttendanceView } from '@/components/attendance-view';

export const dynamic = 'force-dynamic';

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Посещаемость</h1>
        <p className="text-muted-foreground">
          Выберите дату, чтобы посмотреть список пришедших гостей.
        </p>
      </div>
      <AttendanceView />
    </div>
  );
}
