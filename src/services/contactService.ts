export interface ContactPayload {
  name: string
  email: string
  phone: string
  message: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function submitContactMessage(payload: ContactPayload) {
  await delay(800)
  return {
    success: true,
    message: `Thanks ${payload.name}, our team will reach out shortly.`,
  }
}
