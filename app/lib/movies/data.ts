import { sql } from '@vercel/postgres';
// 退出静态缓存
import { unstable_noStore as noStore } from 'next/cache';
import { Movies } from './entity';

export async function fetchMovies() {
  noStore();
  try {
    const data = await sql<Movies>`SELECT * FROM movies`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movies data.');
  }
}
