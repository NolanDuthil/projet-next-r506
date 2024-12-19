"use client"

import { useEffect, useState } from 'react';
import { formatDateToLocal } from '@/app/lib/utils';
import { NewKeyIntervenants, UpdateIntervenants, DeleteIntervenants } from '@/app/ui/intervenants/buttons';
import { CheckCircleIcon, ExclamationCircleIcon } from '@/app/ui/icons';
import { Intervenants } from '@/app/lib/definitions';

export default function Table({ query, currentPage, itemsPerPage }: { query: string; currentPage: number; itemsPerPage: number }) {
    const [intervenants, setIntervenants] = useState<Intervenants[]>([]);
    const today = new Date();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/intervenants/get?query=${query}&page=${currentPage}&limit=${itemsPerPage}`);
            const result = await response.json();
            if (Array.isArray(result)) {
                setIntervenants(result);
            } else {
                setIntervenants([]);
            }
        };

        fetchData();
    }, [query, currentPage, itemsPerPage]);

    const refreshData = async () => {
        const response = await fetch(`/api/intervenants/get?query=${query}&page=${currentPage}&limit=${itemsPerPage}`);
        const result = await response.json();
        setIntervenants(result);
    };

    if (intervenants.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-purple-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {intervenants.map((intervenant) => (
                            <div
                                key={intervenant.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p>{intervenant.firstname} {intervenant.lastname}</p>
                                        <p className="text-sm text-gray-500">{intervenant.email}</p>
                                    </div>
                                    {new Date(intervenant.enddate) > today ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <ExclamationCircleIcon className="h-6 w-6 text-red-500" />}
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p>{intervenant.key}</p>
                                        <p>{formatDateToLocal(intervenant.creationdate)}</p>
                                        <p>{formatDateToLocal(intervenant.enddate)}</p>
                                    </div>
                                    <div className='flex gap-2'>
                                        <NewKeyIntervenants id={intervenant.id} onRegenerate={refreshData} />
                                        <UpdateIntervenants id={intervenant.id} />
                                        <DeleteIntervenants id={intervenant.id} onDelete={refreshData} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Firstname
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Lastname
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Key
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Creation Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    End Date
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {intervenants.map((intervenant) => (
                                <tr
                                    key={intervenant.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        {new Date(intervenant.enddate) > today ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <ExclamationCircleIcon className="h-6 w-6 text-red-500" />}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        {intervenant.firstname}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {intervenant.lastname}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {intervenant.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {intervenant.key}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(intervenant.creationdate)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {formatDateToLocal(intervenant.enddate)}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <NewKeyIntervenants id={intervenant.id} onRegenerate={refreshData} />
                                            <UpdateIntervenants id={intervenant.id} />
                                            <DeleteIntervenants id={intervenant.id} onDelete={refreshData} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}