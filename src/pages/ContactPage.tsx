import { useMutation } from '@tanstack/react-query'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Textarea } from '../components/ui/Textarea'
import { siteConfig } from '../constants/site'
import { submitContactMessage } from '../services/contactService'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  message: z.string().min(10, 'Tell us a bit more about your request'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const infoCards = [
  { icon: Phone, label: 'Phone', value: siteConfig.phone },
  { icon: Mail, label: 'Email', value: siteConfig.email },
  { icon: MapPin, label: 'Address', value: siteConfig.address },
  { icon: Clock3, label: 'Hours', value: 'Saturday - Thursday, 10:00 AM - 8:00 PM' },
]

export function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => reset(),
  })

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to Energion about products, test rides, dealership, or fleet mobility."
          description="The contact flow is already wired with validation and mutation handling so it can connect to your backend later without reworking the UI."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="surface-card rounded-[2rem] border border-[rgba(16,27,45,0.08)] p-6 shadow-[var(--shadow-card)]"
              >
                <div className="inline-flex rounded-2xl bg-[rgba(49,94,230,0.08)] p-3 text-[var(--brand-start)]">
                  <card.icon className="size-5" />
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{card.label}</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="surface-card rounded-[2.4rem] border border-[rgba(16,27,45,0.08)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full Name" placeholder="Enter your name" {...register('name')} error={errors.name?.message} />
                <Input label="Phone" placeholder="Enter your phone" {...register('phone')} error={errors.phone?.message} />
              </div>
              <Input label="Email" placeholder="Enter your email" {...register('email')} error={errors.email?.message} />
              <Textarea
                label="Message"
                placeholder="Tell us what you need"
                {...register('message')}
                error={errors.message?.message}
              />

              {mutation.isSuccess ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {mutation.data.message}
                </div>
              ) : null}

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )
}
