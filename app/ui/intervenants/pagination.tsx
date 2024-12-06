'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        {pages.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 border border-gray-300 bg-white text-gray-500">{page}</span>
            ) : (
              <Link
                href={`?page=${page}`}
                className={`px-3 py-2 border ${page === currentPage ? 'border-redunilim bg-redunilim text-white' : 'border-gray-300 bg-white text-gray-500'}`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}