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
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedExamStore, type AdvancedQuestion } from '@/hooks/useAdvancedExamState';
import { DOMAINS, DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT } from '@/types/exam';
import NextLink from 'next/link';

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

function MiniProgress({ value, colorBg }: { value: number; colorBg: string }) {
  return (
    <Box w="100%" h="6px" bg="rgba(0,0,0,0.06)" borderRadius="full" overflow="hidden">
      <Box
        w={`${Math.min(100, Math.max(0, value))}%`}
        h="100%"
        bg={colorBg}
        borderRadius="full"
        transition="width 0.4s ease"
      />
    </Box>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  const domainCounts: Record<string, number> = { D1: 20, D2: 13, D3: 17, D4: 16, D5: 14 };
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
                80 scenario-based questions covering all 5 exam domains.
                Answers and explanations are revealed after you finish.
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
                  { label: '80 Questions', sub: 'All 5 domains covered' },
                  { label: 'Exam Mode', sub: 'Review all answers after finishing' },
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
                bg="#3949AB"
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

function ResultsScreen({ onReset }: { onReset: () => void }) {
  const { getScore, questions, answers } = useAdvancedExamStore();
  const { correct, total, pct } = getScore();
  const scaledScore = Math.round(100 + (pct / 100) * 900);
  const passed = scaledScore >= 720;
  const [showReview, setShowReview] = useState(false);

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
            <Box textAlign="center">
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={20} h={20}
                borderRadius="full"
                bg={passed ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)'}
                border="2px solid"
                borderColor={passed ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.3)'}
                mb={4}
                mx="auto"
              >
                <Text fontSize="3xl">{passed ? '✓' : '✗'}</Text>
              </Box>
              <Heading size="2xl" fontWeight={800} color="brand.700" mb={2}>
                {passed ? 'Passed!' : 'Keep Practicing'}
              </Heading>
              <Text color="gray.500" fontSize="lg">
                {correct} / {total} correct · {pct}% · Scaled {scaledScore}
              </Text>
            </Box>

            <Box
              p={6}
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(12px)"
              borderRadius="xl"
              border="1px solid rgba(255, 255, 255, 0.35)"
              _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Text fontSize="sm" fontWeight={700} color="brand.700" mb={4}>Domain Breakdown</Text>
              <VStack gap={3} align="stretch">
                {domainBreakdown.map(({ domain, correct: dc, total: dt }) => {
                  const pctVal = dt > 0 ? (dc / dt) * 100 : 0;
                  const barColor = dc === dt ? '#22c55e' : dc >= dt * 0.7 ? '#5C4EFA' : '#ef4444';
                  const textColor = dc === dt ? 'green.500' : dc >= dt * 0.7 ? 'brand.600' : 'red.400';
                  return (
                    <Box key={domain.id}>
                      <HStack justify="space-between" mb={1.5}>
                        <HStack gap={2}>
                          <Badge bg={DOMAIN_SOLID_BGS[domain.id]} color={DOMAIN_SOLID_TEXT[domain.id]}
                            px={2} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}>
                            {domain.id}
                          </Badge>
                          <Text fontSize="xs" fontWeight={600} color="brand.700">{DOMAIN_NAMES[domain.id]}</Text>
                        </HStack>
                        <Text fontSize="xs" fontWeight={700} color={textColor}>
                          {dc}/{dt}
                        </Text>
                      </HStack>
                      <MiniProgress value={pctVal} colorBg={barColor} />
                    </Box>
                  );
                })}
              </VStack>
            </Box>

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
              <Button
                bg="brand.600"
                color="white"
                fontWeight={700}
                borderRadius="xl"
                px={8}
                boxShadow="0 4px 14px rgba(57,73,171,0.3)"
                _hover={{ bg: 'brand.700', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={onReset}
              >
                Retry
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
                    <Text fontSize="sm" fontWeight={700} color="brand.700">
                      All {total} Questions — Full Review
                    </Text>
                    {questions.map((q, idx) => {
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
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </motion.div>
              )}
            </AnimatePresence>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}

function QuestionView() {
  const {
    questions, currentQuestion, answers, flagged,
    setAnswer, nextQuestion, prevQuestion, goToQuestion,
    toggleFlag, complete,
  } = useAdvancedExamStore();

  const [isPaused, setIsPaused] = useState(false);

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

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setAnswer(idx);
  };

  const handleFinish = () => {
    setIsPaused(false);
    complete();
  };

  return (
    <Box minH="100vh" bg="transparent">
      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
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
                {/* Header */}
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

                {/* Stats */}
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

                {/* Actions */}
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

      {/* Top bar */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="rgba(255,255,255,0.75)"
        backdropFilter="blur(16px)"
        borderBottom="1px solid rgba(255,255,255,0.35)"
        _dark={{ bg: 'rgba(15,23,42,0.8)', borderColor: 'rgba(255,255,255,0.08)' }}
        px={[4, 6]}
        py={3}
      >
        <Container maxW="container.md">
          <HStack justify="space-between" mb={2}>
            <HStack gap={2}>
              <Button
                variant="ghost"
                size="xs"
                color="gray.500"
                fontWeight={700}
                px={3}
                borderRadius="lg"
                border="1px solid rgba(0,0,0,0.08)"
                _hover={{ color: 'brand.600', bg: 'rgba(57,73,171,0.06)', borderColor: 'brand.200' }}
                onClick={() => setIsPaused(true)}
              >
                ⏸ Pause
              </Button>
              <Text fontSize="xs" fontWeight={700} color="brand.700">
                Advanced Practice
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.500" display={['none', 'block']}>
                {totalAnswered}/{questions.length} answered
              </Text>
              <Badge
                bg="rgba(57,73,171,0.08)"
                color="brand.700"
                borderRadius="full"
                px={2.5}
                fontSize="2xs"
                fontWeight={700}
              >
                Q {currentQuestion + 1} / {questions.length}
              </Badge>
              <Button
                size="xs"
                bg={unanswered === 0 ? 'green.500' : 'rgba(239,68,68,0.08)'}
                color={unanswered === 0 ? 'white' : 'red.500'}
                border="1px solid"
                borderColor={unanswered === 0 ? 'transparent' : 'rgba(239,68,68,0.22)'}
                fontWeight={700}
                borderRadius="lg"
                px={3}
                boxShadow={unanswered === 0 ? '0 2px 8px rgba(34,197,94,0.3)' : 'none'}
                _hover={{
                  bg: unanswered === 0 ? 'green.600' : 'rgba(239,68,68,0.14)',
                  transform: 'translateY(-1px)',
                }}
                transition="all 0.18s"
                onClick={handleFinish}
              >
                {unanswered === 0 ? '✓ Finish' : `Finish (${unanswered} left)`}
              </Button>
            </HStack>
          </HStack>
          <MiniProgress value={progress} colorBg="#5C4EFA" />
        </Container>
      </Box>

      <Container maxW="container.md" py={[6, 8]}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VStack gap={5} align="stretch">
              {/* Badges row */}
              <HStack gap={2} flexWrap="wrap">
                <Badge
                  bg={DOMAIN_SOLID_BGS[domainKey]}
                  color={DOMAIN_SOLID_TEXT[domainKey]}
                  px={2.5} py={0.5} borderRadius="md"
                  fontSize="2xs" fontFamily="mono" fontWeight={700}
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
                <Box flex={1} />
                <Button
                  size="xs"
                  variant="ghost"
                  color={isFlagged ? 'orange.500' : 'gray.400'}
                  px={2}
                  fontWeight={700}
                  _hover={{ bg: 'orange.50', color: 'orange.500' }}
                  onClick={() => toggleFlag(currentQuestion)}
                >
                  {isFlagged ? '⚑ Flagged' : '⚐ Flag'}
                </Button>
              </HStack>

              {/* Question card */}
              <Box
                p={[5, 6]}
                bg="rgba(255,255,255,0.55)"
                backdropFilter="blur(12px)"
                borderRadius="xl"
                border="1px solid"
                borderColor={`${DOMAIN_SOLID_BGS[domainKey]}40`}
                borderTop="3px solid"
                borderTopColor={DOMAIN_SOLID_BGS[domainKey]}
                boxShadow="0 8px 32px 0 rgba(31,38,135,0.04)"
                _dark={{ bg: 'rgba(30,41,59,0.5)', borderColor: `${DOMAIN_SOLID_BGS[domainKey]}30` }}
              >
                <Text fontSize={['sm', 'md']} fontWeight={600} color="brand.800" lineHeight="tall"
                  _dark={{ color: 'gray.100' }}>
                  {q.text}
                </Text>
              </Box>

              {/* Options — no correct/wrong reveal during exam */}
              <VStack gap={2.5} align="stretch">
                {q.options.map((opt, idx) => {
                  const isSelected = userAnswer === idx;
                  const borderColor = isSelected ? 'brand.400' : 'rgba(255,255,255,0.35)';
                  const bg = isSelected ? 'rgba(57,73,171,0.07)' : 'rgba(255,255,255,0.45)';
                  const labelBg = isSelected ? 'rgba(57,73,171,0.15)' : 'rgba(57,73,171,0.08)';

                  return (
                    <Box
                      key={idx}
                      as={answered ? 'div' : 'button'}
                      w="100%"
                      display="flex"
                      alignItems="flex-start"
                      gap={3}
                      p={4}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={borderColor}
                      bg={bg}
                      backdropFilter="blur(8px)"
                      cursor={answered ? 'default' : 'pointer'}
                      transition="all 0.18s"
                      textAlign="left"
                      boxShadow={isSelected ? '0 4px 12px rgba(57,73,171,0.08)' : 'none'}
                      _dark={{
                        bg: isSelected ? 'rgba(57,73,171,0.12)' : 'rgba(30,41,59,0.4)',
                        borderColor,
                      }}
                      _hover={!answered ? {
                        borderColor: 'brand.400',
                        bg: 'rgba(255,255,255,0.65)',
                        transform: 'translateX(2px)',
                      } : {}}
                      onClick={() => handleOptionClick(idx)}
                    >
                      <Box
                        minW={7} h={7}
                        borderRadius="lg"
                        bg={labelBg}
                        color="brand.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight={800}
                        fontFamily="mono"
                        flexShrink={0}
                        mt={0.5}
                        _dark={{ color: isSelected ? 'brand.200' : 'brand.300' }}
                      >
                        {OPTION_LABELS[idx]}
                      </Box>
                      <Text fontSize="sm" fontWeight={500} color="gray.700" lineHeight="tall"
                        _dark={{ color: 'gray.200' }}>
                        {opt}
                      </Text>
                      {isSelected && (
                        <Box ml="auto" color="brand.400" fontSize="sm" flexShrink={0} mt={1}>●</Box>
                      )}
                    </Box>
                  );
                })}
              </VStack>

              {/* Navigation */}
              <HStack gap={3} justify="space-between" pt={2}>
                <Button
                  variant="outline"
                  borderColor="brand.200"
                  color="brand.600"
                  fontWeight={700}
                  borderRadius="xl"
                  disabled={currentQuestion === 0}
                  onClick={prevQuestion}
                  _hover={{ bg: 'brand.50', borderColor: 'brand.400' }}
                >
                  ← Prev
                </Button>
                <Button
                  bg="brand.600"
                  color="white"
                  fontWeight={700}
                  borderRadius="xl"
                  disabled={isLast}
                  onClick={nextQuestion}
                  boxShadow="0 4px 12px rgba(57,73,171,0.25)"
                  _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                >
                  Next →
                </Button>
              </HStack>

              {/* Question grid jump */}
              <Box
                p={4}
                bg="rgba(255,255,255,0.4)"
                backdropFilter="blur(8px)"
                borderRadius="xl"
                border="1px solid rgba(255,255,255,0.3)"
                _dark={{ bg: 'rgba(30,41,59,0.35)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <Text fontSize="2xs" fontWeight={700} color="gray.500" textTransform="uppercase"
                  letterSpacing="0.08em" mb={2.5}>
                  Jump to question
                </Text>
                <Box display="flex" flexWrap="wrap" gap={1.5}>
                  {questions.map((_, idx) => {
                    const ans = answers[idx];
                    const isAnswered = ans !== null;
                    const isCurrent = idx === currentQuestion;
                    const isFlaggedQ = flagged[idx];
                    return (
                      <Box
                        key={idx}
                        as="button"
                        w={7} h={7}
                        borderRadius="md"
                        fontSize="2xs"
                        fontWeight={700}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={
                          isCurrent ? 'brand.600' :
                          isAnswered ? 'rgba(57,73,171,0.12)' :
                          'rgba(255,255,255,0.5)'
                        }
                        color={
                          isCurrent ? 'white' :
                          isAnswered ? 'brand.600' :
                          'gray.500'
                        }
                        border="1.5px solid"
                        borderColor={
                          isCurrent ? 'brand.500' :
                          isFlaggedQ ? 'orange.400' :
                          isAnswered ? 'rgba(57,73,171,0.3)' :
                          'rgba(255,255,255,0.3)'
                        }
                        transition="all 0.15s"
                        _hover={{ borderColor: 'brand.400', transform: 'scale(1.1)' }}
                        onClick={() => goToQuestion(idx)}
                      >
                        {idx + 1}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </VStack>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}

export function AdvancedPracticeView() {
  const [mounted, setMounted] = useState(false);
  const { isStarted, isComplete, start, reset } = useAdvancedExamStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (!isStarted) return <StartScreen onStart={start} />;
  if (isComplete) return <ResultsScreen onReset={() => { reset(); start(); }} />;
  return <QuestionView />;
}
