'use client'

import { useEffect, useRef, useState } from 'react'

// Full text for the typing animation
const THOUGHT_TEXT =
  'We should use PostgreSQL for the new project. It handles our scale better than MongoDB.'

const TAGS = ['decision', 'database', 'postgresql', 'mongodb']

const RELATED_THOUGHTS = [
  {
    text: 'MongoDB performance issues at 10M+ documents',
    similarity: '0.89',
  },
  {
    text: 'Database migration plan for Q2',
    similarity: '0.76',
  },
]

const FLOATING_BADGES = [
  { label: 'Semantic Search', top: '8%', left: '2%' },
  { label: 'Auto-Classification', top: '8%', right: '2%' },
  { label: 'Knowledge Graph', bottom: '6%', left: '50%', transform: 'translateX(-50%)' },
]

export function ProductDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0) // 0 = idle, 1 = capture, 2 = processing, 3 = connected
  const [typedText, setTypedText] = useState('')
  const [showSource, setShowSource] = useState(false)
  const [showProcessing, setShowProcessing] = useState(false)
  const [visibleTags, setVisibleTags] = useState<number[]>([])
  const [embeddingWidth, setEmbeddingWidth] = useState(0)
  const [showSentiment, setShowSentiment] = useState(false)
  const [visibleRelated, setVisibleRelated] = useState<number[]>([])
  const [relatedCount, setRelatedCount] = useState(0)
  const [showLines, setShowLines] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
          runAnimation()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTriggered])

  function runAnimation() {
    // Phase 1: Capture — typing animation (0–2s)
    setPhase(1)

    let charIndex = 0
    const typingInterval = setInterval(() => {
      charIndex++
      setTypedText(THOUGHT_TEXT.slice(0, charIndex))
      if (charIndex >= THOUGHT_TEXT.length) {
        clearInterval(typingInterval)
        setTimeout(() => setShowSource(true), 300)
      }
    }, 28)

    // Phase 2: AI Processing (2s)
    setTimeout(() => {
      setPhase(2)
      setShowProcessing(true)

      // Stagger tags
      TAGS.forEach((_, i) => {
        setTimeout(() => {
          setVisibleTags((prev) => [...prev, i])
        }, 600 + i * 200)
      })

      // Embedding bar fill
      setTimeout(() => {
        setEmbeddingWidth(100)
      }, 700)

      // Sentiment badge
      setTimeout(() => {
        setShowSentiment(true)
      }, 1800)
    }, 2000)

    // Phase 3: Connected (4s)
    setTimeout(() => {
      setPhase(3)
      setShowLines(true)

      RELATED_THOUGHTS.forEach((_, i) => {
        setTimeout(() => {
          setVisibleRelated((prev) => [...prev, i])
        }, i * 500)
      })

      // Tick up counter
      let count = 0
      const counterInterval = setInterval(() => {
        count++
        setRelatedCount(count)
        if (count >= 3) clearInterval(counterInterval)
      }, 300)
    }, 4000)
  }

  return (
    <section className="px-6 py-28">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #a78bfa;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 1s step-end infinite;
        }
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin-slow 0.8s linear infinite;
        }
        .animated-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw-line 0.6s ease-out forwards;
        }
        .pulse-dot {
          animation: pulse-dot 1.2s ease-in-out infinite;
        }
        .pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .pulse-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            <span className="text-white">Watch Your </span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Thoughts Connect
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Every idea you capture is automatically classified, embedded, and linked to everything
            related — instantly.
          </p>
        </div>

        {/* Demo container */}
        <div
          ref={sectionRef}
          className="relative rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* Floating feature badges */}
          {FLOATING_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="absolute z-20 hidden sm:block"
              style={{
                top: badge.top,
                left: badge.left,
                right: badge.right,
                bottom: badge.bottom,
                transform: badge.transform,
              }}
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1 backdrop-blur-sm whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}

          {/* Inner padding */}
          <div className="p-6 sm:p-10 pt-12 sm:pt-16 pb-10">
            {/* Phase idle: show prompt */}
            {phase === 0 && (
              <div className="flex items-center justify-center min-h-[320px]">
                <p className="text-zinc-600 font-mono text-sm">
                  Scroll to watch the demo...
                </p>
              </div>
            )}

            {/* Phase 1+: Main content */}
            {phase >= 1 && (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left column: original thought + processing */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Thought card */}
                  <div
                    className="relative bg-zinc-900/80 border border-white/10 rounded-xl p-5 transition-all duration-500"
                    style={{
                      opacity: phase >= 1 ? 1 : 0,
                      transform: phase >= 1 ? 'translateX(0)' : 'translateX(-32px)',
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        New thought
                      </span>
                    </div>

                    {/* Typed text */}
                    <p className="text-white text-sm sm:text-base leading-relaxed font-sans">
                      {typedText}
                      {phase === 1 && typedText.length < THOUGHT_TEXT.length && (
                        <span className="cursor-blink" />
                      )}
                    </p>

                    {/* Source badge */}
                    <div
                      className="mt-4 transition-all duration-500"
                      style={{
                        opacity: showSource ? 1 : 0,
                        transform: showSource ? 'translateY(0)' : 'translateY(4px)',
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-800 border border-white/8 rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        via Claude Desktop
                      </span>
                    </div>
                  </div>

                  {/* Phase 2: AI Processing */}
                  <div
                    className="bg-zinc-900/80 border border-violet-500/20 rounded-xl p-5 space-y-4 transition-all duration-500"
                    style={{
                      opacity: showProcessing ? 1 : 0,
                      transform: showProcessing ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    {/* Analyzing header */}
                    <div className="flex items-center gap-2">
                      <span className="spinner" />
                      <span className="font-mono text-[11px] text-violet-400 uppercase tracking-widest">
                        Analyzing...
                      </span>
                      <div className="flex gap-1 ml-1">
                        <span className="pulse-dot w-1 h-1 rounded-full bg-violet-400 inline-block" />
                        <span className="pulse-dot w-1 h-1 rounded-full bg-violet-400 inline-block" />
                        <span className="pulse-dot w-1 h-1 rounded-full bg-violet-400 inline-block" />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag, i) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] text-violet-300 bg-violet-500/15 border border-violet-500/25 rounded-md px-2.5 py-1 transition-all duration-300"
                          style={{
                            opacity: visibleTags.includes(i) ? 1 : 0,
                            transform: visibleTags.includes(i) ? 'scale(1)' : 'scale(0.8)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Embedding visualization */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                          Vector embedding
                        </span>
                        <span className="font-mono text-[10px] text-violet-400">
                          1536-dim
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 border border-white/8 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                          style={{
                            width: `${embeddingWidth}%`,
                            background:
                              'linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Sentiment */}
                    <div
                      className="flex items-center gap-2 transition-all duration-400"
                      style={{
                        opacity: showSentiment ? 1 : 0,
                        transform: showSentiment ? 'translateY(0)' : 'translateY(4px)',
                      }}
                    >
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                        Sentiment
                      </span>
                      <span className="font-mono text-[11px] text-zinc-300 bg-zinc-800 border border-white/8 rounded-full px-2.5 py-0.5">
                        neutral
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector + Right column: related thoughts */}
                <div
                  className="flex-1 min-w-0 space-y-4 transition-all duration-700"
                  style={{
                    opacity: phase >= 3 ? 1 : 0,
                    transform: phase >= 3 ? 'translateX(0)' : 'translateX(32px)',
                  }}
                >
                  {/* Counter badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="font-mono text-[11px] text-violet-300 bg-violet-500/15 border border-violet-500/25 rounded-full px-3 py-1 transition-all duration-500"
                      style={{ opacity: phase >= 3 ? 1 : 0 }}
                    >
                      {relatedCount} related thought{relatedCount !== 1 ? 's' : ''} found
                    </div>
                  </div>

                  {/* Related thought cards */}
                  {RELATED_THOUGHTS.map((thought, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/60 border border-white/8 rounded-xl p-5 transition-all duration-500"
                      style={{
                        opacity: visibleRelated.includes(i) ? 1 : 0,
                        transform: visibleRelated.includes(i)
                          ? 'translateX(0)'
                          : 'translateX(20px)',
                        transitionDelay: `${i * 80}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                            Related memory
                          </span>
                        </div>
                        <span
                          className="font-mono text-[11px] shrink-0 px-2 py-0.5 rounded-full border"
                          style={{
                            color: i === 0 ? '#a78bfa' : '#818cf8',
                            borderColor: i === 0 ? 'rgba(167,139,250,0.3)' : 'rgba(129,140,248,0.3)',
                            background: i === 0 ? 'rgba(167,139,250,0.1)' : 'rgba(129,140,248,0.1)',
                          }}
                        >
                          {thought.similarity}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                        {thought.text}
                      </p>

                      {/* Animated connection line at top of card */}
                      {showLines && (
                        <div className="mt-3 overflow-hidden">
                          <svg
                            height="2"
                            width="100%"
                            className="w-full"
                            aria-hidden="true"
                          >
                            <line
                              x1="0"
                              y1="1"
                              x2="100%"
                              y2="1"
                              stroke="rgba(139,92,246,0.4)"
                              strokeWidth="1.5"
                              strokeDasharray="5 4"
                              className="animated-line"
                              style={{ animationDelay: `${i * 300}ms` }}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)',
            }}
          />
        </div>

        {/* Mobile feature badges (shown below on small screens) */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 sm:hidden">
          {FLOATING_BADGES.map((badge) => (
            <span
              key={badge.label}
              className="text-[10px] font-mono font-semibold uppercase tracking-widest text-violet-400 border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1"
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
