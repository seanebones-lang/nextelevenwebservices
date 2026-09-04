'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ArrowRight,
  ArrowLeft,
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
    ['foundation', 'A custom web foundation'],
    ['full-vertical', 'A connected custom build'],
    ['commerce', 'A custom product-selling environment'],
    ['virtual-assistant', 'A virtual assistant or intelligent workflow'],
    ['operate', 'Operate, hosting, or ongoing care'],
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
    ['under-1000', 'Under $1,000'],
    ['1000-2500', '$1,000–$2,500'],
    ['2500-7500', '$2,500–$7,500'],
    ['7500-15000', '$7,500–$15,000'],
    ['15000-plus', '$15,000+'],
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

const stepFields: Array<Array<keyof InquiryInput>> = [
  ['projectType', 'currentPresence', 'primaryGoal'],
  ['industry', 'timeline', 'budget', 'details'],
  ['name', 'businessName', 'email', 'website'],
];

type SelectName =
  | 'industry'
  | 'projectType'
  | 'currentPresence'
  | 'primaryGoal'
  | 'timeline'
  | 'budget';

export function InquiryForm() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{
    reference: string;
    replyBy?: string;
    deliveryPending: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState('');
  const {
    control,
    register,
    handleSubmit,
    reset,
    trigger,
    getFieldState,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: defaults,
  });

  async function advance() {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) {
      setServerError('');
      setStep((current) => Math.min(current + 1, stepFields.length - 1));
      return;
    }

    const firstInvalid = stepFields[step].find(
      (fieldName) => getFieldState(fieldName).invalid,
    );
    if (firstInvalid) setFocus(firstInvalid);
  }

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
        deliveryPending?: boolean;
      };
      if (!response.ok || !body.ok) {
        throw new Error(body.message || 'We could not save your inquiry.');
      }
      const replyDate = new Date();
      let businessDays = 0;
      while (businessDays < 2) {
        replyDate.setDate(replyDate.getDate() + 1);
        if (replyDate.getDay() !== 0 && replyDate.getDay() !== 6) {
          businessDays += 1;
        }
      }
      setResult({
        reference: body.reference || 'RECEIVED',
        deliveryPending: Boolean(body.deliveryPending),
        replyBy: body.deliveryPending
          ? undefined
          : new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }).format(replyDate),
      });
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
                ref={field.ref}
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
        <h3>
          {result.deliveryPending
            ? 'Your brief is saved.'
            : 'Your project brief was accepted by the site.'}
        </h3>
        {result.deliveryPending ? (
          <p>
            Delivery to our inbox is still pending. Please email your reference
            to{' '}
            <a href="mailto:nextelevenstudios@gmail.com">
              nextelevenstudios@gmail.com
            </a>{' '}
            so we can confirm receipt.
          </p>
        ) : (
          <p>
            Keep the reference shown above until receipt is confirmed.
            NextEleven aims to send a written reply by {result.replyBy} after
            confirmed receipt.
          </p>
        )}
        <Button
          variant="outline"
          onClick={() => {
            setStep(0);
            setResult(null);
          }}
          className="reset-brief"
        >
          <RotateCcw /> Send another inquiry
        </Button>
      </output>
    );
  }

  return (
    <form
      onSubmit={
        step === stepFields.length - 1
          ? handleSubmit(submit)
          : (event) => {
              event.preventDefault();
              void advance();
            }
      }
      className="inquiry-form"
      noValidate
    >
      <input
        {...register('companyWebsite')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div
        className="brief-progress"
        aria-label={`Project brief step ${step + 1} of 3`}
      >
        <div>
          <span>{String(step + 1).padStart(2, '0')} / 03</span>
          <strong>
            {step === 0 && 'The project'}
            {step === 1 && 'The reality'}
            {step === 2 && 'Where to reply'}
          </strong>
        </div>
        <div className="brief-progress-rail" aria-hidden="true">
          <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      </div>

      <div key={step} className="brief-step-panel">
        {step === 0 && (
          <>
            <div className="form-step">
              <span>01</span>
              <p>Choose the closest answer. We will refine it together.</p>
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
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="form-step">
              <span>02</span>
              <p>
                Give us the constraints that shape the right recommendation.
              </p>
            </div>
            <div className="form-grid">
              {renderSelect('industry', 'Industry', 'Choose the closest fit')}
              {renderSelect('timeline', 'Expected timing', 'Choose a timeline')}
              {renderSelect('budget', 'Expected investment', 'Choose a range')}
            </div>
            <Field
              className="brief-context"
              data-invalid={Boolean(errors.details)}
            >
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
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-step">
              <span>03</span>
              <p>Tell us where to send the useful written response.</p>
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
            </div>
          </>
        )}
      </div>

      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-submit-row">
        {step === 0 ? (
          <p>
            Your answers are used to evaluate and respond to this inquiry. Do
            not include passwords, API keys, payment-card information,
            financial-account credentials, protected health information,
            government identification, or other sensitive records.
          </p>
        ) : (
          <button
            type="button"
            className="brief-back"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            <ArrowLeft aria-hidden="true" /> Back
          </button>
        )}
        <Button type="submit" disabled={isSubmitting} className="brief-submit">
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" /> Saving inquiry
            </>
          ) : step < stepFields.length - 1 ? (
            <>
              Continue <ArrowRight />
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
