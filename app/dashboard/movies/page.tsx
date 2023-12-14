import MoviesCategory from '@/app/ui/movies/Navigation/category';
import { rubikBubbles } from '@/app/ui/fonts';
import MoviesList from '@/app/ui/movies/list/index';

export default function Page() {
  return (
    // <div className="bg-zinc-800 h-full w-full p-5">
    <div className="h-full w-full">
      <div>
        {/* 导航栏 */}
        <div className="flex justify-between space-x-3">
          <p
            className={`${rubikBubbles.className} text-3xl font-bold text-cyan-800`}
          >
            Yang
          </p>
          <div>
            <MoviesCategory></MoviesCategory>
          </div>
        </div>
      </div>
      <div className='mt-20'>
        {/* 电影列表 */}
        <MoviesList />
      </div>
    </div>
  );
}
