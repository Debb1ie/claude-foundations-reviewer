'use client';
import { DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT, DOMAINS, type Domain } from '@/types/exam';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useExamStore } from '@/hooks/useExamState';
import { useAdvancedExamStore } from '@/hooks/useAdvancedExamState';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import React from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } }
};

const SVG_ICONS = {
  CLOCK: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  BOOK: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  TARGET: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  STAR: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
};
const MODES = [
  {
    id: 'review' as const,
    title: 'Review Mode',
    description: 'Untimed, full feedback after each question. Learn as you go.',
    icon: 'BOOK' as const,
    features: ['Untimed', 'Show answers & explanations', 'Learn progressively', 'All questions visible'],
    cta: 'Start Reviewing',
  },
  {
    id: 'exam' as const,
    title: 'Exam Mode',
    description: '60 questions, no explanations during the test. Randomized each attempt.',
    icon: 'CLOCK' as const,
    features: ['Randomized order', 'No feedback until end', 'Full results summary', 'Progress tracking'],
    cta: 'Begin Exam',
  },
];

interface ModeSelectorProps {
  onStart: (mode: 'exam' | 'review' | 'zen' | 'focus', domain?: Domain) => void;
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = React.useState<'exam' | 'review' | 'zen' | 'focus' | null>(null);
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);
  const [examTimed, setExamTimed] = React.useState<boolean>(true);

  return (
    <Box bg="transparent" minH="100vh">
      <Container maxW="container.lg" py={[8, 12]}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <VStack gap={[8, 10]} align="stretch">
            <motion.div variants={itemVariants}>
              <Box textAlign="center" maxW="2xl" mx="auto">
                <Heading as="h2" size="3xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                  Claude you Ace?
                </Heading>
                <Text color="gray.600" fontSize="lg" lineHeight="tall">
                  Select your practice mode below to begin studying for the Claude Certified Architect Foundations exam.
                </Text>
              </Box>
            </motion.div>

            {/* Grid of modes */}
            <SimpleGrid columns={[1, 2, 4]} gap={5}>
              {/* Review Resources card — links to /sources */}
              <motion.div
                key="review-resources"
                variants={itemVariants}
                style={{ display: 'flex', width: '100%' }}
              >
                <Link
                  as={NextLink}
                  href="/sources"
                  w="100%"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px 0 rgba(33, 150, 243, 0.12)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg="rgba(33, 150, 243, 0.08)"
                        border="1px solid"
                        borderColor="rgba(33, 150, 243, 0.16)"
                        color="brand.600"
                        transition="all 0.2s"
                        _dark={{
                          bg: 'rgba(124, 110, 250, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          color: 'brand.300'
                        }}
                      >
                        {SVG_ICONS.BOOK}
                      </Box>
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        Review Resources
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        Access curated study materials, official docs, and community guides.
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                      {['Official study guides', 'API documentation', 'Community resources', 'Exam tips & strategy'].map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.500" />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Button
                      mt="auto"
                      w="100%"
                      size="sm"
                      bg="brand.600"
                      color="white"
                      fontWeight={700}
                      borderRadius="lg"
                      _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(33,150,243,0.35)' }}
                      transition="all 0.2s"
                    >
                      Browse Resources
                    </Button>
                  </VStack>
                </Link>
              </motion.div>

              {MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <motion.div
                    key={mode.id}
                    variants={itemVariants}
                    style={{ display: 'flex', width: '100%' }}
                  >
                    <Box
                      onClick={() => {
                        setSelectedMode(mode.id);
                        setSelectedDomain(null);
                      }}
                      cursor="pointer"
                      border="2px solid"
                      borderColor={isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.35)'}
                      bg={isSelected ? 'rgba(33, 150, 243, 0.06)' : 'rgba(255, 255, 255, 0.45)'}
                      backdropFilter="blur(12px)"
                      _dark={{
                        bg: isSelected ? 'rgba(124, 110, 250, 0.1)' : 'rgba(30, 41, 59, 0.45)',
                        borderColor: isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.08)'
                      }}
                      borderRadius="xl"
                      p={5}
                      textAlign="left"
                      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                      boxShadow={isSelected ? '0 10px 25px -5px rgba(33,150,243,0.15)' : '0 8px 32px 0 rgba(31, 38, 135, 0.03)'}
                      _hover={{
                        borderColor: isSelected ? 'brand.500' : 'brand.300',
                        bg: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'rgba(255, 255, 255, 0.65)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px 0 rgba(33, 150, 243, 0.12)'
                      }}
                      display="flex"
                      flexDirection="column"
                      alignItems="stretch"
                      w="100%"
                    >
                      <VStack gap={4} align="stretch" h="100%">
                        <HStack justify="space-between" align="center">
                          <Box
                            p={2.5}
                            borderRadius="lg"
                            bg={isSelected ? 'brand.600' : 'rgba(33, 150, 243, 0.08)'}
                            border={isSelected ? 'none' : '1px solid'}
                            borderColor={isSelected ? 'transparent' : 'rgba(33, 150, 243, 0.16)'}
                            color={isSelected ? 'white' : 'brand.600'}
                            transition="all 0.2s"
                            _dark={isSelected ? {} : {
                              bg: 'rgba(124, 110, 250, 0.15)',
                              borderColor: 'rgba(255, 255, 255, 0.12)',
                              color: 'brand.300'
                            }}
                          >
                            {SVG_ICONS[mode.icon]}
                          </Box>
                          {isSelected && (
                            <Badge bg="brand.100" color="brand.700" size="sm" borderRadius="full" px={2.5}>
                              Selected
                            </Badge>
                          )}
                        </HStack>

                        <Box>
                          <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                            {mode.title}
                          </Heading>
                          <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                            {mode.description}
                          </Text>
                        </Box>

                        <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                          {mode.features.map((f) => (
                            <HStack key={f} gap={2} align="center">
                              <Box w={1.5} h={1.5} borderRadius="full" bg={isSelected ? 'accent.500' : 'brand.300'} />
                              <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                            </HStack>
                          ))}
                        </VStack>

                        <VStack gap={2} align="stretch" mt="auto">
                          {mode.id === 'review' ? (
                            <VStack mt={2} gap={2} align="stretch">
                              <Button
                                w="100%"
                                size="sm"
                                bg={isSelected ? 'brand.600' : 'brand.500'}
                                color="white"
                                fontWeight={700}
                                borderRadius="lg"
                                _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(33,150,243,0.35)' }}
                                transition="all 0.2s"
                                whiteSpace="nowrap"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStart(mode.id);
                                }}
                              >
                                Standard Practice
                              </Button>
                              <Button
                                size="sm"
                                bg={isSelected ? 'brand.600' : 'brand.500'}
                                color="white"
                                fontWeight={700}
                                borderRadius="lg"
                                _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(33,150,243,0.35)' }}
                                transition="all 0.2s"
                                whiteSpace="nowrap"
                                flexShrink={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMode(selectedMode === 'focus' ? null : 'focus');
                                }}
                              >
                                Focus Mode
                              </Button>
                            </VStack>
                          ) : (
                            <>
                              {/* Timer toggle for Exam Mode */}
                              <Box
                                mt={2}
                                p={3}
                                borderRadius="lg"
                                bg="rgba(33, 150, 243, 0.04)"
                                border="1px solid"
                                borderColor="rgba(33, 150, 243, 0.12)"
                                _dark={{ bg: 'rgba(124, 110, 250, 0.08)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                              >
                                <Text fontSize="2xs" fontWeight={700} color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                                  Timer
                                </Text>
                                <HStack gap={1.5} w="100%">
                                  <Box
                                    as="button"
                                    flex={1}
                                    py={1.5}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight={700}
                                    border="1.5px solid"
                                    borderColor={examTimed ? 'brand.500' : 'rgba(33, 150, 243, 0.16)'}
                                    bg={examTimed ? 'brand.600' : 'transparent'}
                                    color={examTimed ? 'white' : 'gray.500'}
                                    transition="all 0.18s"
                                    _hover={{ borderColor: 'brand.400' }}
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setExamTimed(true); }}
                                  >
                                    Timed · 2h
                                  </Box>
                                  <Box
                                    as="button"
                                    flex={1}
                                    py={1.5}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight={700}
                                    border="1.5px solid"
                                    borderColor={!examTimed ? 'brand.500' : 'rgba(33, 150, 243, 0.16)'}
                                    bg={!examTimed ? 'brand.600' : 'transparent'}
                                    color={!examTimed ? 'white' : 'gray.500'}
                                    transition="all 0.18s"
                                    _hover={{ borderColor: 'brand.400' }}
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setExamTimed(false); }}
                                  >
                                    No Timer
                                  </Box>
                                </HStack>
                              </Box>
                              <Button
                                mt={2}
                                w="100%"
                                size="sm"
                                bg={isSelected ? 'brand.600' : 'brand.500'}
                                color="white"
                                fontWeight={700}
                                borderRadius="lg"
                                _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(33,150,243,0.35)' }}
                                transition="all 0.2s"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStart(examTimed ? 'exam' : 'zen');
                                }}
                              >
                                {examTimed ? 'Begin Timed Exam' : 'Begin Without Timer'}
                              </Button>
                            </>
                          )}
                        </VStack>
                      </VStack>
                    </Box>
                  </motion.div>
                );
              })}

              {/* Advanced Practice card */}
              <motion.div
                key="advanced-practice"
                variants={itemVariants}
                style={{ display: 'flex', width: '100%' }}
              >
                <Box
                  w="100%"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px 0 rgba(33, 150, 243, 0.12)',
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg="rgba(33, 150, 243, 0.08)"
                        border="1px solid"
                        borderColor="rgba(33, 150, 243, 0.16)"
                        color="brand.600"
                        transition="all 0.2s"
                        _dark={{
                          bg: 'rgba(124, 110, 250, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          color: 'brand.300'
                        }}
                      >
                        {SVG_ICONS.STAR}
                      </Box>
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        Advanced Practice
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        60 challenging questions across all domains. Push your limits.
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                      {['60 advanced questions', 'All 5 domains', 'Harder scenarios', 'Detailed explanations'].map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.500" />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack mt="auto" gap={2} align="stretch">
                      <Button
                        w="100%"
                        size="sm"
                        bg="brand.600"
                        color="white"
                        fontWeight={700}
                        borderRadius="lg"
                        _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(33,150,243,0.35)' }}
                        transition="all 0.2s"
                        onClick={() => {
                          useAdvancedExamStore.getState().start();
                          router.push('/advanced');
                        }}
                      >
                        Start Advanced Practice
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </motion.div>
            </SimpleGrid>

            {/* Domain selector for Focus Mode */}
            <AnimatePresence mode="wait">
              {selectedMode === 'focus' && (
                <motion.div
                  key="focus-domain-selector"
                  initial={{ opacity: 0, height: 0, scale: 0.98 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', width: '100%' }}
                >
                  <Box
                    mt={4}
                    p={[4, 6]}
                    bg="rgba(255, 255, 255, 0.45)"
                    backdropFilter="blur(16px)"
                    _dark={{
                      bg: "rgba(15, 23, 42, 0.45)",
                      borderColor: "rgba(255, 255, 255, 0.08)"
                    }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.3)"
                    boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  >
                    <Text fontSize="sm" fontWeight={700} color="brand.700" mb={4}>
                      Select Practice Domain
                    </Text>
                    <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
                      {DOMAINS.map((d) => {
                        const isDomainSelected = selectedDomain === d.id;
                        return (
                          <Box
                            key={d.id}
                            display="flex"
                            flexDirection="column"
                            alignItems="stretch"
                            p={4}
                            borderRadius="lg"
                            border="2px solid"
                            borderColor={isDomainSelected ? d.color : 'rgba(255, 255, 255, 0.35)'}
                            bg={isDomainSelected ? `${d.color}15` : 'rgba(255, 255, 255, 0.35)'}
                            backdropFilter="blur(8px)"
                            _dark={{
                              bg: isDomainSelected ? `${d.color}20` : 'rgba(30, 41, 59, 0.3)',
                              borderColor: isDomainSelected ? d.color : 'rgba(255, 255, 255, 0.06)'
                            }}
                            _hover={{
                              borderColor: isDomainSelected ? d.color : 'brand.400',
                              bg: isDomainSelected ? `${d.color}20` : 'rgba(255, 255, 255, 0.55)',
                              transform: 'translateY(-2px)'
                            }}
                            onClick={() => setSelectedDomain(d.id === selectedDomain ? null : d.id)}
                            transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                            textAlign="left"
                            cursor="pointer"
                            w="100%"
                          >
                            <HStack justify="space-between" w="100%" mb={3}>
                              <Badge
                                bg={DOMAIN_SOLID_BGS[d.id]}
                                color={DOMAIN_SOLID_TEXT[d.id]}
                                border="none"
                                px={2.5}
                                py={0.5}
                                borderRadius="md"
                                fontSize="2xs"
                                fontFamily="mono"
                                fontWeight={700}
                              >
                                {d.id}
                              </Badge>
                              <Text fontSize="2xs" fontFamily="mono" fontWeight={700} color="gray.500" _dark={{ color: 'gray.400' }}>
                                {d.weight}% Weight
                              </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight={700} color="brand.700" mb={1}>
                              {d.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mb={isDomainSelected ? 3 : 0}>
                              {d.shortName} deep dive
                            </Text>
                            {isDomainSelected && (
                              <Button
                                mt="auto"
                                w="100%"
                                size="sm"
                                bg="brand.600"
                                color="white"
                                fontWeight={700}
                                _hover={{ bg: 'brand.700' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStart('focus', d.id);
                                }}
                              >
                                Start Focus Practice
                              </Button>
                            )}
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <Box mt={4} p={5} bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(12px)" _dark={{ bg: "rgba(30, 41, 59, 0.45)", borderColor: "rgba(255, 255, 255, 0.08)" }} border="1px solid" borderColor="rgba(255, 255, 255, 0.35)" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" textAlign="justify" lineHeight="tall">
                  <strong>Disclaimer:</strong> This Claude Certified Architect Reviewer is an independent educational initiative created by Kenshin Juanico &amp; Precious Manucom from the DEVCON Jumpstart AI Engineering Interns based on public resources, Reddit community reviews, and official study guides. It is not affiliated with, endorsed by, or connected to Anthropic PBC or Skilljar, and it strictly adheres to non-disclosure policies by not reproducing actual live exam questions. Because AI technologies and certification requirements evolve rapidly, this material is intended solely for preparatory study and does not guarantee exam success; users must always verify the latest exam domains, updates, and training modules directly by visiting the official portal at <Link href="https://anthropic.skilljar.com/" target="_blank" rel="noopener noreferrer" color="brand.500" textDecoration="underline">https://anthropic.skilljar.com/</Link>.
                </Text>
              </Box>
            </motion.div>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}
