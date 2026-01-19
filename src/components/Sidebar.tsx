"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, CheckSquare, Trophy, Settings, LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'My Habits', href: '/dashboard/habits' },
  { icon: Trophy, label: 'Leaderboard', href: '/dashboard/leaderboard' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header / Navbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-40 border-b border-slate-800">
        <div className="text-xl font-bold text-blue-400 italic">HabitHero 🎮</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white p-6 flex flex-col z-50 transition-transform duration-300
        w-64 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="text-2xl font-bold mb-10 text-blue-400 italic hidden md:block">HabitHero 🎮</div>
        
        <nav className="flex-1 space-y-2 mt-12 md:mt-0">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-blue-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}