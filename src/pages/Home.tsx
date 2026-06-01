import React, { useState, useEffect } from 'react';
import { useAuth, OperationType, handleFirestoreError } from '../lib/hooks';
import { db, loginWithNickname } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Send, MapPin, Calendar, Users, Info, Plus, Minus, User, Share2, Crown, Star, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Home() {
  const { user } = useAuth();

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'STAY YEON POOL PARTY - 프라이빗 풀파티',
      text: '6월 26일 금요일, 스테이연 소수정예 프라이빗 풀파티에 초대합니다.',
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user cancelled or failed, fallback to clipboard if wanted
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('초대장 링크가 복사되었습니다. 카카오톡에 붙여넣기 하세요!');
      } catch (err) {
        alert('링크 복사에 실패했습니다.');
      }
    }
  };
  
  return (
    <>
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row border-x border-brand-accent/10">
      
      {/* Left Column: Media & Event Info */}
      <section className="flex-[7] p-6 text-brand-text md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-accent/10 bg-brand-bg">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="text-brand-text flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">STAY YEON POOL PARTY</span>
              <span className="text-xs font-medium text-brand-accent/60">6월 26일 금요일</span>
            </div>
            <button onClick={handleShare} className="text-brand-accent hover:bg-brand-accent/10 p-2 rounded-full transition-colors flex items-center gap-2 border border-brand-accent/20 bg-white shadow-sm" title="초대장 카카오톡으로 보내기">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">공유하기</span>
            </button>
          </div>
          <motion.h1 
            className="text-4xl md:text-5xl font-serif leading-[1.1] mb-6 tracking-tight text-brand-text font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            스테이연 <br /> 
            <span className="italic text-brand-accent font-normal text-3xl md:text-4xl block mt-1">프라이빗 풀파티</span>
          </motion.h1>

          <CountdownTimer />
          
          <div className="relative w-full aspect-video bg-[#E8E4DE] rounded-2xl overflow-hidden shadow-inner group mb-10">
            <img 
              src="/main-pool.jpg" 
              alt="STAY YEON Pool Party"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-brand-accent/10 pt-6 gap-6">
          <div className="space-y-3 max-w-md">
            <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-text tracking-tight">
              1박 2일 바비큐 & 소셜 파티
            </h2>
            <div className="space-y-1">
              <p className="text-xs font-semibold leading-relaxed text-brand-text">
                6월 26일 금요일,
              </p>
              <p className="text-xs leading-relaxed text-brand-accent/80">
                스테이연 A동·B동 전체를 사용하는 소수정예 프라이빗 풀파티에 초대합니다.
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs font-serif italic text-brand-accent">Join us</div>
            <div className="text-xl md:text-2xl font-light tracking-tighter text-brand-text">18:00 — 익일 11:00</div>
          </div>
        </div>

        {/* Party Conditions */}
        <div className="mt-8 border border-brand-accent/20 rounded-2xl p-5 md:p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="text-sm font-serif font-bold text-brand-text mb-4 pb-3 border-b border-brand-accent/10 flex items-center justify-between">
            <span>참여 안내 및 조건</span>
            <Info className="w-4 h-4 text-brand-accent/60" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-text mb-0.5">회비</strong>
                  <span className="text-brand-accent/80 leading-relaxed">10만원 (숙박, 식사, 바비큐, 주류 및 음료 모두 포함)</span>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-text mb-0.5">모집 인원</strong>
                  <span className="text-brand-accent/80 leading-relaxed">소수정예 15명 한정 (선착순 마감)</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-text mb-0.5">드레스 코드</strong>
                  <span className="text-brand-accent/80 leading-relaxed">자유 복장 (최소한의 예의를 갖춘 깔끔한 복장).<br />수영장 이용 시 수영복이나 래쉬가드를 지참해 주세요.</span>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-text mb-0.5">필수 매너</strong>
                  <span className="text-brand-accent/80 leading-relaxed">타인을 배려하는 젠틀한 오픈 마인드 필수</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="mt-4 border border-brand-accent/20 rounded-2xl p-5 md:p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="text-sm font-serif font-bold text-brand-text mb-4 pb-3 border-b border-brand-accent/10 flex items-center justify-between">
            <span>오시는 길 및 주차 안내</span>
            <MapPin className="w-4 h-4 text-brand-accent/60" />
          </h3>
          <div className="flex gap-4 items-start text-xs">
            <div className="w-10 h-10 rounded-full bg-[#E8E4DE] border border-brand-accent/20 flex items-center justify-center shrink-0">
               <MapPin className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <a 
                href="https://map.naver.com/p/search/%EB%8C%80%EA%B5%AC%20%EB%8B%AC%EC%84%B1%EA%B5%B0%20%EA%B5%AC%EC%A7%80%EB%A9%B4%20%EA%B5%AC%EC%A7%80%EB%82%A8%EB%A1%9C%2029"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col hover:opacity-70 transition-opacity group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <strong className="block text-brand-text text-sm font-bold">스테이연</strong>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-blue-600 leading-relaxed block font-medium underline underline-offset-4 decoration-blue-600/30">대구시 달성군 구지면 구지남로 29</span>
              </a>
              <span className="text-brand-accent/70 leading-relaxed block mt-2">숙소 주변 및 공용 주차 공간에 주차 가능합니다.<br />파티 당일 혼잡할 수 있으니 되도록 카풀을 권장합니다.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Interaction */}
      <section className="flex-[5] bg-brand-sidebar flex flex-col relative w-full overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <MiniCalendar />
          <ParticipantBoard />
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text flex justify-between items-center mt-8 pt-6 border-t border-brand-accent/10">
            Ticket Reservation <span className="text-brand-accent">Limited</span>
          </h3>
          <ReservationCard user={user} />
          
          <div className="mt-8 pt-6 border-t border-brand-accent/10">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text mb-4 text-center">
              Questions & Contact
            </h3>
            <a 
              href="https://open.kakao.com/o/seWtrDxi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#E5CD00] text-[#000000] font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-5.523 0-10 3.82-10 8.527 0 2.66 1.455 5.034 3.738 6.57-.315 1.135-1.127 3.899-1.163 4.03-.047.165.05.215.163.142.146-.092 3.42-2.222 4.024-2.618.995.275 2.083.425 3.238.425 5.523 0 10-3.818 10-8.526C22 6.82 17.523 3 12 3z" />
              </svg>
              카카오톡 오픈채팅으로 문의하기
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

function MiniCalendar() {
  const daysInMonth = 30;
  const firstDayOfWeek = 1; // 1 = Monday (June 1, 2026)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white border border-brand-accent/20 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-brand-accent/10 pb-3">
        <h3 className="text-sm font-serif font-bold text-brand-text">2026. 06</h3>
        <div className="flex items-center gap-2">
           <Calendar className="w-4 h-4 text-brand-accent" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(day => (
          <div key={day} className={`text-[10px] font-bold ${day === '일' ? 'text-red-400' : day === '토' ? 'text-blue-400' : 'text-brand-accent/60'}`}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map(b => (
          <div key={`blank-${b}`} className="p-1" />
        ))}
        {days.map(day => {
          const isPartyDate = day === 26;
          return (
            <div 
              key={day} 
              className={`p-1 text-xs rounded-lg flex items-center justify-center font-medium aspect-square ${
                isPartyDate 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-sm relative overflow-hidden' 
                  : 'text-brand-text/80 transition-colors'
              }`}
            >
              {isPartyDate && (
                 <motion.div 
                   className="absolute inset-0 bg-amber-200/50"
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                 />
              )}
              <span className="relative z-10">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParticipantBoard() {
  const [total, setTotal] = useState(0);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [reservations, setReservations] = useState<any[]>([]);
  const MAX_CAPACITY = 15;

  useEffect(() => {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let m = 0;
      let f = 0;
      const data: any[] = [];
      snapshot.forEach(doc => {
        const docData = doc.data();
        data.push({ id: doc.id, ...docData });
        if (docData.gender === 'M') m++;
        if (docData.gender === 'F') f++;
      });
      setMale(m);
      setFemale(f);
      setTotal(m + f);
      setReservations(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'reservations'));

    return () => unsubscribe();
  }, []);

  const percentage = Math.min((total / MAX_CAPACITY) * 100, 100);

  return (
    <div className="bg-white border border-brand-accent/20 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-serif font-bold text-brand-text">현재 참여 현황</h3>
        <span className="text-xs font-mono px-2 py-0.5 rounded border text-red-500 font-bold flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {total} / {MAX_CAPACITY}명
        </span>
      </div>

      {/* Individual Status Grid */}
      <div className="grid grid-cols-5 gap-2 md:gap-3 mb-5">
        {Array.from({ length: MAX_CAPACITY }).map((_, i) => {
          const res = reservations[i];
          if (res) {
            const isLeader = i === 0; // First person is the host/leader
            const isSpecialGuest = Math.random() > 0.8 && !isLeader; // Simulate special guest for demonstration

            return (
              <div 
                key={res.id} 
                className={`w-full aspect-square rounded-full flex flex-col items-center justify-center relative shadow-sm border ${
                  res.gender === 'M' 
                    ? 'bg-blue-50 border-blue-200 text-blue-500' 
                    : 'bg-pink-50 border-pink-200 text-pink-500'
                } ${isLeader ? 'ring-1 ring-amber-400 ring-offset-2 ring-offset-white z-10' : ''}`}
              >
                <User className="w-5 h-5 opacity-80" />
                {isLeader && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-amber-200" title="Host">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                )}
                {isSpecialGuest && !isLeader && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-brand-accent/10" title="Special Guest">
                    <Star className="w-3 h-3 text-purple-500" />
                  </div>
                )}
              </div>
            );
          }
          // Empty Spot
          return (
            <div 
              key={`empty-${i}`} 
              className="w-full aspect-square rounded-full border border-dashed border-red-300/50 bg-red-50 flex items-center justify-center relative cursor-pointer group"
            >
              <User className="w-4 h-4 text-red-400 opacity-60" />
            </div>
          );
        })}
      </div>
      
      <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden mb-4 border border-brand-accent/10">
        <div 
          className="h-full transition-all duration-1000 rounded-full bg-red-400 relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <motion.div 
            className="absolute top-0 bottom-0 w-10 bg-white/40 skew-x-[-20deg]"
            animate={{ left: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
          <span className="text-brand-text/80 font-medium">남자 {male}명</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-brand-text/80 font-medium">여자 {female}명</span>
          <div className="w-3 h-3 rounded bg-pink-100 border border-pink-200"></div>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ user }: { user: any }) {
  const [gender, setGender] = useState<'M' | 'F' | null>(null);
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    
    // Listen to user's reservation
    try {
       const q = query(collection(db, 'reservations'));
       // Filtering on client side for simplicity given we don't have indexes set up yet, 
       // but wait, we can just use doc ref if we know ID, but reservation ID is generated.
       // The rule allow list: if resource.data.userId == request.auth.uid;
       // We MUST query with where('userId', '==', user.uid), wait we need to import `where`
    } catch(e) {}
  }, [user]);

  const fetchMyReservation = () => {
    import('firebase/firestore').then(({ query, where, getDocs, collection }) => {
      if(!user) return;
      const q = query(collection(db, 'reservations'), where('userId', '==', user.uid));
      getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
          setReservation({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      }).catch(e => handleFirestoreError(e, OperationType.LIST, 'reservations'));
    });
  };

  useEffect(() => {
    fetchMyReservation();
  }, [user]);

  const [nicknameText, setNicknameText] = useState('');
  
  const handleReserve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      if (!nicknameText.trim()) return;
      setLoading(true);
      await loginWithNickname(nicknameText.trim());
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      if (reservation) {
        alert("이미 예약 신청되었습니다!");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'reservations'), {
        userId: user.uid,
        gender,
        status: 'pending',
        createdAt: Date.now()
      });
      fetchMyReservation();
      alert("예약 신청이 완료되었습니다! 확인 후 확정됩니다.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reservations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg md:bg-white border border-brand-accent/20 rounded-2xl p-6 shadow-sm">
      <div className="mb-6 border-b border-brand-accent/10 pb-4">
        <h3 className="text-xl font-serif italic text-brand-accent mb-1">참가 예약</h3>
        <p className="text-brand-accent/60 text-xs">6월 26일 · STAY YEON POOL PARTY</p>
      </div>

      {reservation ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 mb-1">Reserved</h4>
          <p className="text-green-600/80 text-xs mb-3">Awaiting host confirmation.</p>
          <div className="flex items-center justify-center gap-3 text-xs text-green-800 bg-white/50 py-2 rounded">
            <span>Gender: <strong>{reservation.gender === 'M' ? '남자' : '여자'}</strong></span>
            <span>Status: <strong>{reservation.status === 'pending' ? 'Pending' : 'Confirmed'}</strong></span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border border-brand-accent/20 p-3 rounded-xl bg-brand-bg">
            <span className="text-brand-text/80 font-semibold text-xs uppercase tracking-wider">성별 선택</span>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setGender('M')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  gender === 'M' 
                  ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm' 
                  : 'bg-white text-brand-text/60 border-brand-accent/20 hover:bg-brand-bg'
                }`}
              >
                남자
              </button>
              <button 
                type="button"
                onClick={() => setGender('F')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                  gender === 'F' 
                  ? 'bg-pink-100 text-pink-800 border-pink-200 shadow-sm' 
                  : 'bg-white text-brand-text/60 border-brand-accent/20 hover:bg-brand-bg'
                }`}
              >
                여자
              </button>
            </div>
          </div>

          {user ? (
            <button
              onClick={() => {
                if (!gender) return alert('성별을 선택해주세요.');
                handleReserve();
              }}
              disabled={loading || !gender}
              className="w-full bg-brand-accent hover:bg-[#3d3d2b] text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Reservation'}
            </button>
          ) : (
            <form onSubmit={(e) => {
              if (!gender) {
                e.preventDefault();
                return alert('성별을 먼저 선택해주세요.');
              }
              handleReserve(e);
            }} className="flex flex-col gap-3 pt-2">
              <input 
                type="text" 
                value={nicknameText}
                onChange={(e) => setNicknameText(e.target.value)}
                placeholder="Enter your nickname..."
                className="w-full bg-brand-sidebar border border-brand-accent/20 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-brand-accent/40 text-brand-text text-center mb-2"
              />
              <button
                type="submit"
                disabled={loading || !nicknameText.trim() || !gender}
                className="w-full bg-brand-accent hover:bg-[#3d3d2b] text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Sign in to Reserve'}
              </button>
            </form>
          )}
          <p className="text-[10px] text-center text-brand-accent/50 uppercase tracking-widest">Requires host approval</p>
        </div>
      )}
    </div>
  );
}



function CountdownTimer() {
  const partyDate = new Date('2026-06-26T18:00:00+09:00');
  
  const calculateTimeLeft = () => {
    const difference = partyDate.getTime() - new Date().getTime();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-1 bg-white border border-brand-accent/20 rounded-xl px-5 py-3 shadow-sm mb-10 mt-2">
      <div className="text-lg md:text-xl font-bold font-mono tracking-widest text-brand-text flex items-baseline">
        {timeLeft.days.toString().padStart(2, '0')}<span className="text-sm font-sans font-medium text-brand-text mr-2 ml-0.5">일</span>
        {timeLeft.hours.toString().padStart(2, '0')}<span className="text-sm font-sans font-medium text-brand-text mr-2 ml-0.5">시간</span>
        {timeLeft.minutes.toString().padStart(2, '0')}<span className="text-sm font-sans font-medium text-brand-text mr-2 ml-0.5">분</span>
        {timeLeft.seconds.toString().padStart(2, '0')}<span className="text-sm font-sans font-medium text-brand-text ml-0.5">초</span>
      </div>
    </div>
  );
}

