import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  GraduationCapIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  PenLineIcon,
  RotateCcwIcon,
  TargetIcon,
  TimerIcon,
  TrophyIcon,
  XCircleIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import {
  competitionService,
  PHYSICS_MODULES,
  type PhysicsModule,
  type QuizQuestion,
  type StudyYear,
} from '../services/competitionService'
import { useScreenInit } from '../useScreenInit.js'

type CompetitionStep =
  | 'year'
  | 'modules'
  | 'interests'
  | 'rules'
  | 'returning'
  | 'quiz'
  | 'complete'

interface CompetitionScreenState {
  step?: CompetitionStep
  selectedYear?: StudyYear
}

const QUESTION_SECONDS = 30
const DESCRIPTION_MAX_LENGTH = 500

function moduleLabel(module: PhysicsModule): string {
  return `${module.code} ${module.name}`
}

const studyYears: {
  value: StudyYear
  label: string
  description: string
}[] = [
  {
    value: 1,
    label: 'First Year',
    description: 'Build your core physics foundations.',
  },
  {
    value: 2,
    label: 'Second Year',
    description: 'Apply principles through deeper study.',
  },
  {
    value: 3,
    label: 'Third Year',
    description: 'Develop advanced theoretical knowledge.',
  },
  {
    value: 4,
    label: 'Final Year',
    description: 'Test your specialist understanding.',
  },
]

const stepOrder: CompetitionStep[] = ['year', 'modules', 'interests', 'quiz']

export function CompetitionPage() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const screenInit = useScreenInit() as CompetitionScreenState
  const initialStep: CompetitionStep =
    screenInit.step &&
    [
      'year',
      'modules',
      'interests',
      'rules',
      'returning',
      'quiz',
      'complete',
    ].includes(screenInit.step)
      ? screenInit.step
      : 'year'
  const initialYear =
    screenInit.selectedYear && [1, 2, 3, 4].includes(screenInit.selectedYear)
      ? screenInit.selectedYear
      : null

  const [step, setStep] = useState<CompetitionStep>(initialStep)
  const [selectedYear, setSelectedYear] = useState<StudyYear | null>(
    initialYear,
  )
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null,
  )
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{
    correct: boolean
    correctOptionIndex: number
    scoreAwarded: number
  } | null>(null)
  const [sessionStats, setSessionStats] = useState({
    answered: 0,
    correct: 0,
    score: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(!screenInit.step)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasBootstrappedRef = useRef(false)

  const modules = selectedYear ? PHYSICS_MODULES[selectedYear] : []

  useEffect(() => {
    if (screenInit.step) return
    if (isAuthLoading) return
    if (hasBootstrappedRef.current) return
    hasBootstrappedRef.current = true

    if (!user?.has_completed_competition_onboarding) {
      setIsBootstrapping(false)
      return
    }

    let cancelled = false
    competitionService
      .getProfile()
      .then((profile) => {
        if (cancelled) return
        const validYear = ([1, 2, 3, 4] as number[]).includes(
          profile.studyYear,
        )
          ? (profile.studyYear as StudyYear)
          : null
        if (!validYear) return
        setSelectedYear(validYear)
        setSelectedModules(profile.interestModules)
        setDescription(profile.description ?? '')
        setStep('returning')
      })
      .catch(() => {
        // fall back to the normal onboarding flow
      })
      .finally(() => {
        if (!cancelled) setIsBootstrapping(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user])

  useEffect(() => {
    if (step !== 'quiz' || !currentQuestion || isSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return previous - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step, currentQuestion, isSubmitted])

  useEffect(() => {
    if (step === 'quiz' && currentQuestion && !isSubmitted && timeLeft === 0) {
      if (selectedOption !== null) {
        void submitAnswer()
      } else {
        recordUnansweredTimeout()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const toggleModule = (label: string) => {
    setSelectedModules((previous) => {
      if (previous.includes(label)) {
        return previous.filter((item) => item !== label)
      }
      if (previous.length >= competitionService.maxSelectableModules) {
        toast.error(
          `You can select up to ${competitionService.maxSelectableModules} modules.`,
        )
        return previous
      }
      return [...previous, label]
    })
  }

  const chooseYear = (year: StudyYear) => {
    setSelectedYear(year)
    setSelectedModules([])
    setStep('modules')
  }

  const fetchNextQuestion = async () => {
    setIsLoading(true)
    try {
      const question = await competitionService.generateQuestion()
      setCurrentQuestion(question)
      setSelectedOption(null)
      setIsSubmitted(false)
      setFeedback(null)
      setTimeLeft(QUESTION_SECONDS)
    } catch {
      toast.error('The next question could not be loaded. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const goToInterests = () => {
    if (!selectedModules.length) {
      toast.error('Choose at least one module to continue.')
      return
    }
    setStep('interests')
  }

  const confirmProfile = async () => {
    if (!selectedYear) return
    setIsSavingProfile(true)
    try {
      await competitionService.saveProfile({
        year: selectedYear,
        interestedModules: selectedModules,
        description: description.trim() || null,
      })
      await refreshUser()
      setStep('rules')
    } catch {
      toast.error('Your preferences could not be saved. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const startCompetition = () => {
    setSessionStats({ answered: 0, correct: 0, score: 0 })
    setStep('quiz')
    void fetchNextQuestion()
  }

  const applyAnswerOutcome = (correct: boolean, scoreAwarded: number) => {
    setSessionStats((previous) => ({
      answered: previous.answered + 1,
      correct: previous.correct + (correct ? 1 : 0),
      score: previous.score + scoreAwarded,
    }))
  }

  const submitAnswer = async () => {
    if (!currentQuestion || selectedOption === null || isSubmitted) return
    setIsSubmitted(true)
    setIsLoading(true)
    const timeTakenSeconds = QUESTION_SECONDS - timeLeft
    try {
      const result = await competitionService.submitAnswer({
        quizId: currentQuestion.id,
        selectedOptionIndex: selectedOption,
        timeTakenSeconds,
      })
      setFeedback({
        correct: result.isCorrect,
        correctOptionIndex: result.correctOptionIndex,
        scoreAwarded: result.scoreAwarded,
      })
      applyAnswerOutcome(result.isCorrect, result.scoreAwarded)
    } catch {
      toast.error('Your answer could not be submitted. Please try again.')
      setIsSubmitted(false)
    } finally {
      setIsLoading(false)
    }
  }

  const recordUnansweredTimeout = () => {
    setIsSubmitted(true)
    setFeedback({ correct: false, correctOptionIndex: -1, scoreAwarded: 0 })
    applyAnswerOutcome(false, 0)
  }

  const resetCompetition = () => {
    setSelectedModules([])
    setDescription('')
    setCurrentQuestion(null)
    setSelectedOption(null)
    setIsSubmitted(false)
    setFeedback(null)
    setStep(selectedYear ? 'modules' : 'year')
  }

  const activeStepIndex = stepOrder.indexOf(
    step === 'complete' || step === 'rules' ? 'quiz' : step,
  )

  if (isBootstrapping) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-background">
        <LoaderCircleIcon
          className="h-6 w-6 animate-spin text-primary"
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <div className="min-h-full w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <TrophyIcon className="h-4 w-4" />
              Physics challenge arena
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Competition
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Choose your level, test your knowledge, and earn points for the
              department leaderboard.
            </p>
          </div>
        </header>

        {step !== 'quiz' && step !== 'returning' && (
          <ol
            className="mb-8 grid grid-cols-4 gap-2"
            aria-label="Competition progress"
          >
            {[
              ['1', 'Year'],
              ['2', 'Modules'],
              ['3', 'Interests'],
              ['4', 'Quiz'],
            ].map(([number, label], index) => {
              const complete = index < activeStepIndex
              const active = index === activeStepIndex
              return (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete || active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
                  >
                    {complete ? (
                      <CheckCircle2Icon className="h-4 w-4" />
                    ) : (
                      number
                    )}
                  </span>
                  <span
                    className={`text-sm font-semibold ${index <= activeStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {label}
                  </span>
                  {index < 3 && (
                    <span
                      className="ml-auto h-px flex-1 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
          </ol>
        )}

        {step === 'returning' && (
          <section
            className="mx-auto max-w-2xl"
            aria-labelledby="returning-heading"
          >
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 text-primary">
                <TrophyIcon className="h-7 w-7" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Welcome back
              </p>
              <h3
                id="returning-heading"
                className="mt-2 text-3xl font-bold text-foreground"
              >
                {firstName}, here's where you stand.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your cumulative score across the Physics Challenge Arena.
              </p>
              <div className="my-8 rounded-xl border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Total score
                </p>
                <p className="mt-1 text-4xl font-bold text-foreground">
                  {user?.competition_score ?? 0}{' '}
                  <span className="text-base">pts</span>
                </p>
              </div>
              <button
                type="button"
                onClick={startCompetition}
                className="mx-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCcwIcon className="h-4 w-4" /> Let's start again
              </button>
            </div>
          </section>
        )}

        {step === 'year' && (
          <section aria-labelledby="year-heading">
            <div className="mb-6">
              <h3
                id="year-heading"
                className="text-xl font-bold text-foreground"
              >
                What year are you studying?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll tailor your available physics modules to your study year.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {studyYears.map((year) => (
                <button
                  key={year.value}
                  type="button"
                  onClick={() => chooseYear(year.value)}
                  className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GraduationCapIcon className="h-5 w-5" />
                    </span>
                    <ArrowRightIcon className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">{year.label}</h4>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {year.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'modules' && (
          <section aria-labelledby="module-heading">
            <button
              type="button"
              onClick={() => setStep('year')}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Change year
            </button>
            <div className="mb-6">
              <h3
                id="module-heading"
                className="text-xl font-bold text-foreground"
              >
                Pick up to {competitionService.maxSelectableModules} modules
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll generate personalized questions from the modules you
                choose. Selected {selectedModules.length}/
                {competitionService.maxSelectableModules}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {modules.map((module) => {
                const label = moduleLabel(module)
                const selected = selectedModules.includes(label)
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleModule(label)}
                    aria-pressed={selected}
                    className={`rounded-xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/60'}`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="rounded-md bg-gold/15 px-2.5 py-1 text-xs font-bold text-primary">
                        {module.code}
                      </span>
                      {selected ? (
                        <CheckCircle2Icon className="h-5 w-5 text-primary" />
                      ) : (
                        <CircleIcon className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <h4 className="font-bold text-foreground">
                      {module.name}
                    </h4>
                  </button>
                )
              })}
            </div>
            <div className="mt-7 flex justify-end">
              <button
                type="button"
                disabled={!selectedModules.length}
                onClick={goToInterests}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Continue
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {step === 'interests' && (
          <section
            className="mx-auto max-w-2xl"
            aria-labelledby="interests-heading"
          >
            <button
              type="button"
              onClick={() => setStep('modules')}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Change modules
            </button>
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PenLineIcon className="h-5 w-5" />
              </span>
              <div>
                <h3
                  id="interests-heading"
                  className="text-xl font-bold text-foreground"
                >
                  What area of physics interests you most?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us about your interests or career goals — we'll use
                  this to personalize your quiz questions. This is optional.
                </p>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value.slice(0, DESCRIPTION_MAX_LENGTH),
                )
              }
              rows={5}
              placeholder="e.g. I'm fascinated by astrophysics and hope to work on space missions one day..."
              className="w-full resize-none rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <p className="mt-1.5 text-right text-xs text-muted-foreground">
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </p>
            <div className="mt-7 flex justify-end">
              <button
                type="button"
                disabled={isSavingProfile}
                onClick={() => void confirmProfile()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isSavingProfile ? (
                  <>
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {step === 'rules' && (
          <section
            className="mx-auto max-w-2xl"
            aria-labelledby="rules-heading"
          >
            <button
              type="button"
              onClick={() => setStep('interests')}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Edit interests
            </button>
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-primary">
                <ListChecksIcon className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Before you begin
              </p>
              <h3
                id="rules-heading"
                className="mt-2 text-2xl font-bold text-foreground"
              >
                Competition rules
              </h3>
              <ul className="mx-auto mt-7 max-w-md space-y-4 text-left text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <ListChecksIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    You'll get personalized questions generated from your
                    selected modules, for as long as you keep going.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Each question gives you {QUESTION_SECONDS} seconds to
                    answer before it's marked as unanswered.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <TargetIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Correct answers earn points, and answering faster earns
                    more. Wrong or missed answers earn none.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <TrophyIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Your total score is added to the department leaderboard.
                  </span>
                </li>
              </ul>
              <button
                type="button"
                onClick={startCompetition}
                className="mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Start your competition
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {step === 'quiz' && (
          <section
            className="mx-auto max-w-3xl"
            aria-labelledby="question-heading"
          >
            <div className="mb-5 flex items-center justify-end">
              <div
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold ${timeLeft <= 10 ? 'border-destructive text-destructive' : 'border-border text-foreground'}`}
              >
                <TimerIcon className="h-4 w-4" />
                {timeLeft}s
              </div>
            </div>

            {!currentQuestion || isLoading ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-border bg-card">
                <LoaderCircleIcon
                  className="h-6 w-6 animate-spin text-primary"
                  aria-label="Loading question"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
                <div className="mb-7 flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-primary">
                    <div className="h-5 w-5" />
                  </span>
                  <h3
                    id="question-heading"
                    className="pt-1 text-xl font-bold leading-8 text-foreground"
                  >
                    {currentQuestion.question}
                  </h3>
                </div>

                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label="Answer choices"
                >
                  {currentQuestion.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index)
                    const chosen = selectedOption === index
                    const isCorrectOption =
                      isSubmitted &&
                      feedback !== null &&
                      feedback.correctOptionIndex === index
                    const answerClass = isSubmitted
                      ? isCorrectOption
                        ? 'border-green-600 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100'
                        : chosen
                          ? 'border-destructive bg-destructive/5 text-foreground'
                          : 'border-border bg-card text-muted-foreground'
                      : chosen
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/60'
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={chosen}
                        disabled={isSubmitted}
                        onClick={() => setSelectedOption(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${answerClass}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${isCorrectOption ? 'border-green-600 bg-green-600 text-white' : chosen ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
                        >
                          {letter}
                        </span>
                        <span>{option}</span>
                        {isCorrectOption && (
                          <CheckCircle2Icon className="ml-auto h-5 w-5 text-green-600" />
                        )}
                        {isSubmitted && chosen && !isCorrectOption && (
                          <XCircleIcon className="ml-auto h-5 w-5 text-destructive" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {isSubmitted && feedback && (
                  <div
                    className={`mt-5 rounded-xl border p-4 text-sm ${feedback.correct ? 'border-green-600/30 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100' : 'border-gold/40 bg-gold/10 text-foreground'}`}
                    role="status"
                  >
                    <p className="font-bold">
                      {feedback.correct
                        ? `Correct — +${feedback.scoreAwarded} pts`
                        : selectedOption === null
                          ? "Time's up"
                          : 'Not quite'}
                    </p>
                  </div>
                )}

                <div className="mt-7 flex justify-end gap-3">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => void submitAnswer()}
                      disabled={selectedOption === null || isLoading}
                      className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Check answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void fetchNextQuestion()}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Next question
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 'complete' && (
          <section
            className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-10"
            aria-labelledby="results-heading"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 text-primary">
              <TrophyIcon className="h-7 w-7" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Quiz complete
            </p>
            <h3
              id="results-heading"
              className="mt-2 text-3xl font-bold text-foreground"
            >
              Strong work, {firstName}.
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You answered {sessionStats.answered} question
              {sessionStats.answered === 1 ? '' : 's'} this session.
            </p>
            <div className="my-8 grid grid-cols-2 divide-x divide-border overflow-hidden rounded-xl border border-border text-left">
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  This session
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {sessionStats.score} <span className="text-sm">pts</span>
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Correct answers
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {sessionStats.correct}/{sessionStats.answered}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setStep('quiz')
                  void fetchNextQuestion()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCcwIcon className="h-4 w-4" /> Keep going
              </button>
              <button
                type="button"
                onClick={resetCompetition}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <GraduationCapIcon className="h-4 w-4" /> Choose different modules
              </button>
              <a
                href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <TargetIcon className="h-4 w-4" /> View leaderboard
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
