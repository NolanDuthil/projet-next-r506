import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
      <div className="flex h-20 w-full items-end rounded-lg bg-redunilim p-3 md:h-36">
          <div className="w-32 text-white md:w-36 bg-white p-2 rounded-lg">
            <Image src="/logo-unilim.webp" alt="Logo unilim" width={500} height={500}></Image>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}