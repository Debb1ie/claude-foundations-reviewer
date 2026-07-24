'use client';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PASSER_TIPS, type PasserTip } from '@/data/passerTips';

const ROTATE_MS = 5000;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Interleaves tips one-per-author-per-round so the same person's tips
// never play back-to-back, then patches the loop-around seam.
function buildTipSequence(tips: PasserTip[]): PasserTip[] {
  const byAuthor = new Map<string, PasserTip[]>();
  for (const tip of tips) {
    const bucket = byAuthor.get(tip.author) ?? [];
    bucket.push(tip);
    byAuthor.set(tip.author, bucket);
  }
  const buckets = shuffle([...byAuthor.values()].map(shuffle));

  const sequence: PasserTip[] = [];
  let lastAuthor: string | null = null;
  while (buckets.some((b) => b.length > 0)) {
    const order = shuffle(buckets.map((_, i) => i)).filter((i) => buckets[i].length > 0);
    const pick = order.find((i) => buckets[i][buckets[i].length - 1].author !== lastAuthor) ?? order[0];
    const tip = buckets[pick].pop()!;
    sequence.push(tip);
    lastAuthor = tip.author;
  }

  if (sequence.length > 2 && sequence[0].author === sequence[sequence.length - 1].author) {
    for (let i = 1; i < sequence.length - 1; i++) {
      const candidate = sequence[i];
      if (
        candidate.author !== sequence[0].author &&
        candidate.author !== sequence[i - 1].author &&
        candidate.author !== sequence[i + 1].author &&
        sequence[0].author !== sequence[i + 1].author
      ) {
        [sequence[0], sequence[i]] = [sequence[i], sequence[0]];
        break;
      }
    }
  }

  return sequence;
}

export function PasserTips() {
  const [sequence] = useState(() => buildTipSequence(PASSER_TIPS));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % sequence.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [sequence.length]);

  const tip = sequence[index];

  return (
    <Box
      bg="rgba(255, 255, 255, 0.45)"
      backdropFilter="blur(16px)"
      _dark={{
        bg: 'rgba(15, 23, 42, 0.45)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.35)"
      borderRadius="2xl"
      p={[6, 8]}
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
    >
      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={5} letterSpacing="0.05em">
        TIPS FROM THOSE WHO PASSED
      </Heading>
      <Box position="relative" minH="86px" overflow="hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -48, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Box
              p={4}
              borderRadius="lg"
              bg="rgba(57, 73, 171, 0.05)"
              border="1px solid rgba(57, 73, 171, 0.12)"
              _dark={{ bg: 'rgba(124, 110, 250, 0.08)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.200' }} lineHeight={1.6} mb={2}>
                &ldquo;{tip.text}&rdquo;
              </Text>
              <Text fontSize="xs" fontWeight={700} color="brand.600" fontFamily="mono">
                — {tip.author}
              </Text>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
