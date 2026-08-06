'use client';
import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Progress,
  SimpleGrid,
} from '@chakra-ui/react';
import { useExamStore } from '@/hooks/useExamState';
import { useTimer } from '@/hooks/useTimer';
import { DOMAINS, DOMAIN_TEXT_COLORS, DOMAIN_BADGE_BGS, DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT, isMultiSelect, isAnswerCorrect, isAnswerSelected } from '@/types/exam';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, CheckIcon } from '@/components/icons';

const MODE_LABELS = {
  exam: { title: 'Timed Exam Mode', timer: true, showExplanations: false },
  review: { title: 'Review Mode', timer: false, showExplanations: true },
  zen: { title: 'Zen Mode', timer: false, showExplanations: false },
  focus: { title: 'Focus Mode', timer: true, showExplanations: false },
};

// Custom SVG Icons to avoid using raw text or emojis
const FlagIcon = ({ isFlagged }: { isFlagged: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    stroke="currentColor"
    strokeWidth="2"
    fill={isFlagged ? "currentColor" : "none"}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export function ExamView() {
  const {
    questions,
    currentQuestion,
    answers,
    mode,
    timeRemaining,
    setAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    resetExam,
    flagged,
    toggleFlag,
    startReview,
    reviewChecked,
    setReviewChecked,
    clearReviewChecked,
  } = useExamStore();

  const timer = useTimer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const exitingRef = useRef(false);
  const startTimerRef = useRef(timer.start);
  const stopTimerRef = useRef(timer.stop);
  useEffect(() => {
    startTimerRef.current = timer.start;
    stopTimerRef.current = timer.stop;
  }, [timer.start, timer.stop]);

  const [initialTime] = useState(timeRemaining);

  useEffect(() => {
    if (mode && MODE_LABELS[mode]?.timer && initialTime > 0) {
      startTimerRef.current(initialTime);
    }
    return () => stopTimerRef.current();
  }, [mode, initialTime]);

  const handleExit = () => {
    exitingRef.current = true;
    timer.stop();
    setDialogOpen(false);
    resetExam();
  };

  const handleResume = () => {
    timer.resume();
    setDialogOpen(false);
  };

  const handleAnswerClick = (index: number) => {
    const q = questions[currentQuestion];
    if (isMultiSelect(q)) {
      const current = answers[currentQuestion];
      const selected = Array.isArray(current) ? [...current] : [];
      const idx = selected.indexOf(index);
      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        selected.push(index);
      }
      if (showExplanations && reviewChecked[currentQuestion]) {
        clearReviewChecked(currentQuestion);
      }
      setAnswer(selected);
    } else {
      if (showExplanations && reviewChecked[currentQuestion] && answers[currentQuestion] !== index) {
        clearReviewChecked(currentQuestion);
      }
      setAnswer(index);
    }
  };

  const handleFinishClick = () => {
    setFinishDialogOpen(true);
  };

  const handleConfirmFinish = () => {
    setFinishDialogOpen(false);
    startReview();
  };

  const handleCheckAnswer = () => {
    setReviewChecked(currentQuestion);
  };

  const config = mode ? MODE_LABELS[mode] : null;
  const showTimer = config?.timer ?? false;
  const showExplanations = config?.showExplanations ?? false;

  const q = questions[currentQuestion];
  if (!q) return null;

  const activeOptions = ['A', 'B', 'C', 'D'];
  const isAnswered = answers[currentQuestion] !== null;
  const isReviewChecked = reviewChecked[currentQuestion] ?? false;
  const showAnswerFeedback = showExplanations && isReviewChecked;
  const domainInfo = DOMAINS.find((d) => d.id === q.domain);

  const answeredCount = answers.filter((a) => a !== null).length;
  const isTimed = showTimer;

  const maxAnsweredIdx = answers.reduce<number>((max, ans, i) => ans !== null ? Math.max(max, i) : max, -1);

  const canNavigateTo = (i: number) => {
    if (mode === 'review') return true;
    return i <= maxAnsweredIdx + 1;
  };

  // Shared function to render the 60 questions grid beautifully
  const renderQuestionGrid = () => {
    return (
      <HStack wrap="wrap" gap={1.5} w="100%">
        {questions.map((_, i) => {
          const isCurrent = i === currentQuestion;
          const isAns = answers[i] !== null;
          const isCorrect = isAns && isAnswerCorrect(questions[i], answers[i]);
          const isFlagged = flagged[i];
          const isNavigable = canNavigateTo(i);

          let bgColor = 'transparent';
          let borderColor = isNavigable ? 'border' : 'bg.muted';
          if (isCurrent) {
            bgColor = 'rgba(193,95,60,0.08)';
            borderColor = 'brand.500';
          } else if (isAns) {
            bgColor = showAnswerFeedback ? (isCorrect ? '#e6f9f1' : '#fde8e8') : 'rgba(193,95,60,0.06)';
            borderColor = showAnswerFeedback ? (isCorrect ? '#22c88a' : '#f05a5a') : 'brand.400';
          }
          const textColor = isAns
            ? (showAnswerFeedback ? (isCorrect ? 'success.600' : 'error.600') : 'brand.600')
            : isNavigable ? 'brand.500' : 'gray.300';

          return (
            <Box key={i} position="relative">
              <Box
                as="button"
                w="32px"
                h="32px"
                fontSize="xs"
                fontFamily="mono"
                fontWeight={isCurrent ? 700 : 500}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                bg={bgColor}
                color={textColor}
                cursor={isNavigable ? 'pointer' : 'not-allowed'}
                transition="all 0.15s"
                _hover={isNavigable ? { borderColor: 'brand.400', bg: 'rgba(193,95,60,0.04)' } : {}}
                onClick={() => {
                  if (isNavigable) {
                    goToQuestion(i);
                    setMobileNavOpen(false);
                  }
                }}
              >
                {i + 1}
              </Box>
              {isFlagged && (
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="orange.400"
                  border="1px solid"
                  borderColor="bg.panel"
                />
              )}
            </Box>
          );
        })}
      </HStack>
    );
  };

  return (
    <Box bg="transparent" minH="100vh" display="flex" flexDirection="column">
      {/* Sticky Header */}
      <Box
        borderBottom="1px solid"
        borderColor="rgba(255, 255, 255, 0.3)"
        bg="rgba(255, 255, 255, 0.45)"
        backdropFilter="blur(16px)"
        _dark={{
          bg: "rgba(26, 24, 23, 0.45)",
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
                {config?.title || 'Exam'}
              </Text>

              {showTimer && (
                <HStack
                  gap={1.5}
                  px={3}
                  py={1}
                  bg="rgba(217, 119, 87, 0.08)"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="rgba(217, 119, 87, 0.18)"
                  _dark={{
                    bg: "rgba(217, 119, 87, 0.12)",
                    borderColor: "rgba(255, 255, 255, 0.12)"
                  }}
                >
                  <ClockIcon />
                  {timer.isPaused ? (
                    <Text
                      as="button"
                      fontFamily="mono"
                      fontSize="xs"
                      fontWeight={700}
                      color="orange.500"
                      onClick={handleResume}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      PAUSED
                    </Text>
                  ) : (
                    <Text
                      fontFamily="mono"
                      fontSize="xs"
                      fontWeight={700}
                      color={timer.isLow ? 'error.600' : 'gray.700'}
                    >
                      {timer.display}
                    </Text>
                  )}
                </HStack>
              )}
            </HStack>

            <HStack gap={3}>
              {/* Question status counter */}
              <Text fontSize="xs" fontFamily="mono" color="gray.500" fontWeight={600} display={['none', 'block']}>
                Completed: {answeredCount}/{questions.length} Questions
              </Text>

              {/* Mobile Question Map Toggle */}
              <Button
                display={['flex', 'flex', 'none']}
                size="sm"
                variant="outline"
                borderColor="border"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                {mobileNavOpen ? 'Hide Map' : 'Show Map'}
              </Button>

              {isTimed ? (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="border"
                  onClick={() => { timer.pause(); setDialogOpen(true); }}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="border"
                  onClick={() => setDialogOpen(true)}
                >
                  Exit
                </Button>
              )}

              <Button
                size="sm"
                bg="brand.600"
                color="white"
                fontWeight={700}
                _hover={{ bg: 'brand.700' }}
                onClick={handleFinishClick}
              >
                Finish
              </Button>
            </HStack>
          </HStack>

          {showTimer && (
            <Progress.Root value={timer.secondsLeft > 0 ? (timer.secondsLeft / initialTime) * 100 : 0} mt={2.5} size="xs">
              <Progress.Track bg="border">
                <Progress.Range
                  bg={timer.isLow ? 'error.500' : 'brand.600'}
                  transition="width 1s linear"
                />
              </Progress.Track>
            </Progress.Root>
          )}
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxW="container.xl" py={[4, 6]} flex={1} display="flex" flexDirection="column" justifyContent="center">
        {/* Mobile-only Collapsible Question Map Panel */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              key="mobile-question-map"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', width: '100%' }}
            >
              <Box
                display={['block', 'block', 'none']}
                mb={4}
                p={4}
                bg="bg.panel"
                borderRadius="lg"
                border="1px solid"
                borderColor="border"
                boxShadow="sm"
              >
                <Text fontSize="xs" fontWeight={700} color="brand.700" mb={3} fontFamily="mono">
                  QUESTION MAP ({answeredCount}/{questions.length})
                </Text>
                {renderQuestionGrid()}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <HStack align="stretch" gap={6} wrap="wrap">
          {/* LEFT PANEL: The Question details (70% width on desktop) */}
          <VStack gap={4} align="stretch" flex={{ base: '100%', md: 2 }} pb={{ base: 28, md: 0 }}>
            <Box
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(16px)"
              _dark={{
                bg: "rgba(26, 24, 23, 0.45)",
                borderColor: "rgba(255, 255, 255, 0.08)"
              }}
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.35)"
              borderRadius="xl"
              p={[4, 6]}
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
              overflow="hidden"
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
                {/* Meta details */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Badge
                      px={2.5}
                      py={0.5}
                      borderRadius="md"
                      bg={DOMAIN_SOLID_BGS[q.domain]}
                      color={DOMAIN_SOLID_TEXT[q.domain]}
                      fontFamily="mono"
                      fontSize="xs"
                      fontWeight={700}
                      border="none"
                    >
                      {q.domain}
                    </Badge>
                    {domainInfo && (
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        px={2}
                        py={0.5}
                        borderRadius="sm"
                        bg={DOMAIN_BADGE_BGS[q.domain]._light}
                        _dark={{
                          bg: DOMAIN_BADGE_BGS[q.domain]._dark,
                          color: DOMAIN_TEXT_COLORS[q.domain]._dark,
                        }}
                        borderLeft="2px solid"
                        borderLeftColor={DOMAIN_SOLID_BGS[q.domain]}
                        fontSize="xs"
                        fontFamily="mono"
                        fontWeight={700}
                        color={DOMAIN_TEXT_COLORS[q.domain]._light}
                      >
                        {domainInfo.shortName}
                      </Box>
                    )}
                  </HStack>

                  <HStack gap={3}>
                    <Button
                      size="xs"
                      variant={flagged[currentQuestion] ? 'solid' : 'outline'}
                      colorScheme="orange"
                      onClick={() => toggleFlag(currentQuestion)}
                      borderColor="orange.300"
                      color={flagged[currentQuestion] ? 'white' : 'orange.600'}
                      bg={flagged[currentQuestion] ? 'orange.500' : 'transparent'}
                      _hover={{ bg: flagged[currentQuestion] ? 'orange.600' : 'orange.50' }}
                    >
                      <FlagIcon isFlagged={flagged[currentQuestion]} />
                      <Text fontSize="2xs" ml={1} fontWeight={700}>
                        {flagged[currentQuestion] ? 'Flagged' : 'Flag'}
                      </Text>
                    </Button>
                    <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight={600}>
                      Question {currentQuestion + 1} of {questions.length}
                    </Text>
                  </HStack>
                </HStack>

                {/* Scenario details */}
                {q.scenario && (
                  <Box
                    p={4}
                    bg="rgba(217, 119, 87, 0.08)"
                    border="1px solid"
                    borderColor="rgba(217, 119, 87, 0.18)"
                    borderLeft="4px solid"
                    borderLeftColor="brand.500"
                    borderRadius="lg"
                    _dark={{
                      bg: "rgba(217, 119, 87, 0.12)",
                      borderColor: "rgba(255, 255, 255, 0.12)"
                    }}
                  >
                    <HStack gap={1.5} mb={1.5} color="brand.700" _dark={{ color: "brand.300" }}>
                      <InfoIcon />
                      <Text fontFamily="mono" fontSize="xs" fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                        Scenario Context
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.900" _dark={{ color: "gray.100" }} fontWeight={500} lineHeight={1.6}>
                      {q.scenario}
                    </Text>
                  </Box>
                )}

                {/* Multi-Select Badge */}
                {isMultiSelect(q) && (
                  <Badge
                    alignSelf="flex-start"
                    px={2.5}
                    py={0.5}
                    borderRadius="md"
                    bg="purple.100"
                    color="purple.800"
                    border="1px solid"
                    borderColor="purple.200"
                    fontFamily="mono"
                    fontSize="2xs"
                    fontWeight={700}
                    _dark={{ bg: 'rgba(168, 85, 247, 0.15)', color: 'purple.200', borderColor: 'rgba(168, 85, 247, 0.3)' }}
                  >
                    SELECT ALL THAT APPLY
                  </Badge>
                )}

                {/* Question Text */}
                <Heading as="p" size="md" fontWeight={600} lineHeight={1.6} color="brand.700">
                  {q.text}
                </Heading>

                {/* Options List */}
                <VStack gap={3} align="stretch">
                  {q.options.map((opt, i) => {
                    const isSingle = !isMultiSelect(q);
                    const isSelected = isAnswerSelected(answers[currentQuestion], i);
                    const isCorrectOption = isSingle ? (i === q.correctAnswer) : (q.correctAnswers ?? []).includes(i);
                    let borderColor = 'border';
                    let bgColor = 'transparent';
                    let keyBg = 'transparent';
                    let keyBorderColor: string | { _light: string; _dark: string } = { _light: 'gray.300', _dark: 'rgba(255, 255, 255, 0.16)' };
                    let keyTextColor: string | { _light: string; _dark: string } = { _light: 'gray.500', _dark: 'gray.400' };

                    if (showAnswerFeedback && isReviewChecked) {
                      if (isCorrectOption) {
                        borderColor = '#22c88a';
                        bgColor = '#e6f9f1';
                        keyBg = '#22c88a';
                        keyBorderColor = '#22c88a';
                        keyTextColor = 'white';
                      } else if (isSelected) {
                        borderColor = '#f05a5a';
                        bgColor = '#fde8e8';
                        keyBg = '#f05a5a';
                        keyBorderColor = '#f05a5a';
                        keyTextColor = 'white';
                      }
                    } else if (isSelected) {
                      borderColor = 'brand.500';
                      bgColor = 'rgba(193,95,60,0.06)';
                      keyBg = 'brand.600';
                      keyBorderColor = 'brand.500';
                      keyTextColor = 'white';
                    }

                    return (
                      <Box
                        key={i}
                        as="button"
                        display="flex"
                        alignItems="flex-start"
                        gap={3.5}
                        p={4}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor={borderColor}
                        bg={bgColor}
                        backdropFilter="blur(8px)"
                        _dark={{
                          bg: isSelected ? 'rgba(217, 119, 87, 0.1)' : (showAnswerFeedback && isReviewChecked ? (isCorrectOption ? 'rgba(34, 200, 138, 0.15)' : 'rgba(240, 90, 90, 0.15)') : 'rgba(35, 33, 32, 0.3)'),
                          borderColor: isSelected ? 'brand.500' : (showAnswerFeedback && isReviewChecked ? (isCorrectOption ? '#22c88a' : '#f05a5a') : 'rgba(255, 255, 255, 0.06)')
                        }}
                        cursor="pointer"
                        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                        _hover={{
                          borderColor: isSelected ? 'brand.500' : 'brand.400',
                          bg: isSelected ? 'rgba(217, 119, 87, 0.08)' : 'rgba(255, 255, 255, 0.45)',
                          _dark: {
                            bg: isSelected ? 'rgba(217, 119, 87, 0.15)' : 'rgba(35, 33, 32, 0.5)'
                          }
                        }}
                        onClick={() => handleAnswerClick(i)}
                        textAlign="left"
                        w="100%"
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
                          {isSingle ? activeOptions[i] : (
                            isSelected ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : null
                          )}
                        </Box>
                        <Text fontSize="sm" color="gray.700" fontWeight={isSelected ? 600 : 500} lineHeight={1.5} mt="1px">
                          {opt}
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>

                {/* Inline explain button */}
                {showExplanations && !isReviewChecked && isAnswered && (
                  <Box textAlign="center" pt={2}>
                    <Button
                      bg="brand.600"
                      color="white"
                      size="md"
                      px={8}
                      fontWeight={700}
                      _hover={{ bg: 'brand.700' }}
                      onClick={handleCheckAnswer}
                    >
                      Check Answer
                    </Button>
                  </Box>
                )}

                  {/* Explanations Section */}
                  <AnimatePresence>
                    {showAnswerFeedback && (
                      <motion.div
                        key="explanation-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box
                          p={5}
                          bg="rgba(217, 119, 87, 0.05)"
                          border="1px solid"
                          borderColor="rgba(217, 119, 87, 0.15)"
                          borderRadius="xl"
                          boxShadow="inset 0 2px 4px rgba(0,0,0,0.01)"
                          mt={2}
                          _dark={{
                            bg: "rgba(217, 119, 87, 0.08)",
                            borderColor: "rgba(255, 255, 255, 0.08)"
                          }}
                        >
                          <HStack color="brand.700" gap={2} mb={2.5}>
                            <InfoIcon />
                            <Text fontSize="sm" fontWeight={700} fontFamily="mono" textTransform="uppercase">
                              Explanation & Reference
                            </Text>
                          </HStack>
                          <Text
                            fontSize="sm"
                            color="gray.700"
                            lineHeight={1.7}
                            dangerouslySetInnerHTML={{ __html: q.explanation }}
                          />
                          {q.source && (
                            <Text mt={3} pt={2.5} borderTop="1px solid" borderColor="border" fontSize="2xs" fontFamily="mono" color="gray.400" fontWeight={600}>
                              SOURCE: {q.source}
                            </Text>
                          )}
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </VStack>
              </motion.div>
            </AnimatePresence>
          </Box>

            {/* Bottom Nav Strip */}
            <HStack 
              justify="space-between" 
              mt={{ base: 0, md: 2 }} 
              mb={{ base: 0, md: 20 }}
              position={{ base: 'fixed', md: 'static' }}
              bottom={{ base: 0, md: 'auto' }}
              left={{ base: 0, md: 'auto' }}
              right={{ base: 0, md: 'auto' }}
              w={{ base: '100%', md: 'auto' }}
              bg={{ base: 'rgba(255, 255, 255, 0.9)', md: 'transparent' }}
              backdropFilter={{ base: 'blur(16px)', md: 'none' }}
              p={{ base: 4, md: 0 }}
              borderTop={{ base: '1px solid', md: 'none' }}
              borderColor="rgba(0, 0, 0, 0.1)"
              zIndex={100}
              _dark={{ bg: { base: 'rgba(26, 24, 23, 0.9)', md: 'transparent' }, borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
                {answeredCount} of {questions.length} Answered
              </Text>
              {currentQuestion < questions.length - 1 ? (
                <Button
                  bg="brand.500"
                  color="white"
                  fontWeight={700}
                  size="md"
                  px={6}
                  borderRadius="lg"
                  _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', boxShadow: '0 4px 14px rgba(204,120,92,0.45)' }}
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
                  onClick={handleFinishClick}
                >
                  Finish Exam
                </Button>
              )}
            </HStack>
          </VStack>

          {/* RIGHT PANEL: Question Grid Sidebar (30% width, desktop only) */}
          <Box
            display={['none', 'none', 'block']}
            flex={{ base: '100%', md: 1 }}
            maxW="320px"
          >
            <Box
              position="sticky"
              top="74px"
              bg="rgba(255, 255, 255, 0.45)"
              backdropFilter="blur(16px)"
              _dark={{
                bg: "rgba(26, 24, 23, 0.45)",
                borderColor: "rgba(255, 255, 255, 0.08)"
              }}
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.35)"
              borderRadius="xl"
              p={5}
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
            >
              <VStack gap={4} align="stretch">
                <Text fontSize="xs" fontWeight={700} color="brand.700" fontFamily="mono" letterSpacing="0.05em">
                  QUESTION NAVIGATION MAP
                </Text>

                {renderQuestionGrid()}

                {/* Color Legend */}
                <VStack gap={2} align="stretch" pt={4} borderTop="1px solid" borderColor="border">
                  <Text fontSize="2xs" color="gray.400" fontWeight={700} fontFamily="mono" mb={1}>
                    COLOR LEGEND
                  </Text>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="brand.500" bg="rgba(193,95,60,0.08)" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Active Question</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="brand.400" bg="rgba(193,95,60,0.06)" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Answered Question</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Box w={3} h={3} borderRadius="sm" border="1px solid" borderColor="border" bg="transparent" />
                    <Text fontSize="11px" color="gray.600" fontWeight={500}>Unanswered Question</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>

      {/* Pause/Exit Dialog Modal */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
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
                _dark={{ bg: 'rgba(23,21,20,0.98)' }}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.35)"
                boxShadow="0 24px 64px rgba(10,14,40,0.35)"
                overflow="hidden"
              >
                <Box px={6} pt={7} pb={5} textAlign="center">
                  <Box
                    display="inline-flex" alignItems="center" justifyContent="center"
                    w={14} h={14} borderRadius="full"
                    bg={isTimed ? "rgba(193,95,60,0.08)" : "rgba(239,68,68,0.08)"} mb={4}
                    border="2px solid" borderColor={isTimed ? "rgba(193,95,60,0.15)" : "rgba(239,68,68,0.15)"}
                  >
                    {isTimed ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="#9A4A2F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    )}
                  </Box>
                  <Heading size="lg" fontWeight={800} color="brand.700" mb={1}
                    _dark={{ color: 'gray.100' }}>
                    {isTimed ? 'Exam Paused' : 'Exit Simulator?'}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {isTimed ? 'Your progress is saved automatically.' : 'Are you sure you want to exit? All current progress will be lost.'}
                  </Text>
                </Box>

                <Box mx={6} mb={5} p={4} borderRadius="xl"
                  bg="rgba(193,95,60,0.05)" border="1px solid rgba(193,95,60,0.1)"
                  _dark={{ bg: 'rgba(193,95,60,0.1)', borderColor: 'rgba(193,95,60,0.2)' }}>
                  <SimpleGrid columns={3} gap={3}>
                    {[
                      { label: 'Answered', value: `${answeredCount}/${questions.length}` },
                      { label: 'Remaining', value: `${questions.length - answeredCount}` },
                      { label: 'Flagged', value: `${flagged.filter(Boolean).length}` },
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
                    boxShadow="0 4px 14px rgba(193,95,60,0.35)"
                    _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
                    transition="all 0.2s"
                    onClick={isTimed ? handleResume : () => setDialogOpen(false)}
                  >
                    {isTimed ? (
                      <HStack gap={2} justify="center"><PlayIcon size={14} /><Text>Resume Exam</Text></HStack>
                    ) : 'Cancel'}
                  </Button>
                  {isTimed && (
                    <Button
                      w="full" size="md"
                      bg={(questions.length - answeredCount) === 0 ? 'green.500' : 'rgba(239,68,68,0.08)'}
                      color={(questions.length - answeredCount) === 0 ? 'white' : 'red.500'}
                      border="1px solid"
                      borderColor={(questions.length - answeredCount) === 0 ? 'transparent' : 'rgba(239,68,68,0.25)'}
                      fontWeight={700} borderRadius="xl"
                      _hover={{
                        bg: (questions.length - answeredCount) === 0 ? 'green.600' : 'rgba(239,68,68,0.14)',
                        transform: 'translateY(-1px)',
                      }}
                      transition="all 0.2s"
                      onClick={() => { setDialogOpen(false); handleFinishClick(); }}
                    >
                      {(questions.length - answeredCount) === 0 ? (
                        <HStack gap={2} justify="center"><CheckIcon size={14} /><Text>Submit Exam</Text></HStack>
                      ) : `Submit Early (${questions.length - answeredCount} unanswered)`}
                    </Button>
                  )}
                  <Button
                    w="full" size="sm"
                    variant="ghost"
                    color={isTimed ? "gray.500" : "red.500"}
                    fontWeight={600}
                    borderRadius="xl"
                    _hover={{ color: isTimed ? 'brand.600' : 'red.600', bg: isTimed ? 'rgba(193,95,60,0.06)' : 'rgba(239,68,68,0.06)' }}
                    onClick={handleExit}
                  >
                    ← {isTimed ? 'Exit to Configuration' : 'Exit and Lose Progress'}
                  </Button>
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
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              padding: '16px'
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
                _dark={{
                  bg: "rgba(26, 24, 23, 0.88)",
                  borderColor: "rgba(255, 255, 255, 0.12)"
                }}
                w="100%"
                maxW="500px"
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.45)"
                boxShadow="0 24px 64px rgba(0, 0, 0, 0.2)"
                p={[6, 8]}
                position="relative"
              >
                <Heading size="md" fontWeight={700} color="brand.800" _dark={{ color: "brand.200" }} mb={4}>
                  Finish Practice Session?
                </Heading>
                <Text fontSize="sm" color="gray.800" _dark={{ color: "gray.100" }} fontWeight={500} lineHeight="tall" mb={6}>
                  You will be redirected to the bulk review dashboard where you can check all your chosen options before final score evaluation.
                </Text>
                <HStack justify="flex-end" gap={3} pt={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.06)" wrap="wrap" _dark={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <Button variant="outline" size="sm" onClick={() => setFinishDialogOpen(false)} fontWeight={600} color="gray.700" _dark={{ color: "gray.300", _hover: { bg: "white/10" } }}>
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
    </Box>
  );
}
