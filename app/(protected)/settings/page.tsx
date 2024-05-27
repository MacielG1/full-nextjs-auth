'use client';

import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import settings from '@/lib/actions/settings';
import { userSessionSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function page() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const session = useSession();

  async function handleUpdate(data: z.infer<typeof userSessionSchema>) {
    startTransition(async () => {
      const res = await settings(data);

      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.success) {
        setSuccess(res.success);
        toast.success(res.success);
      }
    });
  }

  const form = useForm<z.infer<typeof userSessionSchema>>({
    resolver: zodResolver(userSessionSchema),
    defaultValues: {
      // name: session.data?.user?.name || undefined,
      name: '',
    },
  });

  return (
    <Card className="w-[40rem]">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">Settings</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleUpdate)}
          >
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={session.data?.user?.name || undefined}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
