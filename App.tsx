import React, { useState, useEffect, useRef } from 'react';
import { SetupForm } from './components/SetupForm';
import { Envelope } from './components/Envelope';
import { ResultModal } from './components/ResultModal';
import { GameSettings, EnvelopeData } from './types';
import { generateEnvelopes } from './utils';
import { IMAGES, AUDIO } from './constants';

enum AppState {
  SETUP,
  SHUFFLING,
  PLAYING
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [envelopes, setEnvelopes] = useState<EnvelopeData[]>([]);
  const [selectedEnvelope, setSelectedEnvelope] = useState<EnvelopeData | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeDown = () => {
    setVolume(prev => Math.max(0, Number((prev - 0.1).toFixed(2))));
  };

  const handleVolumeUp = () => {
    setVolume(prev => Math.min(1, Number((prev + 0.1).toFixed(2))));
  };
  
  const handleStart = (settings: GameSettings) => {
    backgroundAudioRef.current?.play().catch(() => undefined);

    // Generate data
    const newEnvelopes = generateEnvelopes(
      settings.totalAmount,
      settings.totalEnvelopes,
      settings.mode,
      settings.denominations ?? []
    );
    setEnvelopes(newEnvelopes);
    
    // Start animation sequence
    setAppState(AppState.SHUFFLING);
  };

  useEffect(() => {
    if (appState === AppState.SHUFFLING) {
      // Shuffling duration (visual effect)
      const timer = setTimeout(() => {
        setAppState(AppState.PLAYING);
      }, 2500); // 2.5s of shuffling animation
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleEnvelopeClick = (envelope: EnvelopeData) => {
    // Show result
    setSelectedEnvelope(envelope);
    
    // Mark as opened
    const updatedEnvelopes = envelopes.map(e => 
      e.id === envelope.id ? { ...e, isOpened: true } : e
    );
    setEnvelopes(updatedEnvelopes);
  };

  const handleCloseModal = () => {
    setSelectedEnvelope(null);
  };

  const handleReset = () => {
    setAppState(AppState.SETUP);
    setEnvelopes([]);
    setSelectedEnvelope(null);
  };

  const allOpened = envelopes.length > 0 && envelopes.every(e => e.isOpened);

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden font-sans text-gray-900">
      <audio ref={backgroundAudioRef} src={AUDIO.BACKGROUND_MUSIC} autoPlay loop preload="auto" playsInline />
      
      {/* Mobile background: ưu tiên hiển thị trọn chiều cao ảnh */}
      <div 
        className="absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage: `url('${IMAGES.BACKGROUND}')`,
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Desktop/tablet background */}
      <div 
        className="fixed inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: `url('${IMAGES.BACKGROUND}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Overlay lớp phủ tối nhẹ để tăng độ tương phản cho nội dung */}
      <div className="absolute md:fixed inset-0 z-0 bg-black/10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center min-h-[100dvh]">
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-20 flex items-center gap-1.5 md:gap-2 bg-black/35 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-full backdrop-blur-sm">
          <span className="hidden sm:inline text-xs font-semibold">Âm lượng</span>
          <button
            type="button"
            onClick={handleVolumeDown}
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 font-bold"
            aria-label="Giảm âm lượng"
          >
            -
          </button>
          <span className="w-9 md:w-10 text-center text-[11px] md:text-xs font-bold">{Math.round(volume * 100)}%</span>
          <button
            type="button"
            onClick={handleVolumeUp}
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 font-bold"
            aria-label="Tăng âm lượng"
          >
            +
          </button>
        </div>
        
        {/* Header / Logo Area */}
        {appState !== AppState.SHUFFLING && (
            <div className="pt-10 md:pt-8 pb-3 md:pb-4 text-center animate-pop-in px-3 md:px-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic text-yellow-300 font-serif tracking-normal md:tracking-wide leading-tight drop-shadow-[0_6px_8px_rgba(120,0,0,0.9)] [text-shadow:0_2px_0_rgba(255,255,255,0.35),0_8px_16px_rgba(80,0,0,0.7)]">
                Hái Lộc Đầu Xuân
              </h1>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 w-full max-w-5xl flex items-center justify-center p-2 sm:p-4">
          
          {/* SETUP STATE */}
          {appState === AppState.SETUP && (
            <SetupForm onStart={handleStart} />
          )}

          {/* SHUFFLING STATE */}
          {appState === AppState.SHUFFLING && (
            <div className="flex flex-col items-center justify-center space-y-5 sm:space-y-8">
              <div className="relative w-40 h-40 sm:w-64 sm:h-64 animate-shake">
                <img src={IMAGES.LIXI} alt="Shuffling" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-white animate-pulse tracking-wide sm:tracking-widest drop-shadow-md text-center px-4">
                ĐANG TRỘN LÌ XÌ...
              </p>
            </div>
          )}

          {/* PLAYING STATE */}
          {appState === AppState.PLAYING && (
            <div className="flex flex-col items-center w-full h-full">
              
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 p-1.5 sm:p-4 overflow-y-auto max-h-[64dvh] sm:max-h-[70vh] custom-scrollbar">
                {envelopes.map((env, index) => (
                  <div key={env.id} className="flex justify-center">
                    <Envelope 
                      data={env} 
                      index={index} 
                      onClick={() => handleEnvelopeClick(env)} 
                      disabled={!!selectedEnvelope} // Disable clicking others while modal is open
                    />
                  </div>
                ))}
              </div>

              {allOpened ? (
                 <div className="mt-5 sm:mt-8 mb-6 sm:mb-8 animate-pop-in">
                    <button 
                        onClick={handleReset}
                        className="bg-white text-tet-red font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform text-base sm:text-lg"
                    >
                        CHƠI LẠI TỪ ĐẦU
                    </button>
                 </div>
              ) : (
                <div className="mt-3 sm:mt-4 text-white/80 font-medium bg-black/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-sm sm:text-base">
                   Đã mở: {envelopes.filter(e => e.isOpened).length} / {envelopes.length}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="py-3 sm:py-4 text-center text-white/60 text-xs sm:text-sm px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          Lì Xì May Mắn © {new Date().getFullYear()}
        </div>
      </div>

      {/* Result Modal */}
      {selectedEnvelope && (
        <ResultModal 
          amount={selectedEnvelope.amount} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default App;