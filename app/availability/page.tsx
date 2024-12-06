// FILE: app/availability/page.tsx

import { validateKey } from '@/app/lib/utils';
import { notFound } from 'next/navigation';

type Props = {
  message: string;
};

const AvailabilityPage = async ({ searchParams }: { searchParams: { key?: string } }) => {
  const key = searchParams.key;

  if (!key || typeof key !== 'string') {
    notFound();
  }

  const { valid, intervenant, message } = await validateKey(key);

  if (!valid) {
    return <div>{message}</div>;
  }

  return <div>Bonjour {intervenant.firstname} {intervenant.lastname}</div>;
};

export default AvailabilityPage;