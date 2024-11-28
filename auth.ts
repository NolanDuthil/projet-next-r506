import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import type { Users } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import db from '@/app/lib/db';

async function getUser(email: string): Promise<Users | undefined> {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        client.release();
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('Invalid credentials');
                    return null;
                }

                const email = credentials.email;
                const password = credentials.password;

                const user = await getUser(email);
                if (!user) {
                    console.log('User not found');
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    return user;
                } else {
                    console.log('Invalid password');
                    return null;
                }
            },
        }),
    ],
});