import { Movies } from '@/app/lib/movies/entity';
// 增强版image组件
import Image from 'next/image';

export default async function MovieCard({ movie }: { movie: Movies }) {
  return (
    <div className="flex-0 flex-shrink-0 flex-grow-0 md:w-1/3  sm:w-1">
      <div className="m-5 shadow-sm">
        <Image
          src={movie.image_url}
          width={300}
          height={660}
          alt={movie.name}
        />
      </div>
    </div>
  );
}
