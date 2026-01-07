import { redirect } from 'next/navigation'
import { getCurrentNode } from '@/lib/auth'

export default async function Home() {
  const currentNode = await getCurrentNode()

  if (currentNode) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}

