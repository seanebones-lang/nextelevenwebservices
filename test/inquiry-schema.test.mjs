import assert from 'node:assert/strict';
import test from 'node:test';
import { inquirySchema } from '../lib/inquiry-schema.ts';

const validInquiry = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  businessName: 'Example Company',
  website: 'https://example.com',
  industry: 'professional-services',
  projectType: 'foundation',
  currentPresence: 'dated',
  primaryGoal: 'leads',
  timeline: 'one-two-months',
  budget: '2500-7500',
  details: 'We need a clearer site and a reliable inquiry path.',
  companyWebsite: '',
};

test('accepts a valid customer inquiry', () => {
  assert.equal(inquirySchema.safeParse(validInquiry).success, true);
});

test('accepts a populated transport honeypot for quiet route handling', () => {
  assert.equal(
    inquirySchema.safeParse({
      ...validInquiry,
      companyWebsite: 'https://spam.example',
    }).success,
    true,
  );
});

test('rejects an underspecified customer inquiry', () => {
  assert.equal(
    inquirySchema.safeParse({ ...validInquiry, details: 'Too short' }).success,
    false,
  );
});
