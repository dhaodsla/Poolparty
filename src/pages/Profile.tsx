import { useAuth, OperationType, handleFirestoreError } from '../lib/hooks';
import { loginWithNickname, logout } from '../lib/firebase';
import { User, LogIn, LogOut } from 'lucide-react';
import React, { useState } from 'react';

export function Profile() {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setLoggingIn(true);
    await loginWithNickname(nickname.trim());
    setLoggingIn(false);
  };
  
  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin"></div></div>;
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <h1 className="text-9xl font-serif italic text-brand-accent">SY.</h1>
        </div>
        <div className="bg-white border border-brand-accent/20 rounded-2xl p-10 max-w-sm w-full text-center space-y-8 shadow-sm relative z-10">
          <div className="w-20 h-20 bg-brand-sidebar rounded-full flex items-center justify-center mx-auto text-brand-accent/40 mb-2 border border-brand-accent/10 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-serif italic text-brand-accent tracking-tight mb-2">Guest Access</h2>
            <p className="text-brand-accent/60 text-xs leading-relaxed font-medium">Please enter a nickname to view the guest list, chat, and RSVP for the Summer Social Night.</p>
          </div>
          <form onSubmit={handleJoin} className="space-y-4">
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              className="w-full bg-brand-bg border border-brand-accent/20 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-brand-accent/40 text-brand-text text-center"
            />
            <button 
              type="submit"
              disabled={!nickname.trim() || loggingIn}
              className="w-full bg-brand-accent hover:bg-[#3d3d2b] text-white font-bold text-[10px] uppercase tracking-widest py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loggingIn ? 'Joining...' : 'Join Party'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <h1 className="text-9xl font-serif italic text-brand-accent">SY.</h1>
      </div>
      <div className="bg-white border border-brand-accent/20 rounded-2xl overflow-hidden max-w-sm w-full shadow-sm relative z-10">
        <div className="h-40 bg-brand-sidebar flex items-center justify-center border-b border-brand-accent/10">
          <h2 className="text-5xl font-serif italic opacity-10 text-brand-accent uppercase tracking-tighter">Stay</h2>
        </div>
        <div className="px-8 pb-8 pt-0 relative">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden absolute -top-12 shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-sidebar flex items-center justify-center text-brand-accent/40"><User className="w-8 h-8" /></div>
            )}
          </div>
          <div className="mt-16 mb-8 text-center flex flex-col items-center">
            <h2 className="text-xl font-serif italic font-medium tracking-tight text-brand-text mb-1">{user.displayName || 'Guest'}</h2>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent/60">Anonymous Guest</p>
          </div>
          
          <button 
            onClick={logout}
            className="w-full bg-white hover:bg-brand-sidebar text-brand-accent font-bold text-[10px] uppercase tracking-widest py-4 px-4 flex items-center justify-center gap-3 rounded-xl transition-colors border border-brand-accent/20 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
