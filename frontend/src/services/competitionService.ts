import { delay } from './api'

export type StudyYear = 1 | 2 | 3 | 4

export interface PhysicsModule {
  id: string
  year: StudyYear
  code: string
  name: string
  description: string
  questionCount: number
}

export interface QuizQuestion {
  id: string
  moduleId: string
  prompt: string
  options: string[]
  correctOption: number
  explanation: string
  points: number
}

export interface LeaderboardEntry {
  rank: number
  studentId: string
  studentName: string
  points: number
  quizzesCompleted: number
  isCurrentStudent?: boolean
}

export interface QuizSubmission {
  moduleId: string
  studentId: string
  studentName: string
  answers: { questionId: string; selectedOption: number }[]
}

export interface QuizResult {
  awardedPoints: number
  correctAnswers: number
  totalQuestions: number
  totalPoints: number
}

const currentStudent = {
  studentId: 'PS/2021/042',
  studentName: 'Kasun Fernando',
}

const modules: PhysicsModule[] = [
  {
    id: 'foundation-mechanics',
    year: 1,
    code: 'PHY 101',
    name: 'Classical Mechanics',
    description: 'Motion, forces, work, and energy fundamentals.',
    questionCount: 3,
  },
  {
    id: 'foundation-waves',
    year: 1,
    code: 'PHY 102',
    name: 'Waves & Optics',
    description: 'Oscillations, wave behaviour, and basic optics.',
    questionCount: 3,
  },
  {
    id: 'applied-electricity',
    year: 2,
    code: 'PHY 204',
    name: 'Applied Electricity',
    description:
      'Circuit analysis, electrostatics, and practical electrical systems.',
    questionCount: 3,
  },
  {
    id: 'thermal-physics',
    year: 2,
    code: 'PHY 205',
    name: 'Thermal Physics',
    description: 'Heat, thermodynamic laws, and thermal processes.',
    questionCount: 3,
  },
  {
    id: 'quantum-physics',
    year: 3,
    code: 'PHY 306',
    name: 'Quantum Physics',
    description: 'Wave functions, uncertainty, and atomic systems.',
    questionCount: 3,
  },
  {
    id: 'electromagnetic-theory',
    year: 3,
    code: 'PHY 307',
    name: 'Electromagnetic Theory',
    description: 'Fields, Maxwell’s equations, and electromagnetic waves.',
    questionCount: 3,
  },
  {
    id: 'solid-state',
    year: 4,
    code: 'PHY 408',
    name: 'Solid State Physics',
    description: 'Crystal structures, semiconductors, and modern materials.',
    questionCount: 3,
  },
]

const questions: QuizQuestion[] = [
  {
    id: 'ae-1',
    moduleId: 'applied-electricity',
    prompt:
      'A 12 V source is connected across a 4 Ω resistor. What current flows through the resistor?',
    options: ['0.33 A', '3 A', '16 A', '48 A'],
    correctOption: 1,
    explanation: 'Ohm’s law gives I = V/R = 12/4 = 3 A.',
    points: 10,
  },
  {
    id: 'ae-2',
    moduleId: 'applied-electricity',
    prompt: 'Which component primarily stores energy in an electric field?',
    options: ['Resistor', 'Inductor', 'Capacitor', 'Diode'],
    correctOption: 2,
    explanation:
      'A capacitor stores electrical potential energy in the electric field between its plates.',
    points: 10,
  },
  {
    id: 'ae-3',
    moduleId: 'applied-electricity',
    prompt:
      'Two 6 Ω resistors are connected in parallel. What is their equivalent resistance?',
    options: ['12 Ω', '6 Ω', '3 Ω', '1.5 Ω'],
    correctOption: 2,
    explanation:
      'For identical parallel resistors, the equivalent is R/2: 6 Ω / 2 = 3 Ω.',
    points: 10,
  },
  {
    id: 'cm-1',
    moduleId: 'foundation-mechanics',
    prompt: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctOption: 1,
    explanation: 'The newton (N) is the SI unit of force.',
    points: 10,
  },
  {
    id: 'cm-2',
    moduleId: 'foundation-mechanics',
    prompt: 'An object moves with constant velocity. Its resultant force is:',
    options: [
      'Constant and positive',
      'Zero',
      'Increasing',
      'Equal to its mass',
    ],
    correctOption: 1,
    explanation:
      'By Newton’s first law, constant velocity means zero resultant force.',
    points: 10,
  },
  {
    id: 'cm-3',
    moduleId: 'foundation-mechanics',
    prompt: 'Kinetic energy depends on which quantity squared?',
    options: ['Mass', 'Force', 'Velocity', 'Displacement'],
    correctOption: 2,
    explanation: 'Kinetic energy is ½mv², so it depends on velocity squared.',
    points: 10,
  },
]

const fallbackQuestion = (module: PhysicsModule): QuizQuestion[] =>
  Array.from({ length: 3 }, (_, index) => ({
    id: `${module.id}-${index + 1}`,
    moduleId: module.id,
    prompt: `Which area is most central to ${module.name}?`,
    options: [
      'The concepts introduced in this module',
      'Only laboratory safety',
      'The history of architecture',
      'Literary analysis',
    ],
    correctOption: 0,
    explanation: `${module.name} questions focus on the physical principles taught in this module.`,
    points: 10,
  }))

const scoreStorageKey = 'usj-physics-competition-score'

const getSavedScore = (): number => {
  const saved = window.localStorage.getItem(scoreStorageKey)
  const score = Number(saved)
  return Number.isFinite(score) && score > 0 ? score : 0
}

export const competitionService = {
  currentStudent,

  async getModules(year: StudyYear): Promise<PhysicsModule[]> {
    await delay(450)
    return modules.filter((module) => module.year === year)
  },

  async getQuestions(moduleId: string): Promise<QuizQuestion[]> {
    await delay(350)
    const selectedModule = modules.find((module) => module.id === moduleId)
    const moduleQuestions = questions.filter(
      (question) => question.moduleId === moduleId,
    )
    return moduleQuestions.length
      ? moduleQuestions
      : selectedModule
        ? fallbackQuestion(selectedModule)
        : []
  },

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    await delay(500)
    const moduleQuestions = questions.filter(
      (question) => question.moduleId === submission.moduleId,
    )
    const activeQuestions =
      moduleQuestions.length > 0
        ? moduleQuestions
        : fallbackQuestion(
            modules.find((module) => module.id === submission.moduleId) ??
              modules[0],
          )
    const awardedPoints = submission.answers.reduce((total, answer) => {
      const question = activeQuestions.find(
        (item) => item.id === answer.questionId,
      )
      return question && question.correctOption === answer.selectedOption
        ? total + question.points
        : total
    }, 0)
    const updatedScore = getSavedScore() + awardedPoints
    window.localStorage.setItem(scoreStorageKey, String(updatedScore))

    return {
      awardedPoints,
      correctAnswers: submission.answers.filter((answer) => {
        const question = activeQuestions.find(
          (item) => item.id === answer.questionId,
        )
        return question?.correctOption === answer.selectedOption
      }).length,
      totalQuestions: submission.answers.length,
      totalPoints: updatedScore,
    }
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(500)
    const entries: LeaderboardEntry[] = [
      {
        rank: 1,
        studentId: 'PS/2020/011',
        studentName: 'A. Wijesinghe',
        points: 320,
        quizzesCompleted: 14,
      },
      {
        rank: 2,
        studentId: 'PS/2021/068',
        studentName: 'N. Samarawickrama',
        points: 280,
        quizzesCompleted: 12,
      },
      {
        rank: 3,
        studentId: 'PS/2021/019',
        studentName: 'S. Jayasekara',
        points: 240,
        quizzesCompleted: 10,
      },
      {
        rank: 4,
        studentId: 'PS/2022/077',
        studentName: 'M. Perera',
        points: 190,
        quizzesCompleted: 8,
      },
      {
        rank: 0,
        studentId: currentStudent.studentId,
        studentName: currentStudent.studentName,
        points: getSavedScore(),
        quizzesCompleted: getSavedScore() ? Math.ceil(getSavedScore() / 30) : 0,
        isCurrentStudent: true,
      },
    ]

    return entries
      .sort((first, second) => second.points - first.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  },
}
