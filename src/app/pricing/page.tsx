'use client'

import Navbar from '@/components/layout/Navbar'
import Pricing from '@/components/landing/Pricing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Pricing />
      </main>
    </div>
  )
}
