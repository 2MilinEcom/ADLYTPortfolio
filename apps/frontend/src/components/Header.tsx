const Header = () => {
  return (
    <header className="sticky top-0 z-40 h-20 w-full bg-gradient-to-r from-[#111827] to-[#1F2937] flex items-center px-8 shadow-sm">
      <div className="flex-1 flex items-center">
        <div className="text-white font-bold text-2xl tracking-tight">LOGO</div>
      </div>
      <div className="flex-1 flex justify-center">
        <h1 className="text-white text-2xl font-semibold">Your Dashboard at a Glance</h1>
      </div>
      <div className="flex-1 flex justify-end items-center gap-4">
        <button className="bg-[#3B82F6] text-white font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform">Get Started</button>
        <div className="relative group">
          <div className="w-10 h-10 rounded-full bg-[#374151] flex items-center justify-center text-white font-bold cursor-pointer">U</div>
          {/* Dropdown placeholder */}
        </div>
      </div>
    </header>
  );
};

export default Header; 