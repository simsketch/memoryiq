'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pricingTiers } from '@/components/marketing/pricing-section'
import { Footer } from '@/components/marketing/footer'
import { AnimateOnScroll } from '@/components/animate-on-scroll'

const comparisonFeatures = [
  { name: 'Brains', free: '1', pro: 'Unlimited', team: 'Unlimited' },
  { name: 'Thoughts', free: '1,000', pro: 'Unlimited', team: 'Unlimited' },
  { name: 'AI Connections', free: '1', pro: 'Unlimited', team: 'Unlimited' },
  { name: 'Web Capture', free: true, pro: true, team: true },
  { name: 'Semantic Search', free: true, pro: true, team: true },
  { name: 'API Access', free: false, pro: true, team: true },
  { name: 'All Integrations', free: false, pro: true, team: true },
  { name: 'Priority Curation', free: false, pro: true, team: true },
  { name: 'Advanced Analytics', free: false, pro: true, team: true },
  { name: 'Shared Brains', free: false, pro: false, team: true },
  { name: 'Member Roles', free: false, pro: false, team: true },
  { name: 'Audit Trail', free: false, pro: false, team: true },
  { name: 'SSO', free: false, pro: false, team: true },
  { name: 'Priority Support', free: false, pro: false, team: true },
]

const faqs = [
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes! When you upgrade to Pro or Team, you get a 14-day free trial. No credit card required to start. You can cancel anytime during the trial without being charged.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We do not offer prorated refunds.',
  },
  {
    question: 'How does team billing work?',
    answer:
      'Team plans are billed per seat per month. You only pay for the number of team members you invite. You can add or remove seats at any time, and billing adjusts automatically.',
  },
  {
    question: 'What AI tools support MCP?',
    answer:
      'MemoryIQ works with any AI tool that supports the Model Context Protocol, including Claude, ChatGPT, Cursor, VS Code Copilot, and more. The MCP ecosystem is growing rapidly.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Absolutely. You can export all your thoughts, brains, and metadata at any time in standard formats (JSON, CSV). We believe in full data portability with no lock-in.',
  },
  {
    question: 'Is self-hosting available?',
    answer:
      'We are working on a self-hosted version of MemoryIQ. It will be available for Team plan customers first. Join our waitlist to be notified when it launches.',
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer:
      'If you downgrade from a paid plan, your existing data is preserved but you will only be able to access content within the free tier limits. You can always upgrade again to regain full access.',
  },
]

function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium text-white">{question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-zinc-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm text-zinc-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1035 0%, #0a0118 70%)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {/* Pricing Tiers */}
      <AnimateOnScroll>
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    'backdrop-blur-md bg-white/5 border rounded-xl p-8 relative transition-transform',
                    tier.popular
                      ? 'border-violet-500 scale-105'
                      : 'border-white/10',
                    'hover:scale-105'
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6">
                    {tier.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {tier.price}
                    </span>
                    <span className="text-zinc-400">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span className="text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className={cn(
                      'inline-flex w-full h-11 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                      tier.popular
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'border border-white/20 text-white hover:bg-white/5'
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Feature Comparison */}
      <AnimateOnScroll>
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              Feature Comparison
            </h2>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-4 text-zinc-400 font-medium">
                        Feature
                      </th>
                      <th className="text-center px-6 py-4 text-zinc-400 font-medium">
                        Free
                      </th>
                      <th className="text-center px-6 py-4 text-violet-400 font-medium">
                        Pro
                      </th>
                      <th className="text-center px-6 py-4 text-zinc-400 font-medium">
                        Team
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature) => (
                      <tr
                        key={feature.name}
                        className="border-b border-white/5"
                      >
                        <td className="px-6 py-3 text-zinc-300">
                          {feature.name}
                        </td>
                        {(['free', 'pro', 'team'] as const).map((plan) => (
                          <td
                            key={plan}
                            className="text-center px-6 py-3 text-zinc-400"
                          >
                            {typeof feature[plan] === 'boolean' ? (
                              feature[plan] ? (
                                <Check className="w-4 h-4 text-violet-400 mx-auto" />
                              ) : (
                                <span className="text-zinc-600">&mdash;</span>
                              )
                            ) : (
                              <span className="text-zinc-300">
                                {feature[plan]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* FAQ */}
      <AnimateOnScroll>
        <section className="px-6 py-16 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6">
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
