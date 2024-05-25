'use client';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import CardParent from '@/components/auth/CardParent';
import { verifyEmail } from '@/lib/actions/verifyEmail';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function VerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) return setError('Token not found');

    const data = await verifyEmail(token);
    setError(data.error);
    setSuccess(data.success);
  }, [token, success, error]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardParent
      returnLabel="Login"
      returnHref="/auth/login"
      title="Verify your email"
    >
      <div className="w-full grid place-items-center gap-1">
        {!error && !success && (
          <LoaderCircle size={24} className="animate-spin" />
        )}
        <FormSuccess message={success} />

        {!success && <FormError message={error} />}
      </div>
    </CardParent>
  );
}
