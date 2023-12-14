const categoryList = [
  {
    name: '推荐',
    path: '/',
    style: '',
  },
  {
    name: '电影',
    path: '/',
    style: '',
  },
  {
    name: '连续剧',
    path: '/',
    style: '',
  },
  {
    name: 'TOP100',
    path: '/',
    style: '',
  },
];

export default async function MoviesCategory() {
  return (
    <div className="text-cyan-700 flex space-x-10 text-lg font-bold">
      {categoryList.map((item) => (
        <a href={item.path} key={item.name} className={item.style}>
          {item.name}
        </a>
      ))}
    </div>
  );
}
