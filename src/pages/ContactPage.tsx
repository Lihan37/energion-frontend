import { useMutation } from '@tanstack/react-query'
import { ArrowUpRight, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { siteConfig } from '../constants/site'
import { submitContactMessage } from '../services/contactService'
import { CampaignIntro } from '../components/campaign/CampaignIntro'
import { CampaignPhotoPanel } from '../components/campaign/CampaignScenes'
import { campaignPhotos } from '../constants/campaignPhotos'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().regex(/^[+\d\s()-]{8,20}$/, 'Enter a valid phone number'),
  model: z.string().max(100).optional(),
  message: z.string().trim().min(10, 'Tell us a bit more about your request'),
})
type Values = z.infer<typeof schema>

export function ContactPage() {
  const [params] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      name: '',
      email: '',
      phone: '',
      model: params.get('model')?.slice(0, 100) ?? '',
      message: '',
    },
  })
  const mutation = useMutation({ mutationFn: submitContactMessage })
  return (
    <Container>
      <CampaignIntro
        eyebrow="Start a conversation"
        index="03"
        lines={['Your journey', 'starts here.']}
        description="A question about a model? Exploring electric for the first time? Our team is here to help you take the next step."
      />
      <div className="contact-layout">
        <div>
          <dl className="contact-details">
            <div>
              <dt>Call our team</dt>
              <dd>
                <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email us</dt>
              <dd>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </dd>
            </div>
            <div>
              <dt>Visit Energion</dt>
              <dd>{siteConfig.address}</dd>
            </div>
          </dl>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`}
            target="_blank"
            rel="noreferrer"
            className="text-link mt-5"
          >
            Get directions <ArrowUpRight size={16} />
          </a>
          <p className="form-note mt-8">
            For model availability, dealership enquiries or help choosing your ride, contact our
            team directly.
          </p>
          <div className="contact-campaign-photo">
            <CampaignPhotoPanel photo={campaignPhotos.direction} />
          </div>
        </div>
        <div className="contact-form">
          <h2 className="font-display text-3xl uppercase">Tell us what's on your mind.</h2>
          <p className="form-note mt-3 mb-6">
            Complete this form to prepare an enquiry email. Your email app will open when you choose
            to send it.
          </p>
          <form
            className="space-y-5"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            onChange={() => mutation.reset()}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Your name"
                autoComplete="name"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Phone number"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Model of interest (optional)"
              placeholder="Which Energion moves you?"
              {...register('model')}
              error={errors.model?.message}
            />
            <Textarea
              label="Your message"
              placeholder="Tell us how we can help."
              {...register('message')}
              error={errors.message?.message}
            />
            {mutation.isError && (
              <p role="alert" className="text-sm text-red-700">
                Could not prepare your enquiry. Please call or email our team directly.
              </p>
            )}
            {mutation.isSuccess ? (
              <div role="status" className="rounded border border-brand-500 bg-surface-50 p-4">
                <p className="form-note">{mutation.data.message}</p>
                <a href={mutation.data.mailto} className="cta mt-4">
                  Open email app <ArrowUpRight size={16} />
                </a>
              </div>
            ) : (
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Preparing...' : 'Prepare enquiry email'}
                <ArrowUpRight size={16} />
              </Button>
            )}
            <a className="text-link ml-4" href={`tel:${siteConfig.phone}`}>
              <Phone size={14} /> Prefer to call?
            </a>
          </form>
        </div>
      </div>
    </Container>
  )
}
