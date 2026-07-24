'use client';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { PASSER_TIPS, type PasserTip } from '@/data/passerTips';

function pickRandomTips(count: number): PasserTip[] {
  const pool = [...PASSER_TIPS];
  const picked: PasserTip[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

export function PasserTips({ count = 3 }: { count?: number }) {
  const [tips] = useState(() => pickRandomTips(count));

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
      <VStack gap={4} align="stretch">
        {tips.map((tip, i) => (
          <Box
            key={i}
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
        ))}
      </VStack>
    </Box>
  );
}
