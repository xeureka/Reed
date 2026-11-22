import { useCallback, useEffect, useRef } from 'react';

type ThemeAudioContext = AudioContext & { createStereoPanner?: AudioContext['createStereoPanner'] };

export function useThemeSound() {
  const contextRef = useRef<ThemeAudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => () => { void contextRef.current?.close(); }, []);

  return useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const AudioContextConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = contextRef.current ?? new AudioContextConstructor();
    contextRef.current = context;
    if (!bufferRef.current) {
      const length = Math.floor(context.sampleRate * 0.22);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < length; index += 1) {
        const fade = Math.min(index / (context.sampleRate * 0.025), (length - index) / (context.sampleRate * 0.16), 1);
        data[index] = (Math.random() * 2 - 1) * fade;
      }
      bufferRef.current = buffer;
    }
    void context.resume().then(() => {
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = bufferRef.current;
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.4, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.21);
      source.connect(filter).connect(gain).connect(context.destination);
      source.start(0);
      source.stop(context.currentTime + 0.22);
    }).catch(() => undefined);
  }, []);
}
