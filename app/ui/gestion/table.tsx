"use client"

import { useEffect, useState } from 'react';
import { formatDateToLocal } from '@/app/lib/utils';

export default function Table({ query, currentPage }: { query: string, currentPage: number }) {
    const [intervenants, setIntervenants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/intervenants/get?query=${query}&page=${currentPage}`);
            const result = await response.json();
            setIntervenants(result);
        };

        fetchData();
    }, [query, currentPage]);

    if (intervenants.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
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
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p>{intervenant.key}</p>
                                        <p>{formatDateToLocal(intervenant.creationdate)}</p>
                                        <p>{formatDateToLocal(intervenant.enddate)}</p>
                                        <p>{JSON.stringify(intervenant.availability)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
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
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Availability
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
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {JSON.stringify(intervenant.availability)}
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