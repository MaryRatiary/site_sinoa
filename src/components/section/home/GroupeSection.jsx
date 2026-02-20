
import groupes from "../../../data/groupes";
const GroupSection = () => {

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {groupes.map((group) => (
          <div key={group.url} className="flex flex-col gap-3 group cursor-pointer">
            <div className="aspect-square bg-black rounded-xl flex items-center justify-center p-8 transition-transform group-hover:scale-105">
              {/* Replace with actual group logo images */}
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={group.url}
                    alt="Kpop Demon"
                    className="object-cover h-full w-full"
                  />
                </div>
            </div>
            <span className="text-sm font-semibold">{group.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GroupSection;