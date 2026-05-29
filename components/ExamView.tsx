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
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPositioner,
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from '@chakra-ui/react';
import { useExamStore } from '@/hooks/useExamState';
import { useTimer } from '@/hooks/useTimer';
import { ResultsSummary } from './ResultsSummary';
import { ReviewOverview } from './ReviewOverview';
import { DOMAINS, type Domain } from '@/types/exam';

const DOMAIN_COLORS: Record<Domain, string> = {
  D1: '#7C6EFA',
  D2: '#FA8C6E',
  D3: '#6ECFFA',
  D4: '#F0D06E',
  D5: '#A06EFA',
};

const MODE_LABELS = {
  exam: { title: 'Exam Mode', timer: true, showExplanations: false },
  review: { title: 'Review Mode', timer: false, showExplanations: true },
  zen: { title: 'Zen Mode', timer: false, showExplanations: false },
  focus: { title: 'Focus Mode', timer: true, showExplanations: false },
};

export function ExamView() {
  const {
    questions,
    currentQuestion,
    answers,
    mode,
    isComplete,
    isReviewing,
    timeRemaining,
    completeExam,
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
  const exitingRef = useRef(false);
  const startTimerRef = useRef(timer.start);
  const stopTimerRef = useRef(timer.stop);
  startTimerRef.current = timer.start;
  stopTimerRef.current = timer.stop;

  useEffect(() => {
    if (mode && MODE_LABELS[mode]?.timer && timeRemaining > 0) {
      startTimerRef.current(timeRemaining);
    }
    return () => stopTimerRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, timeRemaining]);

  const handleExit = () => {
    exitingRef.current = true;
    timer.stop();
    setDialogOpen(false);
    resetExam();
  };

  const handlePause = () => {
    timer.pause();
    setDialogOpen(false);
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

  if (isComplete) {
    return <ResultsSummary onRestart={resetExam} />;
  }

  if (isReviewing) {
    return <ReviewOverview />;
  }

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

  return (
    <Box bg="#fafbfc" minH="100vh">
      <Box
        borderBottom="1px"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.lg" py={3}>
          <HStack justify="space-between" wrap="wrap" gap={2}>
            <HStack gap={3}>
              <Box
                px={2}
                py={1}
                bg="accent.50"
                borderRadius="md"
                border="1px"
                borderColor="accent.200"
              >
                <Text fontFamily="mono" fontSize="xs" fontWeight={600} color="accent.500" letterSpacing="0.1em">
                  CCA-F
                </Text>
              </Box>
              <Text fontSize="sm" fontWeight={500} color="gray.700">
                {config?.title || 'Exam'}
              </Text>
              {showTimer && (
                <TooltipRoot>
                  <TooltipTrigger>
                    {timer.isPaused ? (
                      <Text
                        as="button"
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight={600}
                        color="orange.500"
                        onClick={handleResume}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        PAUSED
                      </Text>
                    ) : (
                      <Text
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight={600}
                        color={timer.isLow ? 'error.500' : 'gray.600'}
                      >
                        {timer.display}
                      </Text>
                    )}
                  </TooltipTrigger>
                  <TooltipPositioner>
                    <TooltipContent>
                      <Text fontSize="sm">{timer.isPaused ? 'Click to resume' : 'Time remaining'}</Text>
                    </TooltipContent>
                  </TooltipPositioner>
                </TooltipRoot>
              )}
            </HStack>
            <HStack gap={3}>
              <Text fontSize="xs" fontFamily="mono" color="gray.400">
                {answeredCount}/{questions.length}
              </Text>
              {isTimed ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { timer.pause(); setDialogOpen(true); }}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDialogOpen(true)}
                >
                  Exit
                </Button>
              )}
              <Button
                size="sm"
                variant="solid"
                colorScheme="accent"
                onClick={handleFinishClick}
              >
                Finish
              </Button>
            </HStack>
          </HStack>
          {showTimer && (
            <Progress.Root value={timer.secondsLeft > 0 ? (timer.secondsLeft / timeRemaining) * 100 : 0} mt={2}>
              <Progress.Track>
                <Progress.Range
                  bg={timer.isLow ? 'error.500' : 'accent.400'}
                />
              </Progress.Track>
            </Progress.Root>
          )}
        </Container>
      </Box>

      {/* Pause/Exit dialog */}
      <DialogRoot open={dialogOpen} onOpenChange={(e) => {
        setDialogOpen(e.open);
        if (!e.open && timer.isPaused && !exitingRef.current) {
          timer.resume();
        }
        exitingRef.current = false;
      }}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isTimed ? 'Pause Exam?' : 'Exit Exam?'}</DialogTitle>
              <DialogCloseTrigger>
                <Box as="span" fontSize="lg" lineHeight="1" color="gray.500" _hover={{ color: 'gray.800' }}>
                  ✕
                </Box>
              </DialogCloseTrigger>
            </DialogHeader>
            <DialogBody>
              <Text fontSize="sm" color="gray.600">
                {isTimed
                  ? 'Your timer is paused. You can resume when you\'re ready, or exit completely.'
                  : 'Are you sure you want to exit? Your progress will be lost.'}
              </Text>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={handleResume}>
                {isTimed ? 'Resume' : 'Cancel'}
              </Button>
              {isTimed && (
                <Button variant="solid" size="sm" colorPalette="red" onClick={handleExit}>
                  Exit Exam
                </Button>
              )}
              {!isTimed && (
                <Button variant="solid" size="sm" colorPalette="red" onClick={handleExit}>
                  Exit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* Finish confirmation dialog */}
      <DialogRoot open={finishDialogOpen} onOpenChange={(e) => setFinishDialogOpen(e.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finish Exam?</DialogTitle>
              <DialogCloseTrigger>
                <Box as="span" fontSize="lg" lineHeight="1" color="gray.500" _hover={{ color: 'gray.800' }}>
                  ✕
                </Box>
              </DialogCloseTrigger>
            </DialogHeader>
            <DialogBody>
              <Text fontSize="sm" color="gray.600">
                You will be able to review all your answers before final submission.
              </Text>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setFinishDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="solid" size="sm" colorScheme="accent" onClick={handleConfirmFinish}>
                Review Answers
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <Container maxW="container.lg" pt={[4, 6]} pb={20}>
        <VStack gap={4} align="stretch">
          {/* Question navigation strip */}
          <HStack
            wrap="wrap"
            gap={1.5}
            p={3}
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          >
            {questions.map((_, i) => {
              const isCurrent = i === currentQuestion;
              const isAns = answers[i] !== null;
              const isCorrect = isAns && answers[i] === questions[i].correctAnswer;
              const isFlagged = flagged[i];
              const isNavigable = canNavigateTo(i);

              let bgColor = 'transparent';
              let borderColor = isNavigable ? 'gray.300' : 'gray.100';
              if (isCurrent) {
                bgColor = 'accent.50';
                borderColor = 'accent.400';
              } else if (isAns) {
                bgColor = showAnswerFeedback ? (isCorrect ? '#e6f9f1' : '#fde8e8') : 'accent.50';
                borderColor = showAnswerFeedback ? (isCorrect ? '#22c88a' : '#f05a5a') : 'accent.400';
              }
              const textColor = isAns
                ? (showAnswerFeedback ? (isCorrect ? 'success.500' : 'error.500') : 'accent.500')
                : isNavigable ? 'gray.400' : 'gray.200';

              return (
                <TooltipRoot key={i}>
                  <TooltipTrigger>
                    <Box position="relative">
                      <Box
                        as="button"
                        w="32px"
                        h="32px"
                        fontSize="xs"
                        fontFamily="mono"
                        fontWeight={500}
                        borderRadius="md"
                        border="1px"
                        borderColor={borderColor}
                        bg={bgColor}
                        color={textColor}
                        cursor={isNavigable ? 'pointer' : 'not-allowed'}
                        transition="all 0.1s"
                        _hover={isNavigable ? { borderColor: 'accent.400', color: 'accent.500' } : {}}
                        onClick={() => isNavigable && goToQuestion(i)}
                      >
                        {i + 1}
                      </Box>
                      {isFlagged && (
                        <Box
                          position="absolute"
                          top="-4px"
                          right="-4px"
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg="orange.400"
                          border="1.5px solid white"
                        />
                      )}
                    </Box>
                  </TooltipTrigger>
                  <TooltipPositioner>
                    <TooltipContent>
                      <Text fontSize="sm">
                        Question {i + 1}{isAns ? ' (answered)' : ''}{isFlagged ? ' (flagged)' : ''}
                      </Text>
                    </TooltipContent>
                  </TooltipPositioner>
                </TooltipRoot>
              );
            })}
          </HStack>

          {/* Question card */}
          <Box
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            p={[4, 6]}
          >
            <VStack gap={4} align="stretch">
              <HStack justify="space-between">
                <HStack gap={2}>
                  <Badge
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    bg={`${domainColor}18`}
                    color={domainColor}
                    fontFamily="mono"
                    fontSize="xs"
                    fontWeight={600}
                    letterSpacing="0.05em"
                    border={`1px solid ${domainColor}40`}
                  >
                    {q.domain}
                  </Badge>
                  {domainInfo && (
                    <Text fontSize="xs" color="gray.500" fontFamily="mono">
                      {domainInfo.shortName}
                    </Text>
                  )}
                </HStack>
                <HStack gap={2}>
                  <Button
                    size="xs"
                    variant={flagged[currentQuestion] ? 'solid' : 'outline'}
                    colorPalette="orange"
                    onClick={() => toggleFlag(currentQuestion)}
                  >
                    {flagged[currentQuestion] ? 'Flagged' : 'Flag'}
                  </Button>
                  <Text fontSize="xs" fontFamily="mono" color="gray.400">
                    Q{currentQuestion + 1}/{questions.length}
                  </Text>
                </HStack>
              </HStack>

              {q.scenario && (
                <Box
                  p={3}
                  bg="gray.50"
                  borderLeft="2px solid"
                  borderLeftColor="accent.400"
                  borderRadius="0 md md 0"
                >
                  <Text fontFamily="mono" fontSize="xs" fontWeight={600} color="accent.500" textTransform="uppercase" mb={1}>
                    Scenario
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineHeight={1.6}>
                    {q.scenario}
                  </Text>
                </Box>
              )}

              <Heading as="p" size="md" fontWeight={400} lineHeight={1.7} color="gray.800">
                {q.text}
              </Heading>

              <VStack gap={2} align="stretch">
                {q.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion] === i;
                  const isCorrectOption = i === q.correctAnswer;
                  let borderColor = 'gray.300';
                  let bgColor = 'white';
                  let keyBg: string | undefined;

                  if (showAnswerFeedback && isReviewChecked) {
                    if (isCorrectOption) {
                      borderColor = '#22c88a';
                      bgColor = '#e6f9f1';
                      keyBg = '#22c88a';
                    } else if (isSelected) {
                      borderColor = '#f05a5a';
                      bgColor = '#fde8e8';
                      keyBg = '#f05a5a';
                    }
                  } else if (isSelected) {
                    borderColor = 'accent.400';
                    bgColor = 'accent.50';
                    keyBg = 'accent.400';
                  }

                  return (
                    <Box
                      key={i}
                      as="button"
                      display="flex"
                      alignItems="flex-start"
                      gap={3}
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={borderColor}
                      bg={bgColor}
                      cursor="pointer"
                      transition="all 0.1s"
                      _hover={{ borderColor: 'accent.400', bg: 'accent.50' }}
                      onClick={() => handleAnswerClick(i)}
                      textAlign="left"
                      w="100%"
                    >
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="sm"
                        border="1px solid"
                        borderColor={keyBg || 'gray.300'}
                        bg={keyBg || 'transparent'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        color={keyBg ? 'white' : 'gray.400'}
                        fontFamily="mono"
                        fontSize="xs"
                        fontWeight={500}
                        mt="1px"
                      >
                        {activeOptions[i]}
                      </Box>
                      <Text fontSize="sm" color="gray.600" lineHeight={1.6}>
                        {opt}
                      </Text>
                    </Box>
                  );
                })}
              </VStack>

              {/* Review mode: Check Answer button (shows feedback inline) */}
              {showExplanations && !isReviewChecked && isAnswered && (
                <Box textAlign="center">
                  <Button
                    colorScheme="accent"
                    size="sm"
                    onClick={handleCheckAnswer}
                  >
                    Check Answer
                  </Button>
                </Box>
              )}

              {/* Explanation (review mode) */}
              {showAnswerFeedback && (
                <Box
                  p={4}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    lineHeight={1.7}
                    dangerouslySetInnerHTML={{ __html: q.explanation }}
                  />
                  {q.source && (
                    <Text mt={2} pt={2} borderTop="1px solid" borderColor="gray.200" fontSize="xs" fontFamily="mono" color="gray.400">
                      Source: {q.source}
                    </Text>
                  )}
                </Box>
              )}
            </VStack>
          </Box>

        </VStack>
      </Container>

      {/* Fixed footer with navigation buttons */}
      <Box
        borderTop="1px"
        borderColor="gray.200"
        bg="white"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
      >
        <Container maxW="container.lg" py={3}>
          <HStack justify="space-between">
            <Button
              variant="outline"
              size="md"
              disabled={currentQuestion === 0}
              onClick={prevQuestion}
            >
              Previous
            </Button>
            <Text fontSize="xs" fontFamily="mono" color="gray.400">
              {answeredCount} answered &middot; {questions.length - answeredCount} remaining
            </Text>
            {currentQuestion < questions.length - 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={nextQuestion}
              >
                Next
              </Button>
            ) : (
              <Button
                colorScheme="accent"
                size="md"
                onClick={handleFinishClick}
              >
                Finish Exam
              </Button>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
