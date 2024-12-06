import Form from '@/app/ui/intervenants/create-form';
import Breadcrumbs from '@/app/ui/intervenants/breadcrumbs';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() { 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard' },
          {
            label: 'Create Intervenants',
            href: '/dashboard/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}