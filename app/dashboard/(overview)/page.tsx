"use client"

import { Suspense, useState, useEffect } from 'react';
import Pagination from '@/app/ui/intervenants/pagination';
import Table from '@/app/ui/intervenants/table';
import { IntervenantsTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlusIcon } from '@/app/ui/icons';
import { CreateIntervenants, RegenerateAllKeys, ExportAvailability } from '@/app/ui/intervenants/buttons';

export default function Gestion() {
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const currentPage = Number(searchParams.get('page')) || 1;

    const refreshData = async () => {
        // Fetch the total number of pages from the API or calculate it based on the data
        const response = await fetch(`/api/intervenants/totalPages?query=${query}`);
        const result = await response.json();
        setTotalPages(result.totalPages);
        setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to force re-render
    };

    useEffect(() => {
        refreshData();
    }, [query]);

    return (
        <main className="flex min-h-screen flex-col p-6">
            <h1>Gestion des Intervenants :</h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Rechercher des intervenants" />
                <CreateIntervenants />
                <RegenerateAllKeys onRegenerate={refreshData} />
                <ExportAvailability />
            </div>
            <Suspense fallback={<IntervenantsTableSkeleton />}>
                <Table key={refreshKey} query={query} currentPage={currentPage} itemsPerPage={10} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </main>
    );
}