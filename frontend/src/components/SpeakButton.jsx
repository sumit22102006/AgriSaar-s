import { useState, useRef, useEffect } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import getPageLanguage, { getSpeechLang } from '../utils/getPageLanguage';

/**
 * Reusable "Listen" button — calls ElevenLabs TTS via backend (Rachel female voice).
 * Usage: <SpeakButton text="Some text to speak" />
 */
export default function SpeakButton({ text, label = 'Listen', size = 'sm' }) {
  const [status, setStatus] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);
  const urlRef = useRef(null);
  const abortRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAll();
  }, []);

  const stopAll = () => {
    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onpause = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Abort fetch if in progress
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Stop browser speech fallback
    window.speechSynthesis?.cancel();
    // Revoke URL
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setStatus('idle');
  };

  const handleClick = async () => {
    // If playing or loading, stop everything
    if (status === 'playing' || status === 'loading') {
      stopAll();
      return;
    }

    if (!text) return;

    try {
      setStatus('loading');
      
      const controller = new AbortController();
      abortRef.current = controller;

      const streamUrl = `/api/tts/speak?text=${encodeURIComponent(text)}`;
      const audio = new Audio(streamUrl);
      audioRef.current = audio;

      audio.onplay = () => setStatus('playing');
      audio.onended = () => {
        audioRef.current = null;
        setStatus('idle');
      };
      audio.onerror = () => {
        console.error('TTS streaming failed');
        audioRef.current = null;
        setStatus('idle');
        fallbackSpeak(text);
      };

      // Native browser streaming! Starts playing immediately.
      await audio.play();
    } catch (error) {
      console.error(`Gemini voice error [Model: gemini-1.5-flash]: ${error.message}`);
      if (error.stack) console.error(error.stack);
      setStatus('idle');
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (txt) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = txt.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}#*_\[\]()]/gu, '').replace(/\n+/g, '. ');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 0.95;

      // AUTO-DETECT page language from Google Translate
      const pageLang = getPageLanguage();
      const speechLang = getSpeechLang(pageLang);
      utter.lang = speechLang;

      const voices = window.speechSynthesis.getVoices();
      const langCode = pageLang; // 'hi', 'bn', 'ta', etc.

      // Find voice matching the detected language
      let bestVoice = voices.find(v => v.lang.startsWith(langCode));
      // Fallback: any Indian voice
      if (!bestVoice) bestVoice = voices.find(v => v.lang.includes('IN'));
      // Final fallback
      if (!bestVoice) bestVoice = voices[0];

      if (bestVoice) utter.voice = bestVoice;
      
      utter.onstart = () => setStatus('playing');
      utter.onend = () => setStatus('idle');
      utter.onerror = () => setStatus('idle');
      window.speechSynthesis.speak(utter);
    }
  };

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-3 py-1.5 gap-1.5'
    : 'text-xs px-4 py-2 gap-2';

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center ${sizeClasses} rounded-full font-bold transition-all active:scale-95 select-none ${
        status === 'playing'
          ? 'bg-red-100 text-red-600 hover:bg-red-200 shadow-sm'
          : status === 'loading'
            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            : 'bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800'
      }`}
    >
      {status === 'loading' ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading... <span className="text-[9px] opacity-60">(click to cancel)</span></>
      ) : status === 'playing' ? (
        <>
          <div className="flex items-center gap-0.5">
            <span className="inline-block w-0.5 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="inline-block w-0.5 h-3 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="inline-block w-0.5 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <Square className="w-3 h-3 fill-current" /> Stop
        </>
      ) : (
        <><Volume2 className="w-3.5 h-3.5" /> {label}</>
      )}
    </button>
  );
}
