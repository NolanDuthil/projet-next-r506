import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-8 bg-gray-100">
      <div className="flex h-fit shrink-0 items-end rounded-lg bg-redunilim p-4 md:h-52">
        <Image
          src="/logo-unilim.webp"
          width={300}
          height={50}
          alt="Logo Unilim"
          className="bg-background p-2 rounded-lg"
        />
      </div>
      <div className="mt-6 flex grow flex-col gap-6 md:flex-row">
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white shadow-lg px-8 py-12 md:px-16">
          <div className="antialiased text-2xl text-gray-900 md:text-4xl md:leading-relaxed">
            <p>Dispo Intervenants</p>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-6 self-start rounded-lg bg-redunilim px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-purple-500 md:text-lg">
            <span>Log in</span> <ArrowRightIcon className="w-6 md:w-7" />
          </Link>
        </div>
      </div>
    </main>
  );
}