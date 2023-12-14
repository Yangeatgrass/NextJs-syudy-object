const { db } = require('@vercel/postgres');
const {
  movies
} = require('../app/lib/movies-data.js');

async function seedMovies(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "movies" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS movies (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "movies" table`);

    const insertedMovies = await Promise.all(
      movies.map(
        (movie) => client.sql`
        INSERT INTO movies (id, name, path, image_url)
        VALUES (${movie.id}, ${movie.name}, ${movie.path}, ${movie.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedMovies.length} movies`);

    return {
      createTable,
      movies: insertedMovies,
    };
  } catch (error) {
    console.error('Error seeding movies:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await seedMovies(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
