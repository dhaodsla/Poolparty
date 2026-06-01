import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/hooks';

export function PhotoGallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const base64Url = canvas.toDataURL('image/jpeg', 0.6);
          
          await addDoc(collection(db, 'photos'), {
            userId: user.uid,
            url: base64Url,
            createdAt: Date.now()
          });
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 border border-brand-accent/20 rounded-2xl p-5 md:p-6 bg-white/50 backdrop-blur-sm mb-4">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-accent/10">
        <h3 className="text-sm font-serif font-bold text-brand-text flex items-center gap-2">
          <span>사진 갤러리</span>
          <ImageIcon className="w-4 h-4 text-brand-accent/60" />
        </h3>
        <button 
          onClick={() => {
            if (!user) {
              alert('사진을 올리려면 먼저 닉네임으로 입장해주세요.');
              return;
            }
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="text-xs bg-brand-accent text-white px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-brand-accent/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {uploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Camera className="w-3 h-3" />}
          사진 올리기
        </button>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {photos.length === 0 ? (
          <div className="col-span-full py-8 text-center text-brand-accent/40 text-xs flex flex-col items-center">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <p>아직 등록된 사진이 없습니다<br/>첫 번째 사진을 올려보세요!</p>
          </div>
        ) : (
          photos.map(p => (
            <div key={p.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-brand-accent/10 relative group">
              <img src={p.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
