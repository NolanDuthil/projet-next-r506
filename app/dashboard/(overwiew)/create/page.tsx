import Form from '@/app/ui/gestion/create-form';
import Breadcrumbs from '@/app/ui/gestion/breadcrums';



export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard' },
          {
            label: 'Create Intervenant',
            href: '/dashboard/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}