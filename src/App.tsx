/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { User, MessageSquare, Home as HomeIcon } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-sans">
        <Nav />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-accent/10">
      <div className="px-6 md:px-10 py-4 md:py-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-serif italic tracking-tight text-brand-accent hover:opacity-80 transition-opacity">Stay Yeon</h1>
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-60">Dalseong-gun, Daegu</span>
        </Link>
        <div className="flex items-center gap-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
          <Link to="/" className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <HomeIcon className="w-3 h-3 md:w-4 md:h-4" />Home
          </Link>
          <Link to="/chat" className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />Chat
          </Link>
          <Link to="/profile" className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <User className="w-3 h-3 md:w-4 md:h-4" />Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

