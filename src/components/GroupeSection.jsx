const GroupSection = () => {
  const groups = [
    { name: 'BTS', logo: 'https://placeholder.com/bts' },
    { name: 'Blackpink', logo: 'https://placeholder.com/bp' },
    { name: 'Huntrix', logo: 'https://placeholder.com/hx' },
    { name: 'Stray Kids', logo: 'https://placeholder.com/sk' },
    { name: 'Twice', logo: 'https://placeholder.com/tw' },
    { name: 'New Jeans', logo: 'https://placeholder.com/nj' },
    { name: 'Ateez', logo: 'https://placeholder.com/at' },
    { name: 'Seventeen', logo: 'https://placeholder.com/sv' },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col gap-3 group cursor-pointer">
            <div className="aspect-square bg-black rounded-xl flex items-center justify-center p-8 transition-transform group-hover:scale-105">
              {/* Replace with actual group logo images */}
              <span className="text-white font-bold text-center">{group.name}</span>
            </div>
            <span className="text-sm font-semibold">{group.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupSection;