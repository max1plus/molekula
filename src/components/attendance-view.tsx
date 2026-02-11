'use client';

import { useState, useEffect, useTransition } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { getAttendanceLogs } from '@/lib/actions';
import type { AttendanceLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { ru } from 'date-fns/locale';

export function AttendanceView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (date) {
      startTransition(async () => {
        const fetchedLogs = await getAttendanceLogs(date);
        setLogs(fetchedLogs);
      });
    }
  }, [date]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          locale={ru}
        />
      </div>
      <div className="rounded-lg border bg-card">
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Гость</TableHead>
                <TableHead>Время прихода</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className='space-y-2'>
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-8 w-full' />
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.guest_name}</TableCell>
                    <TableCell>
                      {new Date(log.check_in_time).toLocaleTimeString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Нет данных за выбранный день.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
