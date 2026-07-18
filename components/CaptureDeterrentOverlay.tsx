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
  resetMessage = 'Fullscreen exited — progress reset, starting over from Question 1',
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

      {/* Mild warning: tab switch / PrintScreen / window blur -- no penalty */}
      <AnimatePresence>
        {showTabWarning && (
          <motion.div style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 10000, display: 'flex', justifyContent: 'center' }}>
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
                  Tab switch / screen capture detected — stay on this tab
                </Text>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Severe warning: fullscreen exited -- full penalty */}
      <AnimatePresence>
        {showResetWarning && (
          <motion.div style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 10000, display: 'flex', justifyContent: 'center' }}>
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

      {/* Not-in-fullscreen prompt */}
      {!hideFullscreenPrompt && (
        <AnimatePresence>
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', bottom: 20, left: 0, right: 0, zIndex: 9999, display: 'flex', justifyContent: 'center' }}
            >
              <Button
                size="sm"
                bg="gray.800"
                color="white"
                fontWeight={700}
                borderRadius="full"
                boxShadow="0 8px 24px rgba(0,0,0,0.3)"
                _hover={{ bg: 'gray.900' }}
                onClick={() => requestAppFullscreen()}
              >
                Not in fullscreen — click to re-enter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
