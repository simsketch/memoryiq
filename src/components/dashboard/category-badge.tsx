const categoryColors: Record<string, string> = {
  idea: 'bg-violet-500/20 text-violet-300',
  decision: 'bg-blue-500/20 text-blue-300',
  person_note: 'bg-green-500/20 text-green-300',
  task: 'bg-orange-500/20 text-orange-300',
  reference: 'bg-cyan-500/20 text-cyan-300',
  observation: 'bg-yellow-500/20 text-yellow-300',
  question: 'bg-pink-500/20 text-pink-300',
}

const categoryLabels: Record<string, string> = {
  idea: 'Idea',
  decision: 'Decision',
  person_note: 'Person Note',
  task: 'Task',
  reference: 'Reference',
  observation: 'Observation',
  question: 'Question',
}

export function CategoryBadge({ category }: { category: string }) {
  const colors = categoryColors[category] ?? 'bg-zinc-500/20 text-zinc-300'
  const label = categoryLabels[category] ?? category

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}
    >
      {label}
    </span>
  )
}
