import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Get started with the basics',
    features: [
      '1 brain',
      '1,000 thoughts',
      '1 AI connection',
      'Web capture',
      'Semantic search',
    ],
    cta: 'Get Started',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    description: 'For power users and creators',
    features: [
      'Unlimited brains',
      'Unlimited thoughts',
      'All integrations',
      'API access',
      'Priority curation',
      'Advanced analytics',
    ],
    cta: 'Get Started',
    href: '/sign-up',
    popular: true,
  },
  {
    name: 'Team',
    price: '$25',
    period: '/seat/mo',
    description: 'For teams that think together',
    features: [
      'Everything in Pro',
      'Shared brains',
      'Member roles & permissions',
      'Audit trail',
      'SSO',
      'Priority support',
    ],
    cta: 'Get Started',
    href: '/sign-up',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple Pricing
          </span>
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Start free, scale as you grow
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
              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-zinc-500 text-sm mb-6">{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-zinc-400">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
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
  )
}
