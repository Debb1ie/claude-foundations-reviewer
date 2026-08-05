'use client';
import { Box, Button, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestAppFullscreen } from '@/lib/fullscreen';

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

/**
 * Renders the visual side of useCaptureDeterrent: the instant blackout
 * flash, the two warning banners, and the "click to re-enter fullscreen"
 * prompt. Mount this once per screen alongside the hook's returned state.
 */
export function CaptureDeterrentOverlay({
  showTabWarning,
  showResetWarning,
  isFullscreen,
  flashBlackout,
  resetMessage = 'Fullscreen exited or tab switched — progress reset, starting over from Question 1',
  hideFullscreenPrompt = false,
}: {
  showTabWarning: boolean;
  showResetWarning: boolean;
  isFullscreen: boolean;
  flashBlackout: boolean;
  resetMessage?: string;
  hideFullscreenPrompt?: boolean;
}) {
  return (
    <>
      {/* Instant best-effort blackout flash on PrintScreen keydown */}
      <AnimatePresence>
        {flashBlackout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100000 }}
          />
        )}
      </AnimatePresence>

      {/* Mild warning: PrintScreen only -- tab switches and fullscreen exits
          are now full violations (see showResetWarning below), not this. */}
      <AnimatePresence>
        {showTabWarning && (
          <motion.div style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 60000, display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: -20, x: 0 }}
              animate={{ opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -5, 5, 0] }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, x: { duration: 0.4, ease: 'easeInOut' } }}
            >
              <Box px={5} py={3} borderRadius="xl" bg="orange.500" color="white" boxShadow="0 8px 24px rgba(0,0,0,0.25)"
                display="flex" alignItems="center" justifyContent="center" gap={2.5}>
                <WarningIcon />
                <Text fontSize="sm" fontWeight={700}>
                  Screen capture attempt detected
                </Text>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Severe warning: fullscreen exited -- full penalty */}
      <AnimatePresence>
        {showResetWarning && (
          <motion.div style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 60000, display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: -20, x: 0 }}
              animate={{ opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -5, 5, 0] }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, x: { duration: 0.4, ease: 'easeInOut' } }}
            >
              <Box px={5} py={3} borderRadius="xl" bg="red.600" color="white" boxShadow="0 8px 24px rgba(0,0,0,0.25)"
                display="flex" alignItems="center" justifyContent="center" gap={2.5}>
                <WarningIcon />
                <Text fontSize="sm" fontWeight={700}>{resetMessage}</Text>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not-in-fullscreen LOCK: a full-viewport backdrop that blocks every
          click to the exam underneath -- not just a reminder button.
          Leaving fullscreen already wiped progress via triggerFullReset;
          this makes sure nothing can be answered again until the learner
          is actually back in fullscreen, instead of letting them keep
          going in a normal browser window. */}
      {!hideFullscreenPrompt && (
        <AnimatePresence>
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 50000,
                background: 'rgba(10,14,40,0.82)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
              }}
            >
              <Box
                bg="rgba(255,255,255,0.97)"
                _dark={{ bg: 'rgba(20,30,58,0.98)' }}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.35)"
                boxShadow="0 24px 64px rgba(10,14,40,0.35)"
                p={[6, 7]}
                maxW="440px"
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight={800} color="red.600" _dark={{ color: 'red.300' }} mb={2}>
                  Exam locked — not in fullscreen
                </Text>
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }} mb={5} lineHeight="tall">
                  You can&apos;t answer or navigate questions while outside fullscreen. Re-enter fullscreen to keep going.
                </Text>
                <Button
                  size="md"
                  bg="brand.600"
                  color="white"
                  fontWeight={700}
                  borderRadius="lg"
                  boxShadow="0 8px 24px rgba(0,0,0,0.3)"
                  _hover={{ bg: 'brand.700' }}
                  onClick={() => requestAppFullscreen()}
                >
                  Re-enter fullscreen
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
