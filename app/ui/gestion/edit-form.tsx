'use client';

import { Intervenants } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { updateIntervenants, State } from '@/app/lib/actions';
import { useState, startTransition } from 'react';
import { EnvelopeIcon, UserCircleIcon, CalendarIcon } from '../icons';

export default function EditForm({ intervenant }: { intervenant: Intervenants }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateIntervenants, initialState);
  const [formData, setFormData] = useState<Partial<Intervenants>>({
    email: intervenant.email,
    firstname: intervenant.firstname,
    lastname: intervenant.lastname,
    enddate: intervenant.enddate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('id', intervenant.id.toString());
    formDataObj.append('email', formData.email || '');
    formDataObj.append('firstname', formData.firstname || '');
    formDataObj.append('lastname', formData.lastname || '');
    formDataObj.append('enddate', formData.enddate || '');

    startTransition(() => {
      formAction(formDataObj);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
          {state.errors?.firstname && (
            <p className="mt-2 text-sm text-red-600">{state.errors.firstname[0]}</p>
          )}
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
          {state.errors?.lastname && (
            <p className="mt-2 text-sm text-red-600">{state.errors.lastname[0]}</p>
          )}
        </div>

        {/* End Date */}
        <div className="mb-4 relative">
          <label htmlFor="enddate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="enddate"
              name="enddate"
              type="date"
              value={formData.enddate}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
          {state.errors?.enddate && (
            <p className="mt-2 text-sm text-red-600">{state.errors.enddate[0]}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Intervenant</Button>
      </div>
    </form>
  );
}