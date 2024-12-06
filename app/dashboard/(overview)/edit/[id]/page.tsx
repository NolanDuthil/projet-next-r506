import Form from '@/app/ui/intervenants/edit-form';
import Breadcrumbs from '@/app/ui/intervenants/breadcrumbs';
import { Metadata } from 'next';
import { fetchIntervenantById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit Intervenant',
};

export default async function Page({ params }: { params: { id: string } }) {
  const intervenant = await fetchIntervenantById(params.id);

  if (!intervenant) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/' },
          {
            label: 'Edit',
            href: ``,
          },
          {
            label: intervenant.firstname,
            href: `/dashboard/edit/${params.id}`,
            active: true,
          }
        ]}
      />
      <Form intervenant={intervenant} />
    </main>
  );
}