import type { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '@/app/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}