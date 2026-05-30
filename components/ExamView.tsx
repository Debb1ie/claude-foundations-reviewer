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
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from '@chakra-ui/react';
import { useExamStore } from '@/hooks/useExamState';
import { useTimer } from '@/hooks/useTimer';
import { DOMAINS, type Domain } from '@/types/exam';

const DOMAIN_COLORS: Record<Domain, string> = {
  D1: '#7C6EFA',  // Agentic Arch.
  D2: '#FA8C6E',  // Tool/MCP
  D3: '#6ECFFA',  // Claude Code
  D4: '#F0D06E',  // Prompt Eng.
  D5: '#A06EFA',  // Context Mgmt.
};

const MODE_LABELS = {
  exam: { title: 'Exam Mode', timer: true, showExplanations: false },
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

const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
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
    isComplete,
    isReviewing,
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

  useEffect(() => {
    if (mode && MODE_LABELS[mode]?.timer && timeRemaining > 0) {
      startTimerRef.current(timeRemaining);
    }
    return () => stopTimerRef.current();
  }, [mode, timeRemaining]);

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
    if (showExplanations && reviewChecked[currentQuestion] && answers[currentQuestion] !== index) {
      clearReviewChecked(currentQuestion);
    }
    setAnswer(index);
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
  const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';

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
          const isCorrect = isAns && answers[i] === questions[i].correctAnswer;
          const isFlagged = flagged[i];
          const isNavigable = canNavigateTo(i);

          let bgColor = 'transparent';
          let borderColor = isNavigable ? 'border' : 'bg.muted';
          if (isCurrent) {
            bgColor = 'rgba(57,73,171,0.08)';
            borderColor = 'brand.500';
          } else if (isAns) {
            bgColor = showAnswerFeedback ? (isCorrect ? '#e6f9f1' : '#fde8e8') : 'rgba(57,73,171,0.06)';
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
                _hover={isNavigable ? { borderColor: 'brand.400', bg: 'rgba(57,73,171,0.04)' } : {}}
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
        borderColor="border"
        bg="bg.panel"
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
                <HStack gap={1.5} px={3} py={1} bg="bg.muted" borderRadius="md" border="1px solid" borderColor="border">
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
            <Progress.Root value={timer.secondsLeft > 0 ? (timer.secondsLeft / timeRemaining) * 100 : 0} mt={2.5} size="xs">
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
      <Container maxW="container.xl" py={[4, 6]} flex={1} display="flex" flexDirection="column">
        {/* Mobile-only Collapsible Question Map Panel */}
        {mobileNavOpen && (
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
        )}

        <HStack align="stretch" gap={6} flex={1} wrap="wrap">
          {/* LEFT PANEL: The Question details (70% width on desktop) */}
          <VStack gap={4} align="stretch" flex={{ base: '100%', md: 2 }}>
            <Box
              bg="bg.panel"
              border="1px solid"
              borderColor="border"
              borderRadius="xl"
              p={[4, 6]}
              boxShadow="0 2px 8px rgba(0,0,0,0.01)"
            >
              <VStack gap={5} align="stretch">
                {/* Meta details */}
                <HStack justify="space-between">
                  <HStack gap={2}>
                    <Badge
                      px={2.5}
                      py={1}
                      borderRadius="md"
                      bg={`${domainColor}12`}
                      color={domainColor}
                      fontFamily="mono"
                      fontSize="xs"
                      fontWeight={700}
                      border={`1.5px solid ${domainColor}35`}
                    >
                      {q.domain}
                    </Badge>
                    {domainInfo && (
                      <Text fontSize="xs" color="gray.500" fontFamily="mono" fontWeight={600}>
                        {domainInfo.shortName}
                      </Text>
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
                    bg="bg.muted"
                    borderLeft="4px solid"
                    borderLeftColor="brand.500"
                    borderRadius="0 lg lg 0"
                  >
                    <HStack gap={1.5} mb={1.5} color="brand.600">
                      <InfoIcon />
                      <Text fontFamily="mono" fontSize="xs" fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                        Scenario Context
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight={1.6}>
                      {q.scenario}
                    </Text>
                  </Box>
                )}

                {/* Question Text */}
                <Heading as="p" size="md" fontWeight={600} lineHeight={1.6} color="brand.700">
                  {q.text}
                </Heading>

                {/* Options List */}
                <VStack gap={3} align="stretch">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[currentQuestion] === i;
                    const isCorrectOption = i === q.correctAnswer;
                    let borderColor = 'border';
                    let bgColor = 'transparent';
                    let keyBg = 'transparent';
                    let keyBorderColor = 'border';
                    let keyTextColor = 'gray.400';

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
                      bgColor = 'rgba(57,73,171,0.06)';
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
                        cursor="pointer"
                        transition="all 0.15s ease"
                        _hover={{ borderColor: isSelected ? 'brand.500' : 'brand.400', bg: isSelected ? 'rgba(57,73,171,0.06)' : 'rgba(57,73,171,0.02)' }}
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
                          {activeOptions[i]}
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
                {showAnswerFeedback && (
                  <Box
                    p={5}
                    bg="bg.muted"
                    border="1px solid"
                    borderColor="border"
                    borderRadius="xl"
                    boxShadow="inset 0 2px 4px rgba(0,0,0,0.01)"
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
                )}
              </VStack>
            </Box>

            {/* Bottom Nav Strip */}
            <HStack justify="space-between" mt={2} mb={20}>
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
                  variant="outline"
                  borderColor="border"
                  size="md"
                  onClick={nextQuestion}
                  fontWeight={600}
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
              bg="bg.panel"
              border="1px solid"
              borderColor="border"
              borderRadius="xl"
              p={5}
              boxShadow="0 2px 8px rgba(0,0,0,0.01)"
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
                </VStack>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>

      {/* Pause/Exit Dialog Modal */}
      <DialogRoot open={dialogOpen} onOpenChange={(e) => {
        setDialogOpen(e.open);
        if (!e.open && timer.isPaused && !exitingRef.current) {
          timer.resume();
        }
        exitingRef.current = false;
      }}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius="xl" border="1px solid" borderColor="border">
            <DialogHeader borderBottom="1px solid" borderColor="border" px={6} pt={5} pb={4}>
              <DialogTitle fontSize="md" fontWeight={700} color="brand.700">
                {isTimed ? 'Pause practice exam?' : 'Exit simulator?'}
              </DialogTitle>
            </DialogHeader>
            <DialogBody px={6} py={5}>
              <Text fontSize="sm" color="gray.600">
                {isTimed
                  ? 'Your practice exam timer is paused. Click Resume to continue, or Exit to reset all your progress.'
                  : 'Are you sure you want to exit? All current progress will be lost.'}
              </Text>
            </DialogBody>
            <DialogFooter borderTop="1px solid" borderColor="border" px={6} pt={4} pb={5} gap={3}>
              <Button variant="outline" size="sm" onClick={handleResume} fontWeight={600}>
                {isTimed ? 'Resume' : 'Cancel'}
              </Button>
              <Button bg="red.600" color="white" _hover={{ bg: 'red.700' }} size="sm" onClick={handleExit} fontWeight={700}>
                {isTimed ? 'Exit Practice' : 'Exit Simulator'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Finish confirmation dialog */}
      <DialogRoot open={finishDialogOpen} onOpenChange={(e) => setFinishDialogOpen(e.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius="xl" border="1px solid" borderColor="border">
            <DialogHeader borderBottom="1px solid" borderColor="border" px={6} pt={5} pb={4}>
              <DialogTitle fontSize="md" fontWeight={700} color="brand.700">Finish Practice Session?</DialogTitle>
            </DialogHeader>
            <DialogBody px={6} py={5}>
              <Text fontSize="sm" color="gray.600">
                You will be redirected to the bulk review dashboard where you can check all your chosen options before final score evaluation.
              </Text>
            </DialogBody>
            <DialogFooter borderTop="1px solid" borderColor="border" px={6} pt={4} pb={5} gap={3}>
              <Button variant="outline" size="sm" onClick={() => setFinishDialogOpen(false)} fontWeight={600}>
                Cancel
              </Button>
              <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={handleConfirmFinish} fontWeight={700}>
                Review Selected Answers
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
