import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// 这里只提供了用户名密码验证，也可以自己设置第三方凭证验证如：github，google
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { use } from 'react';

// !    1. 通过数据库查询用户信息
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // !    2. 通过z函数验证此邮箱是否存在于数据库
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // !    3. 存在 再验证密码是否正确
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // 调用bcrypt.compare检查密码是否匹配
          const passwordsMatch = await bcrypt.compare(password, user.password);
          // 匹配->返回用户信息
          if (passwordsMatch) return user;
        }

        // 不匹配阻止用户登录
        console.log("身份验证失败!");
        return null;
      },
    }),
  ],
});
