import EditForm from '@/app/ui/gestion/edit-form';
import Breadcrumbs from '@/app/ui/gestion/breadcrums';
import { getIntervenants } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const intervenants = await getIntervenants();
  const intervenant = intervenants.find((i: Intervenants) => i.id === id);

  if (!intervenant) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/intervenants' },
          {
            label: 'Edit Intervenant',
            href: `/dashboard/intervenants/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm intervenant={intervenant} />
    </main>
  );
}