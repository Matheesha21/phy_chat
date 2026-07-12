import React, { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  CheckCircle2Icon,
  CircleIcon,
  GraduationCapIcon,
  LoaderCircleIcon,
  RotateCcwIcon,
  TargetIcon,
  TrophyIcon,
  XCircleIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import {
  competitionService,
  type PhysicsModule,
  type QuizQuestion,
  type StudyYear,
} from '../services/competitionService'
import { useScreenInit } from '../useScreenInit.js'
type CompetitionStep = 'year' | 'module' | 'quiz' | 'complete'
interface CompetitionScreenState {
  step?: CompetitionStep
  selectedYear?: StudyYear
  selectedModuleId?: string
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
export function CompetitionPage() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const screenInit = useScreenInit() as CompetitionScreenState
  const initialStep: CompetitionStep =
    screenInit.step &&
    ['year', 'module', 'quiz', 'complete'].includes(screenInit.step)
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
  const [modules, setModules] = useState<PhysicsModule[]>([])
  const [selectedModule, setSelectedModule] = useState<PhysicsModule | null>(
    null,
  )
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<
    {
      questionId: string
      selectedOption: number
    }[]
  >([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    awardedPoints: number
    correctAnswers: number
    totalQuestions: number
    totalPoints: number
  } | null>(null)
  useEffect(() => {
    if (!selectedYear) return
    setIsLoading(true)
    competitionService
      .getModules(selectedYear)
      .then((availableModules) => {
        setModules(availableModules)
        const previewModule = screenInit.selectedModuleId
          ? availableModules.find(
              (module) => module.id === screenInit.selectedModuleId,
            )
          : null
        if (!previewModule || (step !== 'quiz' && step !== 'complete')) return
        setSelectedModule(previewModule)
        return competitionService
          .getQuestions(previewModule.id)
          .then((data) => {
            setQuestions(data)
            if (step === 'complete') {
              setResult({
                awardedPoints: 30,
                correctAnswers: data.length,
                totalQuestions: data.length,
                totalPoints: 30,
              })
            }
          })
      })
      .catch(() =>
        toast.error('Modules could not be loaded. Please try again.'),
      )
      .finally(() => setIsLoading(false))
  }, [selectedYear, screenInit.selectedModuleId, step])
  const currentQuestion = questions[questionIndex]
  const currentScore = answers.reduce((total, answer) => {
    const question = questions.find((item) => item.id === answer.questionId)
    return question?.correctOption === answer.selectedOption
      ? total + question.points
      : total
  }, 0)
  const chooseYear = (year: StudyYear) => {
    setSelectedYear(year)
    setSelectedModule(null)
    setStep('module')
  }
  const beginQuiz = async () => {
    if (!selectedModule) return
    setIsLoading(true)
    try {
      const data = await competitionService.getQuestions(selectedModule.id)
      if (!data.length) {
        toast.error('No questions are available for this module yet.')
        return
      }
      setQuestions(data)
      setQuestionIndex(0)
      setSelectedOption(null)
      setAnswers([])
      setIsSubmitted(false)
      setResult(null)
      setStep('quiz')
    } catch {
      toast.error('The quiz could not be started. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const submitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return
    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        selectedOption,
      },
    ])
    setIsSubmitted(true)
  }
  const nextQuestion = () => {
    setQuestionIndex((previous) => (previous + 1) % questions.length)
    setSelectedOption(null)
    setIsSubmitted(false)
  }
  const endQuiz = async () => {
    if (!answers.length) return
    setIsLoading(true)
    try {
      const quizResult = await competitionService.submitQuiz({
        moduleId: selectedModule?.id ?? '',
        answers,
      })
      setResult(quizResult)
      setStep('complete')
    } catch {
      toast.error('Your score could not be saved. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const resetCompetition = () => {
    setSelectedModule(null)
    setQuestions([])
    setAnswers([])
    setSelectedOption(null)
    setIsSubmitted(false)
    setResult(null)
    setStep(selectedYear ? 'module' : 'year')
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
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-primary">
              <AwardIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Each correct answer
              </p>
              <p className="text-sm font-bold text-foreground">
                +10 competition points
              </p>
            </div>
          </div>
        </header>

        <ol
          className="mb-8 grid grid-cols-3 gap-2"
          aria-label="Competition progress"
        >
          {[
            ['1', 'Year'],
            ['2', 'Module'],
            ['3', 'Quiz'],
          ].map(([number, label], index) => {
            const activeIndex = step === 'year' ? 0 : step === 'module' ? 1 : 2
            const complete = index < activeIndex
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete || index === activeIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
                >
                  {complete ? <CheckCircle2Icon className="h-4 w-4" /> : number}
                </span>
                <span
                  className={`text-sm font-semibold ${index <= activeIndex ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {label}
                </span>
                {index < 2 && (
                  <span
                    className="ml-auto h-px flex-1 bg-border"
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ol>

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

        {step === 'module' && (
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
                Pick a physics module
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedYear === 2
                  ? 'Second Year modules are ready for your next challenge.'
                  : `Choose a Year ${selectedYear} module to begin.`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-border bg-card">
                <LoaderCircleIcon
                  className="h-6 w-6 animate-spin text-primary"
                  aria-label="Loading modules"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {modules.map((module) => {
                    const selected = selectedModule?.id === module.id
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => setSelectedModule(module)}
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
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {module.description}
                        </p>
                        <p className="mt-4 text-xs font-semibold text-muted-foreground">
                          {module.questionCount} questions · Up to{' '}
                          {module.questionCount * 10} points
                        </p>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-7 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedModule || isLoading}
                    onClick={beginQuiz}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Start quiz
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {step === 'quiz' && currentQuestion && (
          <section
            className="mx-auto max-w-3xl"
            aria-labelledby="question-heading"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {selectedModule?.code} · {selectedModule?.name}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Question {answers.length + 1} · Continue for as long as you
                  like
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-foreground">
                <span className="text-muted-foreground">Score </span>
                {currentScore} pts
              </div>
            </div>
            <p className="mb-7 text-xs text-muted-foreground">
              Questions rotate through this module’s practice bank. Your points
              are saved when you end the quiz.
            </p>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-primary">
                  <div className="h-5 w-5" />
                </span>
                <h3
                  id="question-heading"
                  className="pt-1 text-xl font-bold leading-8 text-foreground"
                >
                  {currentQuestion.prompt}
                </h3>
              </div>

              <div
                className="space-y-3"
                role="radiogroup"
                aria-label="Answer choices"
              >
                {currentQuestion.options.map((option, index) => {
                  const chosen = selectedOption === index
                  const correct = currentQuestion.correctOption === index
                  const answerClass = isSubmitted
                    ? correct
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
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${isSubmitted && correct ? 'border-green-600 bg-green-600 text-white' : chosen ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {isSubmitted && correct && (
                        <CheckCircle2Icon className="ml-auto h-5 w-5 text-green-600" />
                      )}
                      {isSubmitted && chosen && !correct && (
                        <XCircleIcon className="ml-auto h-5 w-5 text-destructive" />
                      )}
                    </button>
                  )
                })}
              </div>

              {isSubmitted && (
                <div
                  className={`mt-5 rounded-xl border p-4 text-sm ${selectedOption === currentQuestion.correctOption ? 'border-green-600/30 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100' : 'border-gold/40 bg-gold/10 text-foreground'}`}
                  role="status"
                >
                  <p className="font-bold">
                    {selectedOption === currentQuestion.correctOption
                      ? `Correct — +${currentQuestion.points} points`
                      : 'Not quite'}
                  </p>
                  <p className="mt-1 leading-5 opacity-90">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={endQuiz}
                  disabled={!answers.length || isLoading}
                  className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  End quiz & save points
                </button>
                {!isSubmitted ? (
                  <button
                    type="button"
                    onClick={submitAnswer}
                    disabled={selectedOption === null}
                    className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Submit answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Next question
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {step === 'complete' && result && (
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
              You answered {result.correctAnswers} of {result.totalQuestions}{' '}
              questions correctly in {selectedModule?.name}.
            </p>
            <div className="my-8 grid grid-cols-2 divide-x divide-border overflow-hidden rounded-xl border border-border text-left">
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  This quiz
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  +{result.awardedPoints} <span className="text-sm">pts</span>
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Total points
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {result.totalPoints} <span className="text-sm">pts</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetCompetition}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCcwIcon className="h-4 w-4" /> Choose another module
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
