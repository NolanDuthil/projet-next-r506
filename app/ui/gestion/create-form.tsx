'use client';

import { Intervenants } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { createIntervenants, State } from '@/app/lib/actions';
import { useState } from 'react';
import { EnvelopeIcon, UserCircleIcon } from '../icons';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createIntervenants, initialState);
  const [formData, setFormData] = useState<Partial<Intervenants>>({
    email: '',
    firstname: '',
    lastname: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Email */}
        <div className="mb-4 relative">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
          {state.errors?.email && (
            <p className="mt-2 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Firstname */}
        <div className="mb-4 relative">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            Firstname
          </label>
          <div className="relative">
            <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Lastname */}
        <div className="mb-4 relative">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Lastname
          </label>
          <div className="relative">
            <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Intervenant</Button>
      </div>
    </form>
  );
}