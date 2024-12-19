"use client";

import { Intervenants } from "@/app/lib/definitions";
import { ClockIcon, UserCircleIcon } from "@/app/ui/icons";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { State, updateIntervenants } from "@/app/lib/actions";
import { useRouter } from 'next/navigation';

export default function EditIntervenantForm({
  intervenant,
}: {
  intervenant: Intervenants;
}) {
  const initialState: State = { message: null, errors: {} };
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await updateIntervenants(intervenant.id.toString(), initialState, formData);
    if (!result.errors) {
      router.push('/dashboard');
    }
  };

  const formattedEndDate = new Date(intervenant.enddate).toISOString().split('T')[0];

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="rounded-md bg-purple-50 p-4 md:p-6">
        {/* Intervenant email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={intervenant.email}
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Intervenant firstname */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            Firstname
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="firstname"
                name="firstname"
                type="text"
                defaultValue={intervenant.firstname}
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Intervenant lastname */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Lastname
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="text"
                defaultValue={intervenant.lastname}
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Intervenant date validité */}
        <div className="mb-4">
          <label htmlFor="enddate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="enddate"
                name="enddate"
                type="date"
                defaultValue={formattedEndDate}
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}