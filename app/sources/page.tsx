'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const SOURCES = [
  {
    title: 'Claude Certified Architect – Foundations Exam Guide',
    description: 'The official comprehensive PDF guide detailing the scope, format, and topics covered in the CCA-F certification exam.',
    url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F8lsy243ftffjjy1cx9lm3o2bw%2Fpublic%2F1773274827%2FClaude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf',
    category: 'Official Docs'
  },
  {
    title: 'Official Claude API Documentation',
    description: 'Comprehensive documentation on how to integrate and build with the Claude API.',
    url: 'https://docs.anthropic.com/en/api/getting-started',
    category: 'Official Docs'
  },
  {
    title: 'Learn Anthropic (Skilljar)',
    description: 'Anthropic\'s official learning platform containing courses and modules to help you master Claude.',
    url: 'https://learn.anthropic.com/',
    category: 'Courses'
  },
  {
    title: 'Prompt Engineering Guide',
    description: 'Best practices, techniques, and strategies for writing effective prompts for Claude.',
    url: 'https://docs.anthropic.com/en/docs/prompt-engineering',
    category: 'Guides'
  },
  {
    title: 'Anthropic Educational Courses (GitHub)',
    description: 'Open-source educational materials, notebooks, and examples provided by Anthropic.',
    url: 'https://github.com/anthropics/courses',
    category: 'Courses'
  },
  {
    title: 'Anthropic Cookbook',
    description: 'A collection of recipes and code examples for building with Claude.',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    category: 'Code Examples'
  },
  {
    title: 'Claude System Prompts',
    description: 'Documentation on system prompts and how to effectively steer Claude\'s behavior.',
    url: 'https://docs.anthropic.com/en/docs/system-prompts',
    category: 'Guides'
  },
  {
    title: 'Claude Certifications Exam Guide (Unofficial)',
    description: 'An unofficial guide to help you prepare for the Claude Certified Architect certification.',
    url: 'https://claudecertifications.com/claude-certified-architect/exam-guide',
    category: 'Community Resources'
  }
];

export default function SourcesPage() {
  return (
    <Box bg="transparent" minH="100vh">
      {/* Top Header/Navigation Bar */}
      <Box borderBottom="1px solid" borderColor="border" bg="bg.panel" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.lg" py={4}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Heading as="h1" size="md" fontWeight={600} color="brand.700">
                Claude Certified Architect Exam Simulator
              </Heading>
            </HStack>
            <HStack gap={4}>
              <NextLink href="/home" passHref>
                <Link fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }}>
                  Back to Simulator
                </Link>
              </NextLink>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={[8, 12]}>
        <VStack gap={[8, 10]} align="stretch">
          <Box textAlign="center" maxW="2xl" mx="auto">
            <Heading as="h2" size="3xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
              Study Resources
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              A curated collection of official documentation, guides, and courses to help you prepare for the Claude Certified Architect Foundations exam.
            </Text>
          </Box>

          <SimpleGrid columns={[1, 1, 2]} gap={6}>
            {SOURCES.map((source, idx) => (
              <Box
                key={idx}
                as="a"
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                border="2px solid"
                borderColor="border"
                bg="bg.panel"
                borderRadius="xl"
                p={6}
                transition="all 0.2s ease-in-out"
                boxShadow="0 2px 10px rgba(0,0,0,0.02)"
                _hover={{ borderColor: 'brand.400', transform: 'translateY(-2px)', boxShadow: '0 10px 25px -5px rgba(57,73,171,0.15)' }}
                display="flex"
                flexDirection="column"
              >
                <HStack justify="space-between" mb={3}>
                  <Box
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    bg="brand.100"
                    color="brand.700"
                    fontSize="xs"
                    fontWeight={700}
                    fontFamily="mono"
                  >
                    {source.category}
                  </Box>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-gray-400)">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </HStack>
                
                <Heading as="h3" size="md" fontWeight={700} color="brand.700" mb={2}>
                  {source.title}
                </Heading>
                <Text fontSize="sm" color="gray.600" lineHeight={1.6} flex={1}>
                  {source.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
