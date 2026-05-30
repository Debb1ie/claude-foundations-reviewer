'use client';
import React from 'react';
import NextLink from 'next/link';
import { Box, Container, HStack, Heading, Link } from '@chakra-ui/react';

export function Header({ variant = 'home' }: { variant?: 'home' | 'subpage' }) {
  return (
    <Box borderBottom="1px solid" borderColor="border" bg="bg.panel" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.lg" py={4}>
        <HStack justify="space-between">
          <HStack gap={3}>
            <NextLink href="/home" passHref legacyBehavior>
              <Link _hover={{ textDecoration: 'none' }}>
                <Heading as="h1" size="md" fontWeight={600} color="brand.700">
                  Claude Certified Architect Exam Simulator
                </Heading>
              </Link>
            </NextLink>
          </HStack>
          <HStack gap={4}>
            {variant === 'home' ? (
              <>
                <NextLink href="/overview" passHref legacyBehavior>
                  <Link fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }}>
                    Exam Overview
                  </Link>
                </NextLink>
                <NextLink href="/sources" passHref legacyBehavior>
                  <Link fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }}>
                    Study Resources
                  </Link>
                </NextLink>
              </>
            ) : (
              <NextLink href="/" passHref legacyBehavior>
                <Link fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }}>
                  Back to Simulator
                </Link>
              </NextLink>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
