import { KeyIcon, PencilIcon, PlusIcon, TrashIcon, ArrowPathIcon, DownloadIcon, ImportIcon } from '@/app/ui/icons';
import Link from 'next/link';
import { deleteIntervenants, createIntervenants, newKeyIntervenants, regenerateAllKeys, exportIntervenantsAvailability, importWorkloads } from '@/app/lib/actions';

export function CreateIntervenants() {
  return (
    <Link
      href="/dashboard/create"
      className="flex h-10 items-center rounded-lg bg-redunilim px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
    >
      <span className="hidden md:block">Create Intervenants</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateIntervenants({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/edit/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteIntervenants({ id, onDelete }: { id: number, onDelete: () => void }) {
  const handleDelete = async () => {
    await deleteIntervenants(id);
    onDelete();
  };

  return (
    <button onClick={handleDelete} className="rounded-md border p-2 hover:bg-gray-100">
      <TrashIcon className="w-5" />
    </button>
  );
}

export function NewKeyIntervenants({ id, onRegenerate }: { id: number, onRegenerate: () => void }) {
  const handleNewKey = async () => {
    await newKeyIntervenants(id);
    onRegenerate();
  };

  return (
    <button onClick={handleNewKey} className="rounded-md border p-2 hover:bg-gray-100">
      <KeyIcon className="w-5" />
    </button>
  );
}

export function RegenerateAllKeys({ onRegenerate }: { onRegenerate: () => void }) {
  const handleRegenerateAll = async () => {
    await regenerateAllKeys();
    onRegenerate();
  };

  return (
    <button onClick={handleRegenerateAll} className="flex gap-2 rounded-md border p-2 hover:bg-gray-100">
      <ArrowPathIcon className="w-5" />
      <KeyIcon className='w-5' />
    </button>
  );
}

export function ExportAvailability() {
  const handleExport = async () => {
    const data = await exportIntervenantsAvailability();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intervenants_availability.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="flex gap-2 rounded-md border p-2 hover:bg-gray-100">
      <DownloadIcon className="w-5" />
      <span>Export Availability</span>
    </button>
  );
}

export function ImportWorkloads({ onImport }: { onImport: () => void }) {
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const workloads = JSON.parse(text);
        await importWorkloads(workloads);
        onImport();
      };
      reader.readAsText(file);
    }
  };

  return (
    <label className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
      <ImportIcon className="w-5" />
      <span>Import</span>
      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
    </label>
  );
}