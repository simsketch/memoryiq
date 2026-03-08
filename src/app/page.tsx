import { AnimateOnScroll } from '@/components/animate-on-scroll'
import { Hero } from '@/components/marketing/hero'
import { ProblemSection } from '@/components/marketing/problem-section'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { FeaturesGrid } from '@/components/marketing/features-grid'
import { Integrations } from '@/components/marketing/integrations'
import { PricingSection } from '@/components/marketing/pricing-section'
import { OpenStandards } from '@/components/marketing/open-standards'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1035 0%, #0a0118 70%)',
      }}
    >
      <AnimateOnScroll>
        <Hero />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <ProblemSection />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <HowItWorks />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <FeaturesGrid />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <Integrations />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <PricingSection />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <OpenStandards />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <FinalCTA />
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
