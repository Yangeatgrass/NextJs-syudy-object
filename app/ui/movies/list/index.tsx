import { fetchMovies } from '@/app/lib/movies/data';
import MovieCard from '@/app/ui/movies/common/MovieCard';

export default async function MoviesList() {
  // 获取电影列表
  const movies = await fetchMovies();
  //   console.log(movies);

  return (
    <div className='flex justify-around flex-wrap '>
      {/* 卡片 */}
      {movies.map((movie) => (
        <MovieCard movie={movie} key={movie.id} />
      ))}
    </div>
  );
}
