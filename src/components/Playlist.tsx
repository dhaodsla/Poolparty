import React from 'react';
import { Music, PlayCircle } from 'lucide-react';

export function Playlist() {
  const songs = [
    { title: "Summer Nights", artist: "Siân", duration: "3:42" },
    { title: "Poolside Vibes", artist: "Dj. Yoon", duration: "4:15" },
    { title: "Sunset Groove", artist: "Eleanor", duration: "2:58" },
    { title: "Midnight Swim", artist: "The Waves", duration: "5:01" },
  ];

  return (
    <div className="mt-4 border border-brand-accent/20 rounded-2xl p-5 md:p-6 bg-white/50 backdrop-blur-sm mb-4">
      <h3 className="text-sm font-serif font-bold text-brand-text mb-4 pb-3 border-b border-brand-accent/10 flex items-center justify-between">
        <span>파티 플레이리스트</span>
        <Music className="w-4 h-4 text-brand-accent/60" />
      </h3>
      <div className="space-y-3">
        {songs.map((song, i) => (
          <div key={i} className="flex items-center p-3 hover:bg-brand-bg rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-brand-accent/10">
            <div className="w-8 h-8 rounded-full bg-brand-accent/5 flex items-center justify-center mr-3 group-hover:bg-brand-accent/10">
              <PlayCircle className="w-4 h-4 text-brand-accent/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-text">{song.title}</p>
              <p className="text-xs text-brand-accent/70 mt-0.5">{song.artist}</p>
            </div>
            <span className="text-xs font-mono text-brand-accent/40">{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
