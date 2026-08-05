'use client';
import { useEffect, useRef, useState } from 'react';
import { requestAppFullscreen, isAppFullscreen } from '@/lib/fullscreen';

interface CaptureDeterrentOptions {
  /** Called on a severe violation -- leaving fullscreen OR switching away
   *  from the tab. Typically wipes answers and restarts from question 1. */
  onSevereViolation: () => void;
  /** Whether to request/enforce fullscreen at all. Default true. */
  enforceFullscreen?: boolean;
}

/**
 * Shared screenshot/tab-switch deterrent, usable on any screen that shows
 * exam content (question view, bulk review, results). See the component
 * doc in CaptureDeterrentOverlay.tsx for what this can and can't do --
 * short version: it reacts to signals that correlate with someone trying
 * to capture the screen, it does not and cannot block the capture itself.
 */
export function useCaptureDeterrent({ onSevereViolation, enforceFullscreen = true }: CaptureDeterrentOptions) {
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [flashBlackout, setFlashBlackout] = useState(false);
  const tabWarningCooldownRef = useRef(false);
  const resetCooldownRef = useRef(false);

  useEffect(() => {
    if (enforceFullscreen) requestAppFullscreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const triggerTabWarning = () => {
      if (tabWarningCooldownRef.current) return;
      tabWarningCooldownRef.current = true;
      setShowTabWarning(true);
      setTimeout(() => setShowTabWarning(false), 4000);
      setTimeout(() => { tabWarningCooldownRef.current = false; }, 4000);
    };

    const triggerFullReset = () => {
      if (resetCooldownRef.current) return;
      resetCooldownRef.current = true;
      setShowResetWarning(true);
      onSevereViolation();
      setTimeout(() => setShowResetWarning(false), 5000);
      setTimeout(() => { resetCooldownRef.current = false; }, 5000);
    };

    // Best-effort only: reacts on keydown (fastest possible) to flash the
    // screen black. This can only ever help against the literal
    // PrintScreen key, and only on some browser/OS combinations that give
    // the page a moment's head start before the capture is read out.
    // Win+Shift+S (Snipping Tool), a phone camera, and screen recording
    // software never reach this page's JS at all -- there is nothing a
    // web page can do about those.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setFlashBlackout(true);
        setTimeout(() => setFlashBlackout(false), 1000);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      // PrintScreen alone stays a soft warning -- it doesn't necessarily
      // mean the learner left the tab or exam.
      if (e.key === 'PrintScreen') triggerTabWarning();
    };
    // Switching tabs, alt-tabbing, or minimizing is now a full violation,
    // same severity as leaving fullscreen -- both mean the learner stopped
    // looking at the exam.
    const handleBlur = () => triggerFullReset();
    const handleVisibilityChange = () => {
      if (document.hidden) triggerFullReset();
    };
    const handleFullscreenChange = () => {
      const fs = isAppFullscreen();
      setIsFullscreen(fs);
      if (!fs && enforceFullscreen) triggerFullReset();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Belt-and-suspenders: some browser/embedding combinations don't fire
    // fullscreenchange reliably for every exit path (e.g. the OS-level
    // Escape handling on some Windows builds). Poll as a backup so a exit
    // that the event misses still gets caught within ~1s.
    const pollId = setInterval(() => {
      const fs = isAppFullscreen();
      setIsFullscreen((prev) => {
        if (!fs && prev && enforceFullscreen) triggerFullReset();
        return fs;
      });
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      clearInterval(pollId);
    };
  }, [onSevereViolation, enforceFullscreen]);

  return { showTabWarning, showResetWarning, isFullscreen, flashBlackout };
}
