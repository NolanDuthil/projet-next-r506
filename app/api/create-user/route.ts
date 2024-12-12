import { NextResponse } from 'next/server';
import { createAdminUser } from '@/app/lib/actions';

export async function GET() {
  const result = await createAdminUser();
  return NextResponse.json(result);
}