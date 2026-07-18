'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  SimpleGrid,
  Link,
  Progress,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedExamStore, type AdvancedQuestion, TOTAL_SECONDS } from '@/hooks/useAdvancedExamState';
import { DOMAINS, DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT } from '@/types/exam';
import NextLink from 'next/link';
import { requestAppFullscreen, isAppFullscreen } from '@/lib/fullscreen';

const DOMAIN_NAMES: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code',
  D4: 'Prompt Engineering',
  D5: 'Context Management',
};

const DOMAIN_STRING_TO_KEY: Record<string, 'D1' | 'D2' | 'D3' | 'D4' | 'D5'> = {
  'agentic-architecture': 'D1',
  'tool-design-mcp': 'D2',
  'claude-code': 'D3',
  'prompt-engineering': 'D4',
  'context-management': 'D5',
};

const DIFFICULTY_COLORS = {
  '2x': { bg: 'rgba(250, 140, 110, 0.12)', border: 'rgba(250, 140, 110, 0.35)', text: '#c83b14' },
  '3x': { bg: 'rgba(160, 110, 250, 0.12)', border: 'rgba(160, 110, 250, 0.35)', text: '#6f2bc8' },
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const QUICK_RESOURCES = [
  {
    label: 'Official Docs',
    title: 'CCA-F Exam Guide',
    description: 'Official PDF covering all exam domains, weights, and format.',
    url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F8lsy243ftffjjy1cx9lm3o2bw%2Fpublic%2F1773274827%2FClaude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf',
  },
  {
    label: 'Essentials',
    title: 'Claude Partner Network Path',
    description: 'Official Skilljar learning path required for certification.',
    url: 'https://anthropic.skilljar.com/page/claude-partner-network-learning-path',
  },
  {
    label: 'Courses',
    title: 'Learn Anthropic (Skilljar)',
    description: "Anthropic's official platform with all Claude courses and modules.",
    url: 'https://learn.anthropic.com/',
  },
  {
    label: 'Guides',
    title: 'Prompt Engineering Guide',
    description: 'Best practices and strategies for writing effective Claude prompts.',
    url: 'https://docs.anthropic.com/en/docs/prompt-engineering',
  },
];

// Renders sourceExcerpt with sourceHighlight wrapped in a <mark>. Since this is our
// own DOM (not a cross-origin page), the highlight always works — no dependency on
// browser support or the external page still containing the exact phrase.
function renderHighlightedExcerpt(excerpt: string, highlight?: string) {
  if (!highlight) return excerpt;
  const idx = excerpt.indexOf(highlight);
  if (idx === -1) return excerpt;
  return (
    <>
      {excerpt.slice(0, idx)}
      <Box
        as="mark"
        bg="rgba(250, 204, 21, 0.45)"
        color="inherit"
        px="2px"
        borderRadius="sm"
        _dark={{ bg: 'rgba(250, 204, 21, 0.3)' }}
      >
        {highlight}
      </Box>
      {excerpt.slice(idx + highlight.length)}
    </>
  );
}

function SourceModal({ question, onClose }: { question: AdvancedQuestion | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {question && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(10,14,40,0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              bg="rgba(255,255,255,0.97)"
              _dark={{ bg: 'rgba(20,30,58,0.98)' }}
              borderRadius="2xl"
              border="1px solid rgba(255,255,255,0.35)"
              boxShadow="0 24px 64px rgba(10,14,40,0.35)"
              overflow="hidden"
              p={6}
            >
              <HStack justify="space-between" align="flex-start" mb={3}>
                <Text fontSize="xs" fontWeight={800} color="brand.600" fontFamily="mono" letterSpacing="0.03em"
                  _dark={{ color: 'brand.300' }}>
                  {question.sourceLabel ?? 'Source'}
                </Text>
                <Box
                  as="button"
                  onClick={onClose}
                  color="gray.400"
                  _hover={{ color: 'gray.600' }}
                  aria-label="Close"
                  lineHeight={1}
                  fontSize="lg"
                >
                  ✕
                </Box>
              </HStack>

              {question.sourceExcerpt ? (
                <Box
                  p={4}
                  bg="rgba(57,73,171,0.05)"
                  borderRadius="lg"
                  borderLeft="3px solid rgba(57,73,171,0.3)"
                  _dark={{ bg: 'rgba(57,73,171,0.1)', borderColor: 'rgba(57,73,171,0.4)' }}
                >
                  <Text fontSize="sm" color="gray.700" lineHeight="tall" fontStyle="italic" _dark={{ color: 'gray.200' }}>
                    &ldquo;{renderHighlightedExcerpt(question.sourceExcerpt, question.sourceHighlight)}&rdquo;
                  </Text>
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No excerpt available for this source yet — open the full page below to review it.
                </Text>
              )}

              <HStack justify="space-between" align="center" mt={5} pt={4} borderTop="1px solid rgba(0,0,0,0.06)"
                _dark={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <Button size="sm" variant="outline" borderColor="brand.300" color="brand.600" fontWeight={700}
                  borderRadius="lg" onClick={onClose}>
                  Close
                </Button>
                {question.sourceUrl && (
                  <Link
                    href={question.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    fontSize="xs"
                    fontWeight={700}
                    color="brand.500"
                    _dark={{ color: 'brand.300' }}
                    _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                  >
                    Open full page
                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </Link>
                )}
              </HStack>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  const domainCounts: Record<string, number> = { D1: 15, D2: 9, D3: 12, D4: 12, D5: 12 };
  return (
    <Box minH="100vh" bg="transparent">
      <Container maxW="container.md" py={[8, 14]}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <VStack gap={8} align="stretch">
            <Box textAlign="center">
              <Badge
                bg="rgba(160, 110, 250, 0.12)"
                color="#6f2bc8"
                border="1px solid rgba(160, 110, 250, 0.35)"
                px={3} py={1} borderRadius="full" fontSize="xs" fontWeight={700} mb={4}
                _dark={{ color: '#b996fb', bg: 'rgba(160,110,250,0.18)' }}
              >
                Advanced Practice
              </Badge>
              <Heading as="h1" size="2xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                CCA-F Advanced Practice
              </Heading>
              <Text color="gray.600" fontSize="lg" lineHeight="tall" maxW="lg" mx="auto">
                60 scenario-based questions covering all 5 exam domains.
                2-hour timed — answers and explanations revealed after you finish.
              </Text>
            </Box>

            <Box
              p={6}
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(12px)"
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.35)"
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.04)"
              _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Text fontSize="sm" fontWeight={700} color="brand.700" mb={4}>Question Distribution</Text>
              <SimpleGrid columns={[2, 3, 5]} gap={3}>
                {DOMAINS.map((d) => (
                  <Box key={d.id} p={3} borderRadius="lg" border="1px solid" borderColor="rgba(255,255,255,0.3)"
                    bg="rgba(255,255,255,0.35)" _dark={{ bg: 'rgba(30,41,59,0.3)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <Badge bg={DOMAIN_SOLID_BGS[d.id]} color={DOMAIN_SOLID_TEXT[d.id]} px={2} py={0.5} borderRadius="md"
                      fontSize="2xs" fontFamily="mono" fontWeight={700} mb={1.5} display="block" w="fit-content">
                      {d.id}
                    </Badge>
                    <Text fontSize="xs" fontWeight={700} color="brand.700" lineHeight={1.3}>{DOMAIN_NAMES[d.id]}</Text>
                    <Text fontSize="2xs" color="gray.500" mt={1}>{domainCounts[d.id]} questions</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Box
              p={5}
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(12px)"
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.35)"
              _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <SimpleGrid columns={[1, 3]} gap={4}>
                {[
                  { label: '60 Questions', sub: 'All 5 domains covered' },
                  { label: '2-Hour Timer', sub: 'Matches real exam format' },
                  { label: 'Scenario-Based', sub: 'Deep comprehension questions' },
                ].map((item) => (
                  <Box key={item.label} textAlign="center">
                    <Text fontSize="sm" fontWeight={800} color="brand.700">{item.label}</Text>
                    <Text fontSize="xs" color="gray.500">{item.sub}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <HStack gap={3} justify="center">
              <Link as={NextLink} href="/home" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outline"
                  size="lg"
                  borderColor="brand.300"
                  color="brand.600"
                  fontWeight={700}
                  borderRadius="xl"
                  px={8}
                  _hover={{ bg: 'brand.50' }}
                >
                  Back to Home
                </Button>
              </Link>
              <Button
                size="lg"
                bg="#3949ab"
                color="white"
                fontWeight={800}
                borderRadius="xl"
                px={10}
                opacity={1}
                boxShadow="0 6px 24px rgba(57,73,171,0.55)"
                _hover={{ bg: '#303F9F', transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(57,73,171,0.6)' }}
                _active={{ transform: 'translateY(0)', boxShadow: '0 4px 14px rgba(57,73,171,0.4)' }}
                transition="all 0.2s"
                onClick={onStart}
              >
                Start Practice
              </Button>
            </HStack>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}

type ReviewFilter = 'all' | 'correct' | 'incorrect' | 'flagged';

function ResultsScreen({ onReset }: { onReset: () => void }) {
  const { getScore, questions, answers, flagged, startTime, endTime } = useAdvancedExamStore();
  const { correct, total, pct } = getScore();
  const scaledScore = Math.round(100 + (pct / 100) * 900);
  const passed = scaledScore >= 720;
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [activeSource, setActiveSource] = useState<AdvancedQuestion | null>(null);

  const incorrectCount = answers.filter((a, i) => a !== null && a !== questions[i].correctAnswer).length;
  const unansweredCount = answers.filter((a) => a === null).length;
  const flaggedCount = flagged.filter(Boolean).length;
  const timeTakenSeconds = startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0;
  const timeDisplay = (() => {
    const mins = Math.floor(timeTakenSeconds / 60);
    const secs = timeTakenSeconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  })();

  const filteredEntries = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      const isCorrectQ = answers[idx] === q.correctAnswer;
      if (reviewFilter === 'correct') return isCorrectQ;
      if (reviewFilter === 'incorrect') return answers[idx] !== null && !isCorrectQ;
      if (reviewFilter === 'flagged') return flagged[idx];
      return true;
    });

  const FILTER_TABS: { key: ReviewFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: total },
    { key: 'correct', label: 'Correct', count: correct },
    { key: 'incorrect', label: 'Incorrect', count: incorrectCount },
    { key: 'flagged', label: 'Flagged', count: flaggedCount },
  ];

  const domainBreakdown = DOMAINS.map((d) => {
    const qs = questions.filter((q) => (DOMAIN_STRING_TO_KEY[q.domain] ?? q.domain) === d.id);
    const correctCount = qs.filter((q) => {
      const idx = questions.indexOf(q);
      return answers[idx] === q.correctAnswer;
    }).length;
    return { domain: d, correct: correctCount, total: qs.length };
  });

  return (
    <Box minH="100vh" bg="transparent">
      <Container maxW="container.md" py={[8, 12]}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <VStack gap={6} align="stretch">
            <Box
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(16px)"
              _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
              border="1.5px solid"
              borderColor="rgba(255, 255, 255, 0.35)"
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
              borderRadius="2xl"
              p={[6, 8]}
              textAlign="center"
            >
              <Text fontSize="2xs" fontFamily="mono" fontWeight={700} color="brand.400" letterSpacing="0.1em" mb={3}
                _dark={{ color: 'brand.300' }}>
                ADVANCED MOCK EXAM
              </Text>
              <Badge
                size="md"
                px={3}
                py={1}
                borderRadius="full"
                bg={passed ? 'success.100' : 'error.100'}
                color={passed ? 'success.700' : 'error.700'}
                border="1px solid"
                borderColor={passed ? 'success.200' : 'error.200'}
                mb={4}
                fontSize="xs"
                fontWeight={700}
                fontFamily="mono"
              >
                {passed ? 'PASSED CERTIFICATION' : 'PRACTICE MORE'}
              </Badge>

              <Text
                fontSize={['5xl', '6xl']}
                fontWeight={800}
                lineHeight={1.1}
                color={passed ? 'success.600' : 'error.600'}
                fontFamily="heading"
                letterSpacing="tight"
              >
                {pct}%
              </Text>

              <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight={600} mt={2}>
                Scaled Score Equivalent: ~{scaledScore}/1000 &middot; Passing Mark: 720
              </Text>

              <Heading as="h2" size="md" fontWeight={700} mt={4} color="brand.700">
                {passed ? 'Advanced Mock Exam Success!' : 'Keep Pushing Forward'}
              </Heading>

              <Text fontSize="sm" color="gray.600" lineHeight={1.7} mt={3} textAlign="left" px={[0, 2]}>
                {passed
                  ? "Congratulations on clearing the Advanced Mock Exam! This tier is deliberately harder than the standard practice set, so passing here is a strong signal you're ready. Keep in mind the actual proctored exam can still surprise you — stay sharp with the review kit and official Claude Partner Network resources so you carry this momentum all the way through."
                  : "You're building real judgment by working through the hardest questions in the bank — this tier is intentionally tougher than standard practice, so don't read this score the way you'd read a regular one. Stay consistent with the review kit and official resources, and focus your next pass on the domains where you scored lowest below."}
              </Text>

              <SimpleGrid columns={[2, 4]} gap={4} mt={6} pt={6} borderTop="1px solid" borderColor="border">
                <VStack gap={0.5} align="center">
                  <Text fontSize="lg" fontWeight={700} color="brand.600">{correct}</Text>
                  <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">CORRECT</Text>
                </VStack>
                <VStack gap={0.5} align="center">
                  <Text fontSize="lg" fontWeight={700} color="brand.600">{incorrectCount}</Text>
                  <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">INCORRECT</Text>
                </VStack>
                <VStack gap={0.5} align="center">
                  <Text fontSize="lg" fontWeight={700} color="brand.600">{unansweredCount}</Text>
                  <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">UNANSWERED</Text>
                </VStack>
                <VStack gap={0.5} align="center">
                  <Text fontSize="lg" fontWeight={700} color="brand.600">{timeDisplay}</Text>
                  <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">TIME TAKEN</Text>
                </VStack>
              </SimpleGrid>

              <Button
                mt={8}
                size="lg"
                bg="brand.600"
                color="white"
                fontWeight={700}
                _hover={{ bg: 'brand.700' }}
                onClick={onReset}
                px={10}
                borderRadius="lg"
              >
                Restart Simulator
              </Button>
            </Box>

            <Box
              p={6}
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(12px)"
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.35)"
              _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={5} letterSpacing="0.05em">
                DOMAIN-WISE PERFORMANCE ANALYSIS
              </Heading>
              <VStack gap={5} align="stretch">
                {domainBreakdown.map(({ domain, correct: dc, total: dt }) => {
                  const pctVal = dt > 0 ? Math.round((dc / dt) * 100) : 0;
                  return (
                    <VStack key={domain.id} align="stretch" gap={1.5}>
                      <HStack justify="space-between" align="center">
                        <HStack gap={2}>
                          <Badge bg={DOMAIN_SOLID_BGS[domain.id]} color={DOMAIN_SOLID_TEXT[domain.id]}
                            border="none" px={2.5} py={0.5} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}>
                            {domain.id}
                          </Badge>
                          <Text fontSize="xs" fontWeight={700} color="brand.700">{domain.name}</Text>
                        </HStack>
                        <Text fontSize="xs" fontFamily="mono" fontWeight={700} color="brand.600">
                          {dc} / {dt} ({pctVal}%)
                        </Text>
                      </HStack>
                      <Progress.Root value={pctVal} size="sm">
                        <Progress.Track bg="border">
                          <Progress.Range bg={domain.color} />
                        </Progress.Track>
                      </Progress.Root>
                    </VStack>
                  );
                })}
              </VStack>
            </Box>

            {/* Recommended Resources — shown only on fail */}
            {!passed && (
              <Box
                bg="rgba(255, 241, 241, 0.55)"
                backdropFilter="blur(16px)"
                _dark={{ bg: 'rgba(60, 20, 20, 0.35)', borderColor: 'rgba(255, 100, 100, 0.15)' }}
                border="1.5px solid"
                borderColor="rgba(240, 90, 90, 0.22)"
                borderRadius="2xl"
                p={[6, 8]}
                boxShadow="0 8px 32px 0 rgba(240, 90, 90, 0.06)"
              >
                <HStack justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
                  <VStack align="flex-start" gap={0.5}>
                    <Heading as="h3" size="sm" fontWeight={700} color="error.700" _dark={{ color: 'red.300' }} letterSpacing="0.05em">
                      RECOMMENDED RESOURCES
                    </Heading>
                    <Text fontSize="xs" color="gray.500">Start here to close the gap before your next attempt.</Text>
                  </VStack>
                  <Link as={NextLink} href="/sources" fontSize="xs" fontWeight={700} color="brand.600"
                    _hover={{ color: 'brand.700', textDecoration: 'underline' }}>
                    View all resources →
                  </Link>
                </HStack>
                <SimpleGrid columns={[1, 2]} gap={4}>
                  {QUICK_RESOURCES.map((r) => (
                    <Link
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      display="flex"
                      flexDirection="column"
                      p={4}
                      borderRadius="xl"
                      border="1.5px solid"
                      borderColor="rgba(255, 255, 255, 0.4)"
                      bg="rgba(255, 255, 255, 0.55)"
                      backdropFilter="blur(10px)"
                      _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                      transition="all 0.22s cubic-bezier(0.4,0,0.2,1)"
                      _hover={{
                        borderColor: 'brand.400',
                        bg: 'rgba(255,255,255,0.8)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(57,73,171,0.10)',
                        textDecoration: 'none',
                      }}
                      style={{ textDecoration: 'none' }}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Badge px={2} py={0.5} borderRadius="full" bg="brand.100" color="brand.700"
                          fontSize="2xs" fontWeight={700} fontFamily="mono">
                          {r.label}
                        </Badge>
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-gray-400)">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </HStack>
                      <Text fontSize="sm" fontWeight={700} color="brand.700" mb={1}>{r.title}</Text>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.5}>{r.description}</Text>
                    </Link>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <HStack gap={3} justify="center">
              <Link as={NextLink} href="/home" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outline"
                  borderColor="brand.300"
                  color="brand.600"
                  fontWeight={700}
                  borderRadius="xl"
                  px={8}
                  _hover={{ bg: 'brand.50' }}
                >
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                borderColor={showReview ? 'brand.500' : 'brand.200'}
                bg={showReview ? 'brand.50' : 'transparent'}
                color="brand.600"
                fontWeight={700}
                borderRadius="xl"
                px={8}
                _hover={{ bg: 'brand.50', borderColor: 'brand.400' }}
                onClick={() => setShowReview(!showReview)}
              >
                {showReview ? 'Hide Review' : 'Review Answers'}
              </Button>
            </HStack>

            {/* Answer Review Section */}
            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <VStack gap={4} align="stretch" pt={2}>
                    <HStack justify="space-between" flexWrap="wrap" gap={3}>
                      <Text fontSize="sm" fontWeight={700} color="brand.700">
                        {total} Questions — Full Review
                      </Text>
                      <HStack gap={1.5} flexWrap="wrap">
                        {FILTER_TABS.map((tab) => {
                          const isActive = reviewFilter === tab.key;
                          return (
                            <Button
                              key={tab.key}
                              size="xs"
                              variant={isActive ? 'solid' : 'outline'}
                              bg={isActive ? 'brand.600' : 'transparent'}
                              color={isActive ? 'white' : 'brand.600'}
                              borderColor="brand.300"
                              fontWeight={700}
                              borderRadius="lg"
                              _hover={{ bg: isActive ? 'brand.700' : 'brand.50' }}
                              onClick={() => setReviewFilter(tab.key)}
                            >
                              {tab.label} ({tab.count})
                            </Button>
                          );
                        })}
                      </HStack>
                    </HStack>
                    {filteredEntries.length === 0 && (
                      <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
                        No questions match this filter.
                      </Text>
                    )}
                    {filteredEntries.map(({ q, idx }) => {
                      const userAns = answers[idx];
                      const isCorrectQ = userAns === q.correctAnswer;
                      return (
                        <Box
                          key={q.id}
                          p={5}
                          borderRadius="xl"
                          border="1px solid"
                          borderColor={isCorrectQ ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}
                          bg={isCorrectQ ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)'}
                          backdropFilter="blur(8px)"
                          _dark={{
                            bg: isCorrectQ ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                            borderColor: isCorrectQ ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)',
                          }}
                        >
                          <HStack gap={2} mb={3} flexWrap="wrap">
                            <Badge
                              bg="rgba(57,73,171,0.08)"
                              color="brand.600"
                              px={2} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}
                            >
                              Q{q.number}
                            </Badge>
                            <Badge bg={DOMAIN_SOLID_BGS[DOMAIN_STRING_TO_KEY[q.domain] ?? 'D1']} color={DOMAIN_SOLID_TEXT[DOMAIN_STRING_TO_KEY[q.domain] ?? 'D1']}
                              px={2} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}>
                              {q.domain}
                            </Badge>
                            <Text fontSize="xs" fontWeight={700} color={isCorrectQ ? 'green.600' : 'red.500'}>
                              {isCorrectQ ? '✓ Correct' : '✗ Incorrect'}
                            </Text>
                            {!isCorrectQ && (
                              <Text fontSize="xs" color="gray.500">
                                Your answer: {userAns !== null ? OPTION_LABELS[userAns] : 'Skipped'} · Correct: {OPTION_LABELS[q.correctAnswer]}
                              </Text>
                            )}
                          </HStack>

                          <Text fontSize="sm" fontWeight={600} color="brand.800" mb={3} lineHeight="tall"
                            _dark={{ color: 'gray.100' }}>
                            {q.text}
                          </Text>

                          <VStack gap={1.5} align="stretch" mb={3}>
                            {q.options.map((opt, oidx) => {
                              const isCorrectOpt = oidx === q.correctAnswer;
                              const isSelectedOpt = oidx === userAns;
                              return (
                                <HStack
                                  key={oidx}
                                  gap={2}
                                  p={2.5}
                                  borderRadius="lg"
                                  bg={
                                    isCorrectOpt ? 'rgba(34,197,94,0.08)' :
                                    isSelectedOpt && !isCorrectOpt ? 'rgba(239,68,68,0.07)' :
                                    'transparent'
                                  }
                                  border="1px solid"
                                  borderColor={
                                    isCorrectOpt ? 'rgba(34,197,94,0.3)' :
                                    isSelectedOpt && !isCorrectOpt ? 'rgba(239,68,68,0.25)' :
                                    'transparent'
                                  }
                                >
                                  <Text
                                    fontSize="xs"
                                    fontWeight={800}
                                    fontFamily="mono"
                                    color={isCorrectOpt ? 'green.600' : isSelectedOpt ? 'red.500' : 'gray.400'}
                                    minW={4}
                                  >
                                    {OPTION_LABELS[oidx]}
                                  </Text>
                                  <Text fontSize="xs" color="gray.700" lineHeight="tall" flex={1}
                                    _dark={{ color: 'gray.300' }}>
                                    {opt}
                                  </Text>
                                  {isCorrectOpt && <Text color="green.500" fontSize="sm" flexShrink={0}>✓</Text>}
                                  {isSelectedOpt && !isCorrectOpt && <Text color="red.400" fontSize="sm" flexShrink={0}>✗</Text>}
                                </HStack>
                              );
                            })}
                          </VStack>

                          <Box
                            p={3}
                            bg="rgba(57,73,171,0.05)"
                            borderRadius="lg"
                            borderLeft="3px solid rgba(57,73,171,0.3)"
                            _dark={{ bg: 'rgba(57,73,171,0.08)', borderColor: 'rgba(57,73,171,0.4)' }}
                          >
                            <Text fontSize="xs" fontWeight={700} color="brand.600" mb={1}>Explanation</Text>
                            <Text fontSize="xs" color="gray.600" lineHeight="tall" _dark={{ color: 'gray.400' }}>
                              {q.explanation}
                            </Text>
                            {q.sourceUrl && (
                              <Box
                                as="button"
                                display="inline-flex"
                                alignItems="center"
                                gap={1}
                                mt={2.5}
                                pt={2}
                                w="100%"
                                borderTop="1px solid rgba(57,73,171,0.12)"
                                fontSize="2xs"
                                fontWeight={700}
                                color="brand.500"
                                _dark={{ color: 'brand.300' }}
                                _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                                onClick={() => setActiveSource(q)}
                              >
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                {q.sourceLabel ?? 'View Source'}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </motion.div>
              )}
            </AnimatePresence>

            <Box mt={4} p={5} bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(12px)"
              _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
              border="1px solid" borderColor="rgba(255, 255, 255, 0.35)" borderRadius="xl">
              <Text fontSize="xs" color="gray.500" textAlign="justify" lineHeight="tall">
                <strong>Disclaimer:</strong> This Claude Certified Architect Reviewer is an independent educational initiative created by the DEVCON Jumpstart AI Engineering Interns based on public resources, Reddit community reviews, and official study guides. It is not affiliated with, endorsed by, or connected to Anthropic PBC or Skilljar, and it strictly adheres to non-disclosure policies by not reproducing actual live exam questions. Because AI technologies and certification requirements evolve rapidly, this material is intended solely for preparatory study and does not guarantee exam success; users must always verify the latest exam domains, updates, and training modules directly by visiting the official portal at <Link href="https://anthropic.skilljar.com/" target="_blank" rel="noopener noreferrer" color="brand.500" textDecoration="underline">https://anthropic.skilljar.com/</Link>.
              </Text>
            </Box>
          </VStack>
        </motion.div>
      </Container>
      <SourceModal question={activeSource} onClose={() => setActiveSource(null)} />
    </Box>
  );
}

function QuestionView() {
  const {
    questions, currentQuestion, answers, flagged,
    setAnswer, nextQuestion, prevQuestion, goToQuestion,
    toggleFlag, complete, startReview,
  } = useAdvancedExamStore();

  const [isPaused, setIsPaused] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const [showCaptureWarning, setShowCaptureWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const captureCooldownRef = React.useRef(false);

  // Try to enter fullscreen as soon as the question view mounts, in case
  // the learner landed here without going through the "Start Advanced
  // Practice" button (e.g. resuming a session). Fullscreen hides browser
  // chrome -- the address bar, extension toolbar, and most side panels --
  // which is what makes an extension side panel like an AI assistant
  // harder to have open alongside the exam.
  useEffect(() => {
    requestAppFullscreen();
  }, []);

  // Best-effort screenshot/screen-capture deterrent: this cannot actually
  // block OS-level screenshot tools or third-party capture extensions, but
  // it reacts to the signals a capture attempt usually produces -- the
  // PrintScreen key, the window losing focus, or leaving fullscreen -- by
  // sending the learner back to question 1 (answers are preserved) and
  // flagging it.
  useEffect(() => {
    const triggerCaptureViolation = () => {
      if (captureCooldownRef.current) return;
      captureCooldownRef.current = true;
      setShowCaptureWarning(true);
      goToQuestion(0);
      setTimeout(() => setShowCaptureWarning(false), 4000);
      setTimeout(() => { captureCooldownRef.current = false; }, 4000);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') triggerCaptureViolation();
    };
    const handleBlur = () => triggerCaptureViolation();
    const handleVisibilityChange = () => {
      if (document.hidden) triggerCaptureViolation();
    };
    const handleFullscreenChange = () => {
      const fs = isAppFullscreen();
      setIsFullscreen(fs);
      if (!fs) triggerCaptureViolation();
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [goToQuestion]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          complete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, complete]);

  const timerHours = Math.floor(secondsLeft / 3600);
  const timerMinutes = Math.floor((secondsLeft % 3600) / 60);
  const timerSeconds = secondsLeft % 60;
  const timerDisplay = `${timerHours.toString().padStart(2, '0')}:${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;
  const timerIsLow = secondsLeft < 300 && secondsLeft > 0;

  const q: AdvancedQuestion = questions[currentQuestion];
  const domainKey = DOMAIN_STRING_TO_KEY[q.domain] ?? 'D1';
  const userAnswer = answers[currentQuestion];
  const isFlagged = flagged[currentQuestion];
  const answered = userAnswer !== null;
  const totalAnswered = answers.filter((a) => a !== null).length;
  const unanswered = questions.length - totalAnswered;
  const flaggedCount = flagged.filter(Boolean).length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!q) return null;

  const diffColors = DIFFICULTY_COLORS[q.difficulty];
  const isLast = currentQuestion === questions.length - 1;

  // Mirrors Exam Mode: the question map can only jump to an already-answered
  // question or the next unanswered one — no skipping ahead to preview later questions.
  const maxAnsweredIdx = answers.reduce<number>((max, a, i) => (a !== null ? Math.max(max, i) : max), -1);
  const canNavigateTo = (idx: number) => idx <= maxAnsweredIdx + 1;

  const handleOptionClick = (idx: number) => {
    // Once an answer is picked for a question, it's final — no changing your mind.
    if (answered) return;
    setAnswer(idx);
  };

  const handleFinish = () => {
    setIsPaused(false);
    setFinishDialogOpen(true);
  };

  const handleConfirmFinish = () => {
    setFinishDialogOpen(false);
    startReview();
  };

  const renderQuestionGrid = () => (
    <Box display="flex" flexWrap="wrap" gap={1.5}>
      {questions.map((_, idx) => {
        const ans = answers[idx];
        const isAnsweredQ = ans !== null;
        const isCurrent = idx === currentQuestion;
        const isFlaggedQ = flagged[idx];
        const isNavigable = canNavigateTo(idx);
        return (
          <Box
            key={idx}
            as="button"
            w="32px"
            h="32px"
            borderRadius="md"
            fontSize="xs"
            fontFamily="mono"
            fontWeight={isCurrent ? 700 : 500}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={
              isCurrent ? 'rgba(57,73,171,0.08)' :
              isAnsweredQ ? 'rgba(57,73,171,0.06)' :
              'transparent'
            }
            color={
              isCurrent ? 'brand.600' :
              isAnsweredQ ? 'brand.600' :
              isNavigable ? 'gray.500' : 'gray.300'
            }
            border="1px solid"
            borderColor={
              isCurrent ? 'brand.500' :
              isFlaggedQ ? 'orange.400' :
              isAnsweredQ ? 'brand.400' :
              isNavigable ? 'border' : 'bg.muted'
            }
            cursor={isNavigable ? 'pointer' : 'not-allowed'}
            transition="all 0.15s"
            _hover={isNavigable ? { borderColor: 'brand.400', bg: 'rgba(57,73,171,0.04)' } : {}}
            onClick={() => {
              if (!isNavigable) return;
              goToQuestion(idx);
              setMobileNavOpen(false);
            }}
          >
            {idx + 1}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box
      minH="100vh"
      bg="transparent"
      display="flex"
      flexDirection="column"
      userSelect="none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Screenshot / tab-switch capture warning */}
      <AnimatePresence>
        {showCaptureWarning && (
          <motion.div
            style={{
              position: 'fixed',
              top: 16,
              left: 0,
              right: 0,
              zIndex: 10000,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, x: 0 }}
              animate={{ opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -5, 5, 0] }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, x: { duration: 0.4, ease: 'easeInOut' } }}
            >
            <Box
              px={5}
              py={3}
              borderRadius="xl"
              bg="red.600"
              color="white"
              boxShadow="0 8px 24px rgba(0,0,0,0.25)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2.5}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <Text fontSize="sm" fontWeight={700}>
                Screen capture / tab switch detected — returned to Question 1
              </Text>
            </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not-in-fullscreen prompt: re-entering fullscreen requires a fresh
          user gesture, so this gives the learner a one-click way back in
          instead of leaving them stuck after a violation reset. */}
      <AnimatePresence>
        {!isFullscreen && !isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 20,
              left: 0,
              right: 0,
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
            }}
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

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(10,14,40,0.72)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.22 }}
              style={{ width: '100%', maxWidth: '420px' }}
            >
              <Box
                bg="rgba(255,255,255,0.97)"
                _dark={{ bg: 'rgba(20,30,58,0.98)' }}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.35)"
                boxShadow="0 24px 64px rgba(10,14,40,0.35)"
                overflow="hidden"
              >
                <Box px={6} pt={7} pb={5} textAlign="center">
                  <Box
                    display="inline-flex" alignItems="center" justifyContent="center"
                    w={14} h={14} borderRadius="full"
                    bg="rgba(57,73,171,0.08)" mb={4}
                    border="2px solid rgba(57,73,171,0.15)"
                  >
                    <Text fontSize="2xl">⏸</Text>
                  </Box>
                  <Heading size="lg" fontWeight={800} color="brand.700" mb={1}
                    _dark={{ color: 'gray.100' }}>
                    Exam Paused
                  </Heading>
                  <Text fontSize="sm" color="gray.500">Your progress is saved automatically.</Text>
                </Box>

                <Box mx={6} mb={5} p={4} borderRadius="xl"
                  bg="rgba(57,73,171,0.05)" border="1px solid rgba(57,73,171,0.1)"
                  _dark={{ bg: 'rgba(57,73,171,0.1)', borderColor: 'rgba(57,73,171,0.2)' }}>
                  <SimpleGrid columns={3} gap={3}>
                    {[
                      { label: 'Answered', value: `${totalAnswered}/${questions.length}` },
                      { label: 'Remaining', value: `${unanswered}` },
                      { label: 'Flagged', value: `${flaggedCount}` },
                    ].map((s) => (
                      <Box key={s.label} textAlign="center">
                        <Text fontSize="lg" fontWeight={800} color="brand.700"
                          _dark={{ color: 'brand.200' }}>{s.value}</Text>
                        <Text fontSize="2xs" color="gray.500" fontWeight={600}>{s.label}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                <VStack gap={2.5} px={6} pb={7}>
                  <Button
                    w="full" size="lg"
                    bg="brand.600" color="white"
                    fontWeight={700} borderRadius="xl"
                    boxShadow="0 4px 14px rgba(57,73,171,0.35)"
                    _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
                    transition="all 0.2s"
                    onClick={() => setIsPaused(false)}
                  >
                    ▶ Resume Exam
                  </Button>
                  <Button
                    w="full" size="md"
                    bg={unanswered === 0 ? 'green.500' : 'rgba(239,68,68,0.08)'}
                    color={unanswered === 0 ? 'white' : 'red.500'}
                    border="1px solid"
                    borderColor={unanswered === 0 ? 'transparent' : 'rgba(239,68,68,0.25)'}
                    fontWeight={700} borderRadius="xl"
                    _hover={{
                      bg: unanswered === 0 ? 'green.600' : 'rgba(239,68,68,0.14)',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    onClick={handleFinish}
                  >
                    {unanswered === 0 ? '✓ Submit Exam' : `Submit Early (${unanswered} unanswered)`}
                  </Button>
                  <Link as={NextLink} href="/home" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button
                      w="full" size="sm"
                      variant="ghost"
                      color="gray.500"
                      fontWeight={600}
                      borderRadius="xl"
                      _hover={{ color: 'brand.600', bg: 'rgba(57,73,171,0.06)' }}
                    >
                      ← Exit to Home
                    </Button>
                  </Link>
                </VStack>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finish confirmation dialog */}
      <AnimatePresence>
        {finishDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <Box
                bg="rgba(255, 255, 255, 0.88)"
                backdropFilter="blur(20px)"
                _dark={{ bg: 'rgba(15, 23, 42, 0.88)', borderColor: 'rgba(255, 255, 255, 0.12)' }}
                w="100%"
                maxW="500px"
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.45)"
                boxShadow="0 24px 64px rgba(0, 0, 0, 0.2)"
                p={[6, 8]}
                position="relative"
              >
                <Text fontSize="2xs" fontFamily="mono" fontWeight={700} color="brand.400" letterSpacing="0.1em" mb={2}
                  _dark={{ color: 'brand.300' }}>
                  ADVANCED MOCK EXAM
                </Text>
                <Heading size="md" fontWeight={700} color="brand.800" _dark={{ color: 'brand.200' }} mb={4}>
                  Finish Practice Session?
                </Heading>
                <Text fontSize="sm" color="gray.800" _dark={{ color: 'gray.100' }} fontWeight={500} lineHeight="tall" mb={6}>
                  You will be redirected to the bulk review dashboard where you can check all your chosen options before final score evaluation.
                </Text>
                <HStack justify="flex-end" gap={3} pt={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.06)" _dark={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Button variant="outline" size="sm" onClick={() => setFinishDialogOpen(false)} fontWeight={600} color="gray.700" _dark={{ color: 'gray.300', _hover: { bg: 'white/10' } }}>
                    Cancel
                  </Button>
                  <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={handleConfirmFinish} fontWeight={700}>
                    Review Selected Answers
                  </Button>
                </HStack>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky top bar */}
      <Box
        borderBottom="1px solid"
        borderColor="rgba(255, 255, 255, 0.3)"
        bg="rgba(255, 255, 255, 0.45)"
        backdropFilter="blur(16px)"
        _dark={{
          bg: "rgba(15, 23, 42, 0.45)",
          borderColor: "rgba(255, 255, 255, 0.08)"
        }}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" py={3}>
          <HStack justify="space-between" align="center" wrap="wrap" gap={3}>
            <HStack gap={3}>
              <Text fontSize="sm" fontWeight={700} color="brand.700">
                Advanced Practice
              </Text>
              <HStack
                gap={1.5}
                px={3}
                py={1}
                bg="rgba(57, 73, 171, 0.08)"
                borderRadius="md"
                border="1px solid"
                borderColor="rgba(57, 73, 171, 0.18)"
                _dark={{
                  bg: "rgba(124, 110, 250, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.12)"
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {isPaused ? (
                  <Text
                    as="button"
                    fontFamily="mono"
                    fontSize="xs"
                    fontWeight={700}
                    color="orange.500"
                    onClick={() => setIsPaused(false)}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    PAUSED
                  </Text>
                ) : (
                  <Text
                    fontFamily="mono"
                    fontSize="xs"
                    fontWeight={700}
                    color={timerIsLow ? 'error.600' : 'gray.700'}
                  >
                    {timerDisplay}
                  </Text>
                )}
              </HStack>
            </HStack>
            <HStack gap={3}>
              <Text fontSize="xs" fontFamily="mono" color="gray.500" fontWeight={600} display={['none', 'block']}>
                Completed: {totalAnswered}/{questions.length} Questions
              </Text>
              <Button
                display={['flex', 'flex', 'none']}
                size="sm"
                variant="outline"
                borderColor="border"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                {mobileNavOpen ? 'Hide Map' : 'Show Map'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="border"
                onClick={() => setIsPaused(true)}
              >
                Pause
              </Button>
              <Button
                size="sm"
                bg="brand.600"
                color="white"
                fontWeight={700}
                _hover={{ bg: 'brand.700' }}
                onClick={handleFinish}
              >
                Finish
              </Button>
            </HStack>
          </HStack>
          <Progress.Root value={secondsLeft > 0 ? (secondsLeft / TOTAL_SECONDS) * 100 : 0} mt={2.5} size="xs">
            <Progress.Track bg="border">
              <Progress.Range
                bg={timerIsLow ? 'error.500' : 'brand.600'}
                transition="width 1s linear"
              />
            </Progress.Track>
          </Progress.Root>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxW="container.xl" py={[4, 6]} flex={1} display="flex" flexDirection="column">
        {/* Mobile collapsible question map */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              key="mobile-map"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', width: '100%' }}
            >
              <Box
                display={['block', 'block', 'none']}
                mb={4} p={4}
                bg="rgba(255,255,255,0.45)"
                backdropFilter="blur(16px)"
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.35)"
                _dark={{ bg: 'rgba(30,41,59,0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <Text fontSize="xs" fontWeight={700} color="brand.700" fontFamily="mono" mb={3}>
                  QUESTION MAP ({totalAnswered}/{questions.length})
                </Text>
                {renderQuestionGrid()}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <HStack align="stretch" gap={6} flex={1} wrap="wrap">
          {/* LEFT: Question + Options */}
          <VStack gap={4} align="stretch" flex={{ base: '100%', md: 2 }} pb={{ base: 28, md: 0 }}>
            <Box
              bg="rgba(255,255,255,0.45)"
              backdropFilter="blur(16px)"
              border="1px solid rgba(255,255,255,0.35)"
              borderRadius="xl"
              p={[4, 6]}
              boxShadow="0 8px 32px 0 rgba(31,38,135,0.03)"
              overflow="hidden"
              _dark={{ bg: 'rgba(15,23,42,0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <VStack gap={5} align="stretch">
                    {/* Meta row */}
                    <HStack justify="space-between">
                      <HStack gap={2} flexWrap="wrap">
                        <Badge
                          bg={DOMAIN_SOLID_BGS[domainKey]}
                          color={DOMAIN_SOLID_TEXT[domainKey]}
                          px={2.5} py={0.5} borderRadius="md"
                          fontSize="xs" fontFamily="mono" fontWeight={700}
                        >
                          {q.domain}
                        </Badge>
                        <Badge
                          bg={diffColors.bg}
                          color={diffColors.text}
                          border="1px solid"
                          borderColor={diffColors.border}
                          px={2.5} py={0.5} borderRadius="md"
                          fontSize="2xs" fontWeight={700}
                          _dark={{ color: q.difficulty === '3x' ? '#b996fb' : '#fa9a80' }}
                        >
                          {q.difficulty} Difficulty
                        </Badge>
                      </HStack>
                      <HStack gap={3}>
                        <Button
                          size="xs"
                          variant={isFlagged ? 'solid' : 'outline'}
                          borderColor="orange.300"
                          color={isFlagged ? 'white' : 'orange.600'}
                          bg={isFlagged ? 'orange.500' : 'transparent'}
                          _hover={{ bg: isFlagged ? 'orange.600' : 'orange.50' }}
                          onClick={() => toggleFlag(currentQuestion)}
                        >
                          <Text fontSize="2xs" fontWeight={700}>
                            {isFlagged ? '⚑ Flagged' : '⚐ Flag'}
                          </Text>
                        </Button>
                        <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight={600}>
                          Question {currentQuestion + 1} of {questions.length}
                        </Text>
                      </HStack>
                    </HStack>

                    {/* Question text */}
                    <Heading as="p" size="md" fontWeight={600} lineHeight={1.6} color="brand.700"
                      _dark={{ color: 'gray.100' }}>
                      {q.text}
                    </Heading>

                    {/* Options */}
                    <VStack gap={3} align="stretch">
                      {q.options.map((opt, idx) => {
                        const isSelected = userAnswer === idx;

                        const borderColor = isSelected ? 'brand.500' : 'border';
                        const bg = isSelected ? 'rgba(57,73,171,0.06)' : 'transparent';
                        const keyBg = isSelected ? 'brand.600' : 'transparent';
                        const keyBorderColor: any = isSelected ? 'brand.500' : { _light: 'gray.300', _dark: 'rgba(255,255,255,0.16)' };
                        const keyTextColor: any = isSelected ? 'white' : { _light: 'gray.500', _dark: 'gray.400' };

                        return (
                          <Box
                            key={idx}
                            as="button"
                            w="100%"
                            display="flex"
                            alignItems="flex-start"
                            gap={3.5}
                            p={4}
                            borderRadius="xl"
                            border="2px solid"
                            borderColor={borderColor}
                            bg={bg}
                            backdropFilter="blur(8px)"
                            cursor={answered ? 'default' : 'pointer'}
                            transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                            textAlign="left"
                            _dark={{
                              bg: isSelected ? 'rgba(57,73,171,0.12)' : 'rgba(30,41,59,0.3)',
                              borderColor: isSelected ? 'brand.500' : 'rgba(255,255,255,0.06)',
                            }}
                            _hover={!answered ? {
                              borderColor: 'brand.400',
                              bg: 'rgba(255,255,255,0.45)',
                              _dark: { bg: 'rgba(30,41,59,0.5)' },
                            } : {}}
                            onClick={() => handleOptionClick(idx)}
                          >
                            <Box
                              w="24px"
                              h="24px"
                              borderRadius="md"
                              border="1.5px solid"
                              borderColor={keyBorderColor}
                              bg={keyBg}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexShrink={0}
                              color={keyTextColor}
                              fontFamily="mono"
                              fontSize="xs"
                              fontWeight={700}
                              mt="1px"
                            >
                              {OPTION_LABELS[idx]}
                            </Box>
                            <Text fontSize="sm" color="gray.700" fontWeight={isSelected ? 600 : 500}
                              lineHeight={1.5} mt="1px" _dark={{ color: 'gray.200' }}>
                              {opt}
                            </Text>
                          </Box>
                        );
                      })}
                    </VStack>
                  </VStack>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Bottom nav strip */}
            <HStack
              justify="space-between"
              mt={{ base: 0, md: 2 }}
              position={{ base: 'fixed', md: 'static' }}
              bottom={{ base: 0, md: 'auto' }}
              left={{ base: 0, md: 'auto' }}
              right={{ base: 0, md: 'auto' }}
              w={{ base: '100%', md: 'auto' }}
              bg={{ base: 'rgba(255,255,255,0.9)', md: 'transparent' }}
              backdropFilter={{ base: 'blur(16px)', md: 'none' }}
              p={{ base: 4, md: 0 }}
              borderTop={{ base: '1px solid', md: 'none' }}
              borderColor="rgba(0,0,0,0.1)"
              zIndex={100}
              _dark={{ bg: { base: 'rgba(15,23,42,0.9)', md: 'transparent' }, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Button
                variant="outline"
                borderColor="border"
                size="md"
                disabled={currentQuestion === 0}
                onClick={prevQuestion}
                fontWeight={600}
              >
                Previous
              </Button>
              <Text fontSize="xs" fontFamily="mono" color="gray.500" fontWeight={600}>
                {totalAnswered} of {questions.length} Answered
              </Text>
              {!isLast ? (
                <Button
                  bg="blue.600"
                  color="white"
                  fontWeight={700}
                  size="md"
                  px={6}
                  borderRadius="lg"
                  _hover={{ bg: 'blue.700', transform: 'translateY(-1px)', boxShadow: '0 4px 14px rgba(37,99,235,0.45)' }}
                  _active={{ transform: 'translateY(0)', boxShadow: 'none' }}
                  transition="all 0.2s"
                  onClick={nextQuestion}
                >
                  Next
                </Button>
              ) : (
                <Button
                  bg="brand.600"
                  color="white"
                  fontWeight={700}
                  _hover={{ bg: 'brand.700' }}
                  size="md"
                  onClick={handleFinish}
                >
                  Finish Exam
                </Button>
              )}
            </HStack>
          </VStack>

          {/* RIGHT: Question navigation sidebar (desktop only) */}
          <Box
            display={['none', 'none', 'block']}
            flex={{ base: '100%', md: 1 }}
            maxW="320px"
          >
            <Box
              position="sticky"
              top="74px"
              bg="rgba(255,255,255,0.45)"
              backdropFilter="blur(16px)"
              border="1px solid rgba(255,255,255,0.35)"
              borderRadius="xl"
              p={5}
              boxShadow="0 8px 32px 0 rgba(31,38,135,0.03)"
              _dark={{ bg: 'rgba(15,23,42,0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <VStack gap={4} align="stretch">
                <Text fontSize="xs" fontWeight={700} color="brand.700" fontFamily="mono" letterSpacing="0.05em">
                  QUESTION NAVIGATION MAP
                </Text>

                {renderQuestionGrid()}

                {/* Legend */}
                <VStack gap={2} align="stretch" pt={4} borderTop="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="gray.400" fontWeight={700} fontFamily="mono" mb={1}>
                    COLOR LEGEND
                  </Text>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="brand.500" bg="rgba(57,73,171,0.08)" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Active Question</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="brand.400" bg="rgba(57,73,171,0.06)" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Answered Question</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="border" bg="transparent" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Unanswered Question</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="orange.400" bg="transparent" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Flagged Question</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}

function BulkReviewScreen() {
  const { questions, answers, flagged, cancelReview, complete } = useAdvancedExamStore();
  const [submitOpen, setSubmitOpen] = useState(false);

  const answeredCount = answers.filter((a) => a !== null).length;
  const totalCount = questions.length;
  const unansweredCount = totalCount - answeredCount;

  const handleSubmit = () => {
    complete();
    setSubmitOpen(false);
  };

  return (
    <Box
      bg="transparent"
      minH="100vh"
      display="flex"
      flexDirection="column"
      userSelect="none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <Box
        borderBottom="1px solid" borderColor="rgba(255, 255, 255, 0.3)"
        bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(16px)"
        _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        position="sticky" top={0} zIndex={10}
      >
        <Container maxW="container.md" py={4}>
          <HStack justify="space-between" align="center">
            <VStack align="flex-start" gap={0}>
              <Text fontSize="2xs" fontFamily="mono" fontWeight={700} color="brand.400" letterSpacing="0.1em"
                _dark={{ color: 'brand.300' }}>
                ADVANCED MOCK EXAM
              </Text>
              <Text fontSize="sm" fontWeight={700} color="brand.700">Review</Text>
            </VStack>
            <Text fontSize="xs" fontFamily="mono" color="gray.500" fontWeight={600}>
              Progress: {answeredCount}/{totalCount} Completed
            </Text>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.md" py={[6, 8]} flex={1}>
        <VStack gap={5} align="stretch">
          {/* Warning banner */}
          <AnimatePresence>
            {unansweredCount > 0 && (
              <motion.div
                key="unanswered-alert"
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <Box p={4} bg="orange.50" border="1.5px solid" borderColor="orange.200" borderRadius="xl"
                  boxShadow="0 2px 8px rgba(246,173,85,0.05)" mb={4}>
                  <HStack align="flex-start" gap={3}>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#dd6b20" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <VStack align="stretch" gap={0.5}>
                      <Text fontSize="sm" fontWeight={700} color="orange.800">
                        Unanswered Questions Alert
                      </Text>
                      <Text fontSize="xs" color="orange.700" lineHeight={1.5}>
                        You still have <strong>{unansweredCount}</strong> {unansweredCount === 1 ? 'question' : 'questions'} remaining without an answer. Please review them before final evaluation to ensure maximum score potential.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions checklist */}
          <VStack gap={4} align="stretch">
            {questions.map((q, i) => {
              const domainKey = DOMAIN_STRING_TO_KEY[q.domain] ?? 'D1';
              const userAnswer = answers[i];
              const isFlaggedQ = flagged[i];
              const isUnanswered = userAnswer === null;

              return (
                <Box
                  key={q.id}
                  bg={isUnanswered ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255, 255, 255, 0.45)'}
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: isUnanswered ? 'rgba(251, 191, 36, 0.08)' : 'rgba(30, 41, 59, 0.45)',
                    borderColor: isFlaggedQ ? 'orange.400' : (isUnanswered ? 'orange.300' : 'rgba(255, 255, 255, 0.08)'),
                  }}
                  border="1.5px solid"
                  borderColor={isFlaggedQ ? 'orange.400' : (isUnanswered ? 'orange.300' : 'rgba(255, 255, 255, 0.35)')}
                  borderRadius="xl"
                  p={5}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.02)"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{ borderColor: 'brand.400', bg: isUnanswered ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255, 255, 255, 0.65)' }}
                >
                  <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                    <HStack gap={2.5}>
                      <Badge px={2} py={0.5} borderRadius="md" bg={DOMAIN_SOLID_BGS[domainKey]} color={DOMAIN_SOLID_TEXT[domainKey]}
                        fontFamily="mono" fontSize="2xs" fontWeight={700} border="none">
                        {q.domain}
                      </Badge>
                      <Text fontSize="2xs" color="gray.500" fontFamily="mono" fontWeight={600}>
                        {DOMAIN_NAMES[domainKey]}
                      </Text>
                      <Text fontSize="2xs" fontFamily="mono" color="gray.400" fontWeight={700}>
                        QUESTION {i + 1}
                      </Text>
                    </HStack>
                    <HStack gap={2}>
                      {isFlaggedQ && (
                        <Badge bg="orange.100" color="orange.700" fontSize="2xs" fontWeight={700} fontFamily="mono" borderRadius="md" border="1px solid" borderColor="orange.200">
                          FLAGGED
                        </Badge>
                      )}
                      {isUnanswered ? (
                        <Badge bg="red.50" color="red.700" fontSize="2xs" fontWeight={700} fontFamily="mono" borderRadius="md" border="1px solid" borderColor="red.100">
                          UNANSWERED
                        </Badge>
                      ) : (
                        <Badge bg="brand.50" color="brand.700" fontSize="2xs" fontWeight={700} fontFamily="mono" borderRadius="md" border="1px solid" borderColor="brand.100">
                          COMPLETED
                        </Badge>
                      )}
                    </HStack>
                  </HStack>

                  <Text fontSize="sm" color="brand.700" fontWeight={600} mb={4} lineHeight={1.5}>
                    {q.text}
                  </Text>

                  <VStack gap={2} align="stretch">
                    {q.options.map((opt, oi) => {
                      const isUserAnswer = userAnswer === oi;
                      return (
                        <HStack
                          key={oi}
                          p={2.5}
                          borderRadius="lg"
                          bg={isUserAnswer ? 'rgba(57,73,171,0.06)' : 'transparent'}
                          border="1px solid"
                          borderColor={isUserAnswer ? 'brand.200' : 'transparent'}
                          gap={3}
                        >
                          <Box
                            w="20px" h="20px" borderRadius="md" border="1px solid"
                            borderColor={isUserAnswer ? 'brand.500' : 'border'}
                            bg={isUserAnswer ? 'brand.600' : 'transparent'}
                            display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                            color={isUserAnswer ? 'white' : 'gray.400'}
                            fontFamily="mono" fontSize="2xs" fontWeight={700}
                          >
                            {OPTION_LABELS[oi]}
                          </Box>
                          <Text fontSize="xs" color={isUserAnswer ? 'brand.700' : 'gray.600'} fontWeight={isUserAnswer ? 600 : 500} flex={1} lineHeight={1.4}>
                            {opt}
                          </Text>
                          {isUserAnswer && (
                            <Badge size="sm" bg="brand.600" color="white" borderRadius="md" px={2} py={0.5} fontSize="3xs" fontWeight={700} fontFamily="mono">
                              SELECTED
                            </Badge>
                          )}
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Container>

      {/* Sticky footer */}
      <Box
        borderTop="1px solid" borderColor="rgba(255, 255, 255, 0.3)"
        bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(16px)"
        _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        position="sticky" bottom={0} zIndex={10}
      >
        <Container maxW="container.md" py={3.5}>
          <HStack justify="space-between" align="center" wrap="wrap" gap={3}>
            <Text fontSize="xs" color="gray.500" fontWeight={600} fontFamily="mono">
              Progress: {answeredCount} / {totalCount} Answered &bull; {unansweredCount} Remaining
            </Text>
            <HStack gap={3}>
              <Button size="md" variant="outline" borderColor="border" onClick={cancelReview} fontWeight={600}>
                Return to Simulator
              </Button>
              <Button size="md" bg="brand.600" color="white" fontWeight={700} _hover={{ bg: 'brand.700' }}
                onClick={() => setSubmitOpen(true)}>
                Submit Practice Exam
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Submit confirmation dialog */}
      <AnimatePresence>
        {submitOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <Box
                bg="rgba(255, 255, 255, 0.88)" backdropFilter="blur(20px)"
                _dark={{ bg: 'rgba(15, 23, 42, 0.88)', borderColor: 'rgba(255, 255, 255, 0.12)' }}
                w="100%" maxW="500px" borderRadius="2xl" border="1px solid"
                borderColor="rgba(255, 255, 255, 0.45)" boxShadow="0 24px 64px rgba(0, 0, 0, 0.2)"
                p={[6, 8]} position="relative"
              >
                <Heading size="md" fontWeight={700} color="brand.800" _dark={{ color: 'brand.200' }} mb={4}>
                  Submit simulator answers?
                </Heading>
                <Text fontSize="sm" color="gray.800" _dark={{ color: 'gray.100' }} fontWeight={500} lineHeight="tall" mb={6}>
                  Are you sure you want to finalize your practice exam? You will not be able to return to modify any answers after this action.
                  {unansweredCount > 0 && (
                    <HStack as="span" display="flex" alignItems="flex-start" gap={1.5} color="orange.600" fontWeight={700} mt={2.5}>
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <Text as="span">
                        WARNING: You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'} that will be marked incorrect.
                      </Text>
                    </HStack>
                  )}
                </Text>
                <HStack justify="flex-end" gap={3} pt={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.06)" _dark={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Button variant="outline" size="sm" onClick={() => setSubmitOpen(false)} fontWeight={600} color="gray.700" _dark={{ color: 'gray.300', _hover: { bg: 'white/10' } }}>
                    Cancel
                  </Button>
                  <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={handleSubmit} fontWeight={700}>
                    Submit Evaluation
                  </Button>
                </HStack>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export function AdvancedPracticeView() {
  const [mounted, setMounted] = useState(false);
  const { isStarted, isComplete, isReviewing, start, reset } = useAdvancedExamStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (!isStarted) return <StartScreen onStart={() => start()} />;
  if (isReviewing) return <BulkReviewScreen />;
  if (isComplete) return <ResultsScreen onReset={() => { reset(); start(); }} />;
  return <QuestionView />;
}
