import React, { useEffect, useState } from 'react'
import {
  AlertCircleIcon,
  MedalIcon,
  RefreshCwIcon,
  TrophyIcon,
} from 'lucide-react'
import {
  competitionService,
  type LeaderboardEntry,
} from '../services/competitionService'
const rankStyles: Record<number, string> = {
  1: 'bg-gold/20 text-primary',
  2: 'bg-secondary text-foreground',
  3: 'bg-amber-700/10 text-amber-800 dark:text-amber-300',
}
export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const loadLeaderboard = async () => {
    setStatus('loading')
    try {
      setEntries(await competitionService.getLeaderboard())
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }
  useEffect(() => {
    void loadLeaderboard()
  }, [])
  return (
    <div className="min-h-full w-full bg-background">
      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <TrophyIcon className="h-4 w-4" />
              Competition standings
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Leaderboard
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Cumulative marks earned across Physics Challenge Arena quizzes.
            </p>
          </div>
        </header>

        {status === 'loading' && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-border p-5 last:border-0"
              >
                <div className="h-9 w-9 animate-pulse rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
                </div>
                <div className="h-5 w-14 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
            <AlertCircleIcon className="mx-auto h-7 w-7 text-destructive" />
            <h3 className="mt-3 font-bold text-foreground">
              Leaderboard unavailable
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => void loadLeaderboard()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCwIcon className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {status === 'ready' && !entries.length && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <MedalIcon className="mx-auto h-7 w-7 text-muted-foreground" />
            <h3 className="mt-3 font-bold text-foreground">No scores yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete a competition quiz to take the first position.
            </p>
          </div>
        )}

        {status === 'ready' && entries.length > 0 && (
          <section
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            aria-label="Ranked students"
          >
            <div className="hidden grid-cols-[80px_1fr_90px_90px_90px_105px] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid">
              <span>Rank</span>
              <span>Student</span>
              <span className="text-right">Correct</span>
              <span className="text-right">Wrong</span>
              <span className="text-right">Missed</span>
              <span className="text-right">Marks</span>
            </div>
            <ol>
              {entries.map((entry) => (
                <li
                  key={entry.userId}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[80px_1fr_90px_90px_90px_105px] sm:gap-4 sm:px-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${rankStyles[entry.rank] ?? 'bg-secondary text-muted-foreground'}`}
                    >
                      {entry.rank}
                    </span>
                    <span className="sm:hidden text-xs font-semibold text-muted-foreground">
                      Rank
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {entry.displayName}
                    </p>
                  </div>
                  <p className="hidden text-right text-sm text-muted-foreground sm:block">
                    {entry.correctAnswers}
                  </p>
                  <p className="hidden text-right text-sm text-muted-foreground sm:block">
                    {entry.wrongAnswers}
                  </p>
                  <p className="hidden text-right text-sm text-muted-foreground sm:block">
                    {entry.missedAnswers}
                  </p>
                  <p className="text-right text-sm font-bold text-foreground">
                    {entry.score}{' '}
                    <span className="text-xs font-medium text-muted-foreground">
                      pts
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Marks update when a quiz is completed.
        </p>
      </div>
    </div>
  )
}
