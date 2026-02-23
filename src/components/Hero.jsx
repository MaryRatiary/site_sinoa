export default function Hero() {
  return (
    // Added responsive height for the Hero section
    <div className="relative w-full h-[50vh] md:h-[70vh] flex items-end overflow-hidden">
      <img 
        src="/image 1 page d'acceuil.jpg" 
        alt="Kpop Demon " 
        className="object-cover h-full w-full"
      />
    </div>
  );
}

