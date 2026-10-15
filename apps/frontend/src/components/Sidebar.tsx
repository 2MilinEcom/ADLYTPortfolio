import { useState } from "react";

const sidebarItems = [
  { icon: "home", label: "Home" },
  { icon: "metrics", label: "Metrics" },
  { icon: "reports", label: "Reports" },
  { icon: "settings", label: "Settings" },
];

const iconMap: Record<string, JSX.Element> = {
  home: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h2a2 2 0 002-2v-6m-6 0h6" /></svg>,
  metrics: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17a2.5 2.5 0 01-5 0V7a2.5 2.5 0 015 0v10zm7 0a2.5 2.5 0 01-5 0V7a2.5 2.5 0 015 0v10z" /></svg>,
  reports: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>,
  settings: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>,
};

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 z-30 bg-[#111827] shadow-md flex flex-col py-8">
      <nav className="flex flex-col gap-2 mt-8">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 px-6 py-3 rounded-lg hover:bg-[#1F2A37] transition group text-[#9CA3AF] hover:text-white"
          >
            <span className="text-2xl">{iconMap[item.icon]}</span>
            <span className="text-base font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 