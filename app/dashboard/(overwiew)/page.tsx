"use client"

import { Suspense, useState, useEffect } from 'react';
import Pagination from '@/app/ui/gestion/pagination';
import Table from '@/app/ui/gestion/table';
import { IntervenantsTableSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import { useSearchParams } from 'next/navigation';
import { CreateIntervenants } from '@/app/ui/gestion/buttons';

export default function Gestion() {
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    return (
        <main className="flex min-h-screen flex-col p-6">
            <h1>Gestion des Intervenants :</h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Rechercher des intervenants" />
                <CreateIntervenants />
            </div>
            <Suspense fallback={<IntervenantsTableSkeleton />}>
                <Table currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </main>
    );
}