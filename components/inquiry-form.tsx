'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { inquirySchema, type InquiryInput } from '@/lib/inquiry-schema';

const options = {
  industry: [
    ['professional-services', 'Professional services'],
    ['home-trades', 'Home services or skilled trades'],
    ['automotive', 'Automotive'],
    ['health-wellness', 'Health or wellness'],
    ['retail-hospitality', 'Retail or hospitality'],
    ['industrial-b2b', 'Industrial or B2B'],
    ['other', 'Something else'],
  ],
  projectType: [
    ['discovery', 'Discovery and strategic definition'],
    ['foundation', 'A premium web foundation'],
    ['full-vertical', 'A full vertical custom build'],
    ['commerce', 'A custom product-selling environment'],
    ['virtual-assistant', 'A virtual assistant or intelligent workflow'],
    ['not-sure', 'I need help choosing the right depth'],
  ],
  currentPresence: [
    ['none', 'No website yet'],
    ['social-only', 'Mostly social profiles'],
    ['basic', 'A basic or DIY site'],
    ['dated', 'An established but dated site'],
    ['working', 'A working site that needs to perform better'],
  ],
  primaryGoal: [
    ['credibility', 'Build credibility and trust'],
    ['leads', 'Generate qualified inquiries'],
    ['bookings-sales', 'Increase bookings or sales'],
    ['sell-products', 'Sell products in a custom environment'],
    ['intelligent-assistance', 'Add intelligent customer assistance'],
    ['inventory', 'Connect customer experience to inventory'],
    ['operations', 'Route communication and operating workflows'],
    ['clarity', 'Explain the business more clearly'],
    ['modernize', 'Modernize an outdated presence'],
  ],
  timeline: [
    ['soon', 'As soon as responsibly possible'],
    ['one-two-months', 'Within 1–2 months'],
    ['three-months', 'Within 3 months'],
    ['exploring', 'I am still exploring'],
  ],
  budget: [
    ['defining', 'I need help defining the investment'],
    ['5000-10000', '$5,000–$10,000'],
    ['10000-25000', '$10,000–$25,000'],
    ['25000-50000', '$25,000–$50,000'],
    ['50000-plus', '$50,000+'],
  ],
} as const;

const defaults: InquiryInput = {
  name: '',
  email: '',
  businessName: '',
  website: '',
  industry: '',
  projectType: '',
  currentPresence: '',
  primaryGoal: '',
  timeline: '',
  budget: '',
  details: '',
  companyWebsite: '',
};

type SelectName =
  | 'industry'
  | 'projectType'
  | 'currentPresence'
  | 'primaryGoal'
  | 'timeline'
  | 'budget';

export function InquiryForm() {
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState('');
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: defaults,
  });

  async function submit(values: InquiryInput) {
    setServerError('');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = (await response.json()) as {
        ok: boolean;
        reference?: string;
        message?: string;
      };
      if (!response.ok || !body.ok) {
        throw new Error(body.message || 'We could not save your inquiry.');
      }
      setResult({ reference: body.reference || 'RECEIVED' });
      reset(defaults);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'We could not save your inquiry.',
      );
    }
  }

  function renderSelect(name: SelectName, label: string, placeholder: string) {
    return (
      <Field data-invalid={Boolean(errors[name])}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={name}
                className="form-control w-full"
                aria-invalid={Boolean(errors[name])}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent
                align="start"
                className="rounded-xl bg-paper text-ink"
              >
                {options[name].map(([value, text]) => (
                  <SelectItem key={value} value={value} className="py-2.5">
                    {text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors[name]?.message}</FieldError>
      </Field>
    );
  }

  if (result) {
    return (
      <output className="form-success" aria-live="polite">
        <CheckCircle2 />
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
          Inquiry received / {result.reference}
        </p>
        <h3>Thank you. We have a useful place to begin.</h3>
        <p>
          We’ll review the business, the existing presence, and what you want to
          change before responding.
        </p>
        <Button
          variant="outline"
          onClick={() => setResult(null)}
          className="mt-4 h-11 w-fit rounded-full border-white/25 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
        >
          <RotateCcw /> Send another inquiry
        </Button>
      </output>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="inquiry-form" noValidate>
      <input
        {...register('companyWebsite')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-step">
        <span>01</span>
        <p>About you</p>
      </div>
      <div className="form-grid">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="name">Your name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Smith"
            className="form-control"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">Work email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@business.com"
            className="form-control"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.businessName)}>
          <FieldLabel htmlFor="businessName">Business name</FieldLabel>
          <Input
            id="businessName"
            autoComplete="organization"
            placeholder="Your business"
            className="form-control"
            aria-invalid={Boolean(errors.businessName)}
            {...register('businessName')}
          />
          <FieldError>{errors.businessName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="website">
            Current website{' '}
            <span className="font-normal text-white/40">Optional</span>
          </FieldLabel>
          <Input
            id="website"
            inputMode="url"
            placeholder="yourbusiness.com"
            className="form-control"
            {...register('website')}
          />
        </Field>
        {renderSelect('industry', 'Industry', 'Choose the closest fit')}
      </div>

      <div className="form-step">
        <span>02</span>
        <p>What needs to change</p>
      </div>
      <div className="form-grid">
        {renderSelect(
          'projectType',
          'What kind of engagement?',
          'Choose the closest fit',
        )}
        {renderSelect(
          'currentPresence',
          'What exists today?',
          'Choose the current state',
        )}
        {renderSelect(
          'primaryGoal',
          'What matters most?',
          'Choose the primary goal',
        )}
        {renderSelect('timeline', 'Expected timing', 'Choose a timeline')}
        {renderSelect('budget', 'Expected investment', 'Choose a range')}
      </div>

      <div className="form-step">
        <span>03</span>
        <p>The useful context</p>
      </div>
      <Field data-invalid={Boolean(errors.details)}>
        <FieldLabel htmlFor="details">
          What should we understand before we talk?
        </FieldLabel>
        <Textarea
          id="details"
          rows={5}
          placeholder="What is working, what is not, and what would a successful result change for the business?"
          className="form-control min-h-36 resize-y py-4"
          aria-invalid={Boolean(errors.details)}
          {...register('details')}
        />
        <FieldError>{errors.details?.message}</FieldError>
      </Field>

      {serverError && (
        <p
          className="rounded-xl bg-white/10 p-4 text-sm text-white/70"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-white/45">
          Your answers are used only to evaluate and respond to this inquiry.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 rounded-full bg-white px-7 text-base text-black hover:bg-white/80"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" /> Saving inquiry
            </>
          ) : (
            <>
              Send project brief <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
