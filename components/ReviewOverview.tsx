'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
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
import { DOMAINS, type Domain } from '@/types/exam';

const DOMAIN_COLORS: Record<Domain, string> = {
  D1: '#7C6EFA',
  D2: '#FA8C6E',
  D3: '#6ECFFA',
  D4: '#F0D06E',
  D5: '#A06EFA',
};

export function ReviewOverview() {
  const { questions, answers, flagged, completeExam, cancelReview } = useExamStore();
  const [submitOpen, setSubmitOpen] = useState(false);

  const activeOptions = ['A', 'B', 'C', 'D'];
  const answeredCount = answers.filter((a) => a !== null).length;
  const totalCount = questions.length;

  const handleSubmit = () => {
    completeExam();
    setSubmitOpen(false);
  };

  const getQuestionStatus = (i: number) => {
    const ans = answers[i];
    const isFlagged = flagged[i];
    if (ans === null && !isFlagged) return null;
    if (ans !== null) return 'answered';
    if (isFlagged) return 'flagged';
    return null;
  };

  return (
    <Box bg="#fafbfc" minH="100vh">
      <Box borderBottom="1px" borderColor="gray.200" bg="white" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.lg" py={3}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Box px={2} py={1} bg="accent.50" borderRadius="md" border="1px" borderColor="accent.200">
                <Text fontFamily="mono" fontSize="xs" fontWeight={600} color="accent.500" letterSpacing="0.1em">
                  CCA-F
                </Text>
              </Box>
              <Text fontSize="sm" fontWeight={500} color="gray.700">Review Answers</Text>
            </HStack>
            <Text fontSize="xs" fontFamily="mono" color="gray.400">
              {answeredCount}/{totalCount} answered
            </Text>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.md" py={[4, 6]}>
        <VStack gap={3} align="stretch">
          {questions.map((q, i) => {
            const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';
            const domainInfo = DOMAINS.find((d) => d.id === q.domain);
            const userAnswer = answers[i];
            const isFlagged = flagged[i];
            const status = getQuestionStatus(i);
            const isUnanswered = userAnswer === null;

            return (
              <Box
                key={i}
                bg="white"
                border="1px"
                borderColor={isFlagged ? 'orange.200' : 'gray.200'}
                borderRadius="lg"
                p={4}
              >
                <HStack justify="space-between" mb={2}>
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
                      border={`1px solid ${domainColor}40`}
                    >
                      {q.domain}
                    </Badge>
                    {domainInfo && (
                      <Text fontSize="xs" color="gray.500" fontFamily="mono">
                        {domainInfo.shortName}
                      </Text>
                    )}
                    <Text fontSize="xs" fontFamily="mono" color="gray.400">
                      Q{i + 1}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    {isFlagged && (
                      <Text fontSize="xs" fontFamily="mono" fontWeight={500} color="orange.500">
                        Flagged
                      </Text>
                    )}
                    {isUnanswered && !isFlagged && (
                      <Text fontSize="xs" fontFamily="mono" fontWeight={500} color="gray.400">
                        Not answered
                      </Text>
                    )}
                  </HStack>
                </HStack>

                <Text fontSize="sm" color="gray.800" mb={3} lineHeight={1.6}>
                  {q.text}
                </Text>

                <VStack gap={1.5} align="stretch">
                  {q.options.map((opt, oi) => {
                    const isUserAnswer = userAnswer === oi;
                    return (
                      <HStack
                        key={oi}
                        p={2}
                        borderRadius="sm"
                        bg={isUserAnswer ? 'accent.50' : 'transparent'}
                        gap={2}
                      >
                        <Text fontSize="xs" fontFamily="mono" fontWeight={500} color="gray.400" w="16px">
                          {activeOptions[oi]}
                        </Text>
                        <Text fontSize="sm" color={isUserAnswer ? 'accent.500' : 'gray.600'} flex={1}>
                          {opt}
                        </Text>
                        {isUserAnswer && (
                          <Text fontSize="xs" fontFamily="mono" fontWeight={500} color="accent.500">
                            Selected
                          </Text>
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              </Box>
            );
          })}
        </VStack>

      </Container>

      {/* Sticky footer with review action buttons */}
      <Box
        borderTop="1px"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        bottom={0}
        zIndex={10}
      >
        <Container maxW="container.md" py={3}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              {answeredCount} of {totalCount} answered &middot; {totalCount - answeredCount} unanswered
            </Text>
            <HStack gap={3}>
              <Button
                size="md"
                variant="outline"
                onClick={cancelReview}
              >
                Return to Exam
              </Button>
              <Button
                size="md"
                colorScheme="accent"
                onClick={() => setSubmitOpen(true)}
              >
                Submit Exam
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <DialogRoot open={submitOpen} onOpenChange={(e) => setSubmitOpen(e.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Exam?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to submit your exam? This action cannot be undone.
                {totalCount - answeredCount > 0 && (
                  <Text as="span" color="orange.500" fontWeight={500}>
                    {' '}You still have {totalCount - answeredCount} unanswered {totalCount - answeredCount === 1 ? 'question' : 'questions'}.
                  </Text>
                )}
              </Text>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSubmitOpen(false)}>
                Cancel
              </Button>
              <Button variant="solid" size="sm" colorPalette="red" onClick={handleSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
