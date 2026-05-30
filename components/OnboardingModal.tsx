'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const SVG_ICONS = {
  INFO: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  LIGHTBULB: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path>
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
    </svg>
  ),
  LAYERS: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 12 12 17 22 12"></polyline>
      <polyline points="2 17 12 22 22 17"></polyline>
    </svg>
  ),
  BOOK: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  PLAY: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  SMILE: (
    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  ),
};

const slides = [
  {
    title: 'About the Site',
    content: 'Welcome! This platform is designed to help you prepare and practice for your certification with the Claude Code Certification Foundationals.',
    icon: SVG_ICONS.INFO,
  },
  {
    title: 'Why We Built This',
    content: 'We built this to prepare you for the Claude Code Certification Foundationals, priming you to the actual exam experience.',
    icon: SVG_ICONS.LIGHTBULB,
  },
  {
    title: 'The Modes',
    content: 'Choose between different modes: Exam Mode, Review Mode, Zen Mode, or Focus Mode to tailor your practice experience.',
    icon: SVG_ICONS.LAYERS,
  },
  {
    title: 'The Sections',
    content: 'This exam follows the five domains such as Agentic Architecture & Orchestration, Tool Design & MCP Integration, Prompt Engineering & Structured Output, and more.',
    icon: SVG_ICONS.BOOK,
  },
  {
    title: 'Claude You Do It?',
    content: 'Ready to dive in? Choose a mode and start your practice session. All the best and good luck!',
    icon: SVG_ICONS.SMILE,
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [doNotShow, setDoNotShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (doNotShow) {
      localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
      // If user closes but didn't check "Do not show again", we can choose to show it again next time
      // But maybe we should default to false. I will just close it.
    }
    setIsOpen(false);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  if (!isMounted || !isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0,0,0,0.6)"
      zIndex="9999"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backdropFilter="blur(8px)"
      p={4}
    >
      <Box
        bg="bg.panel"
        w="100%"
        maxW="500px"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
        p={[6, 8]}
        position="relative"
      >
        {currentSlide < slides.length - 1 && (
          <Button
            position="absolute"
            top={4}
            right={4}
            variant="ghost"
            size="sm"
            px={0}
            minW={8}
            onClick={handleClose}
            color="gray.500"
            aria-label="Skip"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        )}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack gap={6} align="center" textAlign="center" minH="240px" justify="center">
              <Box color="brand.600" p={4} bg="brand.50" borderRadius="full">
                {slides[currentSlide].icon}
              </Box>
              <Heading size="lg" color="brand.800" fontWeight="bold">
                {slides[currentSlide].title}
              </Heading>
              <Text color="gray.600" fontSize="md" lineHeight="tall">
                {slides[currentSlide].content}
              </Text>
            </VStack>
          </motion.div>
        </AnimatePresence>

        <Flex justify="space-between" align="center" mt={8}>
          <HStack gap={2}>
            {slides.map((_, idx) => (
              <Box
                key={idx}
                w={idx === currentSlide ? '20px' : '8px'}
                h="8px"
                borderRadius="full"
                bg={idx === currentSlide ? 'brand.500' : 'gray.200'}
                transition="all 0.3s"
              />
            ))}
          </HStack>

          <HStack gap={3}>
            {currentSlide > 0 && (
              <Button variant="ghost" onClick={prevSlide} color="gray.500">
                Back
              </Button>
            )}
            {currentSlide < slides.length - 1 ? (
              <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} onClick={nextSlide}>
                Next
              </Button>
            ) : (
              <Button bg="accent.500" color="white" _hover={{ bg: 'accent.600' }} onClick={handleClose}>
                Get Started
              </Button>
            )}
          </HStack>
        </Flex>

        <Box mt={6} pt={4} borderTop="1px solid" borderColor="border">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#4A5568' }}>
            <input
              type="checkbox"
              checked={doNotShow}
              onChange={(e) => setDoNotShow(e.target.checked)}
              style={{ marginRight: '8px', width: '16px', height: '16px', accentColor: '#3182ce' }}
            />
            Do not show this again
          </label>
        </Box>
      </Box>
    </Box>
  );
}
