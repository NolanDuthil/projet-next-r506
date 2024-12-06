import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';
import Image from 'next/image';
 
export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-redunilim p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Image
                src="/logo-unilim.webp"
                width={300}
                height={50}
                alt="Logo Unilim"
                className="bg-background p-2 rounded-lg"
            />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}