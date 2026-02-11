'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveGuest } from '@/lib/actions';
import type { Guest } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GuestFormSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(3, 'ФИО должно быть не менее 3 символов'),
  phone: z.string().min(5, 'Неверный формат телефона'),
  description: z.string().optional(),
  is_blacklisted: z.boolean(),
  guest_category: z.enum(['list', 'ticket_buyer']),
  photo: z.string().optional(), // In a real app, this would be a file upload
});

type GuestFormProps = {
  guest: Guest | null;
  onFinished: () => void;
};

export function GuestForm({ guest, onFinished }: GuestFormProps) {
  const [state, formAction] = useFormState(saveGuest, { message: '' });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof GuestFormSchema>>({
    resolver: zodResolver(GuestFormSchema),
    defaultValues: {
      id: guest?.id || '',
      full_name: guest?.full_name || '',
      phone: guest?.phone || '',
      description: guest?.description || '',
      is_blacklisted: guest?.is_blacklisted || false,
      guest_category: guest?.guest_category || 'list',
      photo: guest?.photo || '',
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Ошибка сохранения',
          description: state.message,
        });
      } else {
        toast({
          title: 'Успех',
          description: state.message,
        });
        onFinished();
      }
    }
  }, [state, toast, onFinished]);

  const { formState } = form;

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        {guest && <input type="hidden" name="id" value={guest.id} />}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ФИО</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input placeholder="+7 (999) 123-45-67" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guest_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="list">По списку</SelectItem>
                  <SelectItem value="ticket_buyer">Купил билет</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заметки о госте</FormLabel>
              <FormControl>
                <Textarea placeholder="Особые приметы, предпочтения..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* In a real app, this would be a file input component */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL фото</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Вставьте URL-адрес фотографии гостя.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_blacklisted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-card">
              <div className="space-y-0.5">
                <FormLabel>Черный список</FormLabel>
                <FormDescription>
                  Запретить гостю доступ в заведение.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={formState.isSubmitting} className="w-full">
          {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>
    </Form>
  );
}
