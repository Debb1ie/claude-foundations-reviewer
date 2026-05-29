'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useExamStore } from './useExamState';

export function useTimer() {
  const { isComplete, completeExam } = useExamStore();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const expiredRef = useRef(false);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((initialTime: number) => {
    stop();
    expiredRef.current = false;
    setSecondsLeft(initialTime);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (isPausedRef.current) return prev;
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  const setTime = useCallback((newTime: number) => {
    setSecondsLeft(newTime);
  }, []);

  useEffect(() => {
    if (isComplete) {
      stop();
    }
    return stop;
  }, [isComplete, stop]);

  useEffect(() => {
    if (secondsLeft <= 0 && !isPausedRef.current && intervalRef.current && !expiredRef.current) {
      expiredRef.current = true;
      stop();
      completeExam();
    }
  }, [secondsLeft, completeExam, stop]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isLow = secondsLeft < 300 && secondsLeft > 0;
  const isExpired = secondsLeft <= 0;

  return { secondsLeft, display, isLow, isExpired, isPaused, start, stop, pause, resume, setTime };
}
