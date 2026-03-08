import Link from 'next/link'
import { Footer } from '@/components/marketing/footer'

export default function TermsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1035 0%, #0a0118 70%)',
      }}
    >
      <div className="px-6 pt-12 pb-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>

      <article className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          <p className="text-zinc-500 text-sm mb-12">
            Last updated: March 1, 2026
          </p>

          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using MemoryIQ (&quot;the Service&quot;),
                provided by Yoyo Code (&quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;), you agree to be bound by these Terms of
                Service. If you do not agree to these terms, do not use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Description of Service
              </h2>
              <p>
                MemoryIQ is an AI-powered knowledge management platform that
                allows users to capture, organize, and semantically search
                thoughts and memories. The Service includes web applications, API
                access, and integrations with third-party AI tools via the Model
                Context Protocol (MCP).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Account Registration
              </h2>
              <p>
                You must create an account to use MemoryIQ. You are responsible
                for maintaining the confidentiality of your account credentials
                and for all activities under your account. You must provide
                accurate and complete information during registration and keep it
                updated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>
                  Use the Service for any unlawful purpose or to store illegal
                  content.
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the
                  Service.
                </li>
                <li>
                  Interfere with or disrupt the Service or its infrastructure.
                </li>
                <li>
                  Reverse-engineer, decompile, or disassemble any part of the
                  Service.
                </li>
                <li>
                  Use the Service to build a competing product or service.
                </li>
                <li>
                  Exceed rate limits or abuse API access in a manner that
                  degrades service for other users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Intellectual Property
              </h2>
              <p>
                You retain all ownership rights to the content you store in
                MemoryIQ. By using the Service, you grant us a limited license
                to process your content solely for the purpose of providing the
                Service (including generating embeddings and enabling search). We
                do not claim ownership of your content and will not use it for
                any purpose other than providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Subscription and Billing
              </h2>
              <p>
                Some features of MemoryIQ require a paid subscription.
                Subscriptions are billed monthly or annually. You may cancel at
                any time, and your access will continue until the end of the
                current billing period. Prices are subject to change with 30
                days notice. Refunds are handled on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Data and Privacy
              </h2>
              <p>
                Your use of the Service is also governed by our{' '}
                <Link
                  href="/privacy"
                  className="text-violet-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                . We take data security seriously and implement
                industry-standard protections. You are responsible for the
                content you store and share through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, MemoryIQ and Yoyo Code
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including loss of data,
                profits, or business opportunities. Our total liability shall not
                exceed the amount you paid us in the twelve months preceding the
                claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Service Availability
              </h2>
              <p>
                We strive to maintain high availability but do not guarantee
                uninterrupted access. We may suspend or discontinue the Service
                (or any part of it) with reasonable notice. We are not liable for
                any downtime or service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. Termination
              </h2>
              <p>
                We may terminate or suspend your account if you violate these
                Terms. Upon termination, your right to use the Service ceases
                immediately. You may export your data before termination. We will
                retain your data for 30 days after account closure to allow
                recovery, after which it will be permanently deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Changes to Terms
              </h2>
              <p>
                We may update these Terms from time to time. We will notify you
                of material changes via email or through the Service. Continued
                use after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. Contact
              </h2>
              <p>
                If you have questions about these Terms, please contact us at{' '}
                <a
                  href="mailto:legal@memoryiq.app"
                  className="text-violet-400 hover:underline"
                >
                  legal@memoryiq.app
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
