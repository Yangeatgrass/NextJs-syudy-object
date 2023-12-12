'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// 钩子函数： 获取url参数
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// 防抖函数
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  // 获取当前路径
  const pathname = usePathname();
  // 获取替换路由实例
  const { replace } = useRouter();

  // 搜索框防抖
  const SearchHandler = useDebouncedCallback((searchStr) => {
    // 获取url参数实例
    const params = new URLSearchParams(searchParams);

    console.log(params);
    console.log(searchStr);

    if (searchStr.trim()) {
      params.set('query', searchStr);
      params.set('page', '1');
    } else {
      params.delete('query');
    }

    // 更新路由
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  // function SearchHandler(searchStr: string) {
  //   // 获取url参数实例
  //   const params = new URLSearchParams(searchParams);

  //   console.log(params);
  //   console.log(searchStr);

  //   if (searchStr.trim()) {
  //     params.set('query', searchStr);
  //   } else {
  //     params.delete('query');
  //   }

  //   // 更新路由
  //   replace(`${pathname}?${params.toString()}`);
  // }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          SearchHandler(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
