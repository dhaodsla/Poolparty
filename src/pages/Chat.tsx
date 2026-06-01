import React, { useState, useEffect, useRef } from 'react';
import { useAuth, OperationType, handleFirestoreError } from '../lib/hooks';
import { db, loginWithNickname } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { Send, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [loginNickname, setLoginNickname] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    // Only fetch last 100 messages for the demo
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })).reverse();
      setMessages(data);
      
      const newMap = { ...userMap };
      let updated = false;
      for (const msg of data) {
        if (!newMap[msg.userId]) {
          try {
            const userDoc = await getDoc(doc(db, 'users', msg.userId));
            if (userDoc.exists()) {
              newMap[msg.userId] = userDoc.data();
              updated = true;
            }
          } catch(e) {}
        }
      }
      if (updated) setUserMap(newMap);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages'));
    
    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!text.trim()) return;
    
    const currentText = text.trim();
    setText('');
    
    try {
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        text: currentText,
        createdAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginNickname.trim()) return;
    setLoggingIn(true);
    await loginWithNickname(loginNickname.trim());
    setLoggingIn(false);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
      <div className="bg-white border border-brand-accent/20 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="bg-brand-sidebar p-5 md:p-6 border-b border-brand-accent/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif italic text-brand-accent tracking-tight">Party Feed</h2>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent/60 mt-1">Live Conversation</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-brand-bg">
          {!user && (
            <div className="text-center p-4 bg-white border border-brand-accent/20 rounded-xl mb-4 text-brand-accent/60 text-xs font-medium shadow-sm">
              ✨ Please sign in to join the conversation.
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = user?.uid === msg.userId;
            const profile = userMap[msg.userId];
            const displayName = profile?.displayName || 'Guest';
            const showProfile = i === 0 || messages[i-1].userId !== msg.userId;
            
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-serif overflow-hidden shrink-0 border-2 border-white/50 ${isMe ? 'bg-[#D2B48C] text-white' : 'bg-brand-accent/10 text-brand-text'}`}>
                  {showProfile ? (
                    profile?.photoURL ? (
                      <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{displayName.charAt(0).toUpperCase()}</span>
                    )
                  ) : null}
                </div>
                
                <div className={`flex-1 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${isMe ? 'bg-brand-accent text-white rounded-tr-none' : 'bg-white rounded-tl-none border border-brand-accent/5'}`}>
                    <p className="text-[12px] leading-relaxed">{msg.text}</p>
                  </div>
                  <div className={`text-[8px] uppercase mt-1.5 block ${isMe ? 'text-brand-accent/40' : 'opacity-40'}`}>
                    {displayName} · {format(new Date(msg.createdAt), 'MM.dd HH:mm')}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={user ? handleSend : handleJoin} className="p-4 bg-white border-t border-brand-accent/10">
           <div className="flex items-center gap-3 bg-brand-bg p-2 rounded-full border border-brand-accent/20">
            {user ? (
              <>
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Say something..."
                  className="flex-1 bg-transparent border-none text-xs px-3 focus:outline-none placeholder-brand-accent/40 text-brand-text"
                />
                <button 
                  type="submit"
                  disabled={!text.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-brand-accent text-white rounded-full transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="w-3 h-3 ml-[-1px]" />
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  value={loginNickname}
                  onChange={(e) => setLoginNickname(e.target.value)}
                  placeholder="Enter nickname to chat..."
                  className="flex-1 bg-transparent border-none text-xs px-3 focus:outline-none placeholder-brand-accent/40 text-brand-text"
                />
                <button 
                  type="submit"
                  disabled={!loginNickname.trim() || loggingIn}
                  className="px-4 h-8 flex items-center justify-center bg-brand-accent text-white font-bold text-[10px] uppercase tracking-widest rounded-full transition-colors disabled:opacity-50 shrink-0"
                >
                  Join
                </button>
              </>
            )}
           </div>
        </form>
      </div>
    </div>
  );
}
