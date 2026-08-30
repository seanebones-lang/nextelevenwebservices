import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.email('Please enter a valid email.').max(180),
  businessName: z
    .string()
    .trim()
    .min(2, 'Please enter the business name.')
    .max(140),
  website: z.string().trim().max(240),
  industry: z.string().min(1, 'Choose the closest industry.'),
  projectType: z.string().min(1, 'Choose the kind of help you need.'),
  currentPresence: z.string().min(1, 'Tell us what exists today.'),
  primaryGoal: z.string().min(1, 'Choose the primary goal.'),
  timeline: z.string().min(1, 'Choose an expected timeline.'),
  budget: z.string().min(1, 'Choose an investment range.'),
  details: z
    .string()
    .trim()
    .min(20, 'A little more context will help us prepare.')
    .max(2000),
  // Transport-level honeypot. The route quietly discards populated values;
  // accepting the value here keeps that behavior indistinguishable to bots.
  companyWebsite: z.string().max(240),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
