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
  D1: '#7C6EFA',  // Agentic Arch.
  D2: '#FA8C6E',  // Tool/MCP
  D3: '#6ECFFA',  // Claude Code
  D4: '#F0D06E',  // Prompt Eng.
  D5: '#A06EFA',  // Context Mgmt.
};

export function ReviewOverview() {
  const { questions, answers, flagged, completeExam, cancelReview } = useExamStore();
  const [submitOpen, setSubmitOpen] = useState(false);

  const activeOptions = ['A', 'B', 'C', 'D'];
  const answeredCount = answers.filter((a) => a !== null).length;
  const totalCount = questions.length;
  const unansweredCount = totalCount - answeredCount;

  const handleSubmit = () => {
    completeExam();
    setSubmitOpen(false);
  };

  return (
    <Box bg="transparent" minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box borderBottom="1px solid" borderColor="border" bg="bg.panel" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.md" py={4}>
          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Text fontSize="sm" fontWeight={700} color="brand.700">Review</Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="xs" fontFamily="mono" color="gray.500" fontWeight={600}>
                Progress: {answeredCount}/{totalCount} Completed
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.md" py={[6, 8]} flex={1}>
        <VStack gap={5} align="stretch">
          {/* Warning Banner for Unanswered Questions */}
          {unansweredCount > 0 && (
            <Box
              p={4}
              bg="orange.50"
              border="1.5px solid"
              borderColor="orange.200"
              borderRadius="xl"
              boxShadow="0 2px 8px rgba(246,173,85,0.05)"
            >
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
          )}

          {/* Questions checklist */}
          <VStack gap={4} align="stretch">
            {questions.map((q, i) => {
              const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';
              const domainInfo = DOMAINS.find((d) => d.id === q.domain);
              const userAnswer = answers[i];
              const isFlagged = flagged[i];
              const isUnanswered = userAnswer === null;

              let cardBorderColor = isUnanswered ? 'orange.300' : 'border';
              let cardBg = isUnanswered ? 'orange.50/20' : 'bg.panel';

              if (isFlagged) {
                cardBorderColor = 'orange.400';
              }

              return (
                <Box
                  key={i}
                  bg={cardBg}
                  border="1.5px solid"
                  borderColor={cardBorderColor}
                  borderRadius="xl"
                  p={5}
                  boxShadow="0 2px 8px rgba(0,0,0,0.01)"
                  transition="all 0.15s ease"
                  _hover={{ borderColor: 'brand.400' }}
                >
                  <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                    <HStack gap={2.5}>
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        bg={`${domainColor}12`}
                        color={domainColor}
                        fontFamily="mono"
                        fontSize="2xs"
                        fontWeight={700}
                        border={`1px solid ${domainColor}35`}
                      >
                        {q.domain}
                      </Badge>
                      {domainInfo && (
                        <Text fontSize="2xs" color="gray.500" fontFamily="mono" fontWeight={600}>
                          {domainInfo.shortName}
                        </Text>
                      )}
                      <Text fontSize="2xs" fontFamily="mono" color="gray.400" fontWeight={700}>
                        QUESTION {i + 1}
                      </Text>
                    </HStack>
                    <HStack gap={2}>
                      {isFlagged && (
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

                  {/* Options review list */}
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
                            w="20px"
                            h="20px"
                            borderRadius="md"
                            border="1px solid"
                            borderColor={isUserAnswer ? 'brand.500' : 'border'}
                            bg={isUserAnswer ? 'brand.600' : 'transparent'}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                            color={isUserAnswer ? 'white' : 'gray.400'}
                            fontFamily="mono"
                            fontSize="2xs"
                            fontWeight={700}
                          >
                            {activeOptions[oi]}
                          </Box>
                          <Text fontSize="xs" color={isUserAnswer ? 'brand.700' : 'gray.600'} fontWeight={isUserAnswer ? 600 : 500} flex={1} lineHeight={1.4}>
                            {opt}
                          </Text>
                          {isUserAnswer && (
                            <Badge
                              size="sm"
                              bg="brand.600"
                              color="white"
                              borderRadius="md"
                              px={2}
                              py={0.5}
                              fontSize="3xs"
                              fontWeight={700}
                              fontFamily="mono"
                            >
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

      {/* Sticky Footer */}
      <Box
        borderTop="1px solid"
        borderColor="border"
        bg="bg.panel"
        position="sticky"
        bottom={0}
        zIndex={10}
      >
        <Container maxW="container.md" py={3.5}>
          <HStack justify="space-between" align="center" wrap="wrap" gap={3}>
            <Text fontSize="xs" color="gray.500" fontWeight={600} fontFamily="mono">
              Progress: {answeredCount} / {totalCount} Answered &bull; {unansweredCount} Remaining
            </Text>
            <HStack gap={3}>
              <Button
                size="md"
                variant="outline"
                borderColor="border"
                onClick={cancelReview}
                fontWeight={600}
              >
                Return to Simulator
              </Button>
              <Button
                size="md"
                bg="brand.600"
                color="white"
                fontWeight={700}
                _hover={{ bg: 'brand.700' }}
                onClick={() => setSubmitOpen(true)}
              >
                Submit Practice Exam
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <DialogRoot open={submitOpen} onOpenChange={(e) => setSubmitOpen(e.open)}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius="xl" border="1px solid" borderColor="border">
            <DialogHeader borderBottom="1px solid" borderColor="border" px={6} pt={5} pb={4}>
              <DialogTitle fontSize="md" fontWeight={700} color="brand.700">Submit simulator answers?</DialogTitle>
            </DialogHeader>
            <DialogBody px={6} py={5}>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to finalize your practice exam? You will not be able to return to modify any answers after this action.
                {unansweredCount > 0 && (
                  <Text as="span" color="orange.600" fontWeight={700} display="block" mt={2}>
                    🚨 WARNING: You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'} that will be marked incorrect.
                  </Text>
                )}
              </Text>
            </DialogBody>
            <DialogFooter borderTop="1px solid" borderColor="border" px={6} pt={4} pb={5} gap={3}>
              <Button variant="outline" size="sm" onClick={() => setSubmitOpen(false)} fontWeight={600}>
                Cancel
              </Button>
              <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={handleSubmit} fontWeight={700}>
                Submit Evaluation
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
