/**
 * @file course-completion-upsell.tsx — sent after a student finishes a course
 */
/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'SoloSuccess Academy'
const SITE_URL = 'https://solosuccessacademy.cloud'

interface Props {
  studentName?: string
  completedCourseTitle?: string
  nextCourseTitle?: string
  nextCourseUrl?: string
  testimonialUrl?: string
}

const Upsell = ({
  studentName,
  completedCourseTitle = 'your course',
  nextCourseTitle,
  nextCourseUrl = `${SITE_URL}/courses`,
  testimonialUrl = `${SITE_URL}/profile?testimonial=1`,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You finished {completedCourseTitle} 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}><Text style={logoText}>🚀 SOLOSUCCESS ACADEMY</Text></Section>
        <Heading style={h1}>{studentName ? `${studentName}, you did it.` : 'You did it.'}</Heading>
        <Text style={text}>
          You completed <strong>{completedCourseTitle}</strong>. That's a real
          milestone — most people stall before they finish anything.
        </Text>
        {nextCourseTitle ? (
          <>
            <Text style={text}>
              Ready for what's next? <strong>{nextCourseTitle}</strong> picks
              up exactly where you left off.
            </Text>
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button style={cta} href={nextCourseUrl}>Start {nextCourseTitle} →</Button>
            </Section>
          </>
        ) : (
          <>
            <Text style={text}>
              You've now finished every course in the academy. Genuinely — well done.
            </Text>
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button style={cta} href={nextCourseUrl}>Visit your dashboard →</Button>
            </Section>
          </>
        )}
        <Hr style={divider} />
        <Text style={smallText}>
          One favor: if this helped, would you{' '}
          <a href={testimonialUrl} style={link}>share a quick testimonial</a>?
          It helps the next solo founder decide.
        </Text>
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Upsell,
  subject: (data: Record<string, any>) =>
    data?.completedCourseTitle
      ? `You finished ${data.completedCourseTitle} 🎉`
      : 'You finished the course 🎉',
  displayName: 'Course completion: re-engagement',
  previewData: {
    studentName: 'Jordan',
    completedCourseTitle: 'Course 01 — Mindset & Foundations',
    nextCourseTitle: 'Course 02 — Niche & Offer',
    nextCourseUrl: `${SITE_URL}/courses`,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica', sans-serif" }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const header = { textAlign: 'center' as const, marginBottom: '24px' }
const logoText = { fontSize: '14px', fontWeight: 'bold' as const, letterSpacing: '3px', color: 'hsl(190, 95%, 45%)', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: 'hsl(220, 30%, 15%)', margin: '0 0 16px' }
const text = { fontSize: '15px', color: 'hsl(220, 10%, 35%)', lineHeight: '1.6', margin: '0 0 16px' }
const cta = { backgroundColor: 'hsl(190, 95%, 45%)', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold' as const, fontSize: '15px', textDecoration: 'none', display: 'inline-block' as const }
const divider = { borderColor: 'hsl(220, 15%, 88%)', margin: '24px 0' }
const smallText = { fontSize: '13px', color: 'hsl(220, 10%, 50%)', lineHeight: '1.6', margin: '0 0 12px' }
const link = { color: 'hsl(190, 95%, 45%)', textDecoration: 'underline' }
const footer = { fontSize: '13px', color: 'hsl(220, 10%, 55%)', margin: '0', lineHeight: '1.5' }