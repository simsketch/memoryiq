import Link from 'next/link'
import { Footer } from '@/components/marketing/footer'
import { Navbar } from '@/components/marketing/navbar'

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1035 0%, #0a0118 70%)',
      }}
    >
      <Navbar />

      <article className="px-6 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-zinc-500 text-sm mb-12">
            Last updated: March 1, 2026
          </p>

          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-3">
                When you use MemoryIQ, we collect the following types of
                information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>
                  <strong className="text-zinc-300">Account Information:</strong>{' '}
                  Name, email address, and authentication credentials when you
                  create an account.
                </li>
                <li>
                  <strong className="text-zinc-300">Content:</strong> Thoughts,
                  memories, and other content you store in your brains.
                </li>
                <li>
                  <strong className="text-zinc-300">Usage Data:</strong> How you
                  interact with MemoryIQ, including features used, search
                  queries, and performance metrics.
                </li>
                <li>
                  <strong className="text-zinc-300">Device Information:</strong>{' '}
                  Browser type, operating system, and device identifiers for
                  security and optimization.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>
                  To provide, maintain, and improve the MemoryIQ service.
                </li>
                <li>
                  To generate embeddings and enable semantic search across your
                  content.
                </li>
                <li>
                  To send you service-related communications and updates.
                </li>
                <li>
                  To detect and prevent fraud, abuse, and security incidents.
                </li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. AI Processing and Embeddings
              </h2>
              <p>
                MemoryIQ uses AI models to generate vector embeddings of your
                content for semantic search. Your content is processed by
                third-party AI providers (such as OpenAI) solely for the purpose
                of generating embeddings. We do not use your content to train AI
                models. Embeddings are mathematical representations and cannot be
                reversed to reconstruct your original content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Data Retention
              </h2>
              <p>
                We retain your content and account data for as long as your
                account is active. When you delete a thought, brain, or your
                account, the associated data is permanently removed from our
                systems within 30 days. Backups may retain data for up to 90
                days before full deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Third-Party Services
              </h2>
              <p className="mb-3">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>
                  <strong className="text-zinc-300">Clerk:</strong> For
                  authentication and user management.
                </li>
                <li>
                  <strong className="text-zinc-300">Neon:</strong> For database
                  hosting (PostgreSQL with pgvector).
                </li>
                <li>
                  <strong className="text-zinc-300">OpenAI:</strong> For
                  generating text embeddings.
                </li>
                <li>
                  <strong className="text-zinc-300">Vercel:</strong> For
                  application hosting and edge delivery.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Data Sharing
              </h2>
              <p>
                We do not sell your personal data. We share data with
                third-party service providers only as necessary to operate the
                service. We may disclose information if required by law or to
                protect our rights and the safety of our users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400 mt-3">
                <li>Access and export all your data at any time.</li>
                <li>
                  Request correction or deletion of your personal information.
                </li>
                <li>Opt out of non-essential communications.</li>
                <li>Delete your account and all associated data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Security
              </h2>
              <p>
                We implement industry-standard security measures including
                encryption in transit (TLS) and at rest, regular security
                audits, and access controls. However, no method of transmission
                or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us at{' '}
                <a
                  href="mailto:privacy@memoryiq.app"
                  className="text-violet-400 hover:underline"
                >
                  privacy@memoryiq.app
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
