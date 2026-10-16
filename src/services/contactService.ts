import { siteConfig } from '../constants/site'

export interface ContactPayload {
  name: string
  email: string
  phone: string
  message: string
  model?: string
}

// No contact delivery endpoint exists in this project. Prepare a real email
// handoff rather than reporting the old simulated submission as delivered.
export async function submitContactMessage(payload: ContactPayload) {
  const subject = `Energion enquiry${payload.model ? ` - ${payload.model}` : ''}`
  const body = `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n${payload.model ? `Model: ${payload.model}\n` : ''}\n${payload.message}`
  return {
    success: true,
    mailto: `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    message:
      'Your enquiry email is ready. Open your email app and send it to complete your enquiry.',
  }
}
