import { dealers } from '../data/dealers'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getDealers() {
  await delay(250)
  return dealers
}
