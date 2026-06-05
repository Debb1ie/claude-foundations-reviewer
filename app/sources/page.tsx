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

const ESSENTIALS = [
  {
    title: 'Learn Anthropic (Skilljar)',
    description: 'Official Anthropic learning resources covering Claude, AI safety, and best practices for building with large language models.',
    url: 'https://www.anthropic.com/learn?utm_medium=email&_hsenc=p2ANqtz-_xGekKxgckZqetoQto6lym2CfPCtsCUv3DDl_tMpLZ_42hFizoqJAhw9r0SApy2OS5rI20CBH18IPSJ8CBQ_1Sl86lbQ&_hsmi=418799463&utm_content=418799463&utm_source=hs_email',
    category: 'Essentials'
  },
  {
    title: 'Claude Partner Network Learning Path',
    description: 'The official Skilljar learning path for the Claude Partner Network program — essential for partners completing certification requirements.',
    url: 'https://anthropic.skilljar.com/page/claude-partner-network-learning-path?utm_medium=email&_hsenc=p2ANqtz-8ooqRbsR8aHL8cY4lW6UwDzIQ_G50cZmQeXBmMehnpfu-IyT6kJDD690d1I0IavYUb9NwuICvQpJY8W23Df5o7RC2WQQ&_hsmi=418799463&utm_content=418799463&utm_source=hs_email',
    category: 'Essentials'
  },
  {
    title: 'Introduction to Model Context Protocol',
    description: 'A dedicated Skilljar course on MCP — understanding protocol specifications, transport selection, and building custom integrations.',
    url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol',
    category: 'Essentials'
  },
];

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

          <Box>
            <Heading as="h3" size="lg" fontWeight={700} color="brand.700" mb={5}>
              Essentials for Claude Partner Networks
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {ESSENTIALS.map((source, idx) => (
                <Link
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={6}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.1)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
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
                </Link>
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading as="h3" size="lg" fontWeight={700} color="brand.700" mb={5}>
              Other Links
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {SOURCES.map((source, idx) => (
                <Link
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={6}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.1)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
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
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
