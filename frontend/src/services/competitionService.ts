import { httpClient } from './httpClient'

export type StudyYear = 1 | 2 | 3 | 4

export interface PhysicsModule {
  code: string
  name: string
}

export interface CareerPath {
  id: string
  label: string
  description: string
}

export const PHYSICS_MODULES: Record<StudyYear, PhysicsModule[]> = {
  1: [
    { code: 'PHY 1032', name: 'Mechanics' },
    { code: 'PHY 1032', name: 'Properties of Matter' },
    { code: 'PHY 1041', name: 'Electricity and Magnetism' },
    { code: 'PHY 1051', name: 'Waves and Vibration' },
    { code: 'PHY 1072', name: 'Analog and Digital Electronics' },
    { code: 'PHY 1081', name: 'Special Theory of Relativity' },
    { code: 'PHY 1091', name: 'Atomic Physics' },
  ],
  2: [
    { code: 'PHY 2022', name: 'Applied Electricity' },
    { code: 'PHY 2012', name: 'Optics I' },
    { code: 'PHY 206', name: 'Mathematical Physics I' },
    { code: 'PHY 205', name: 'Statistical Mechanics I' },
    { code: 'PHY 207', name: 'Special Theory of Relativity' },
    { code: 'PHY 208', name: 'Atomic Physics & Nuclear Physics' },
  ],
  3: [
    { code: 'PHY 306', name: 'Solid State Physics I' },
    { code: 'PHY 302', name: 'Quantum Mechanics I' },
    { code: 'PHY 301', name: 'Electromagnetic Theory I' },
    { code: 'PHY 305', name: 'Geophysics I' },
    { code: 'PHY 314', name: 'Astronomy' },
    { code: 'PHY 310', name: 'Space Physics I' },
    { code: 'PHY 309', name: 'Introduction to Microprocessors' },
    { code: 'PHY 321', name: 'Medical Physics' },
    { code: 'PHY 311', name: 'Introduction to Computer Hardware' },
    { code: 'PHY 318', name: 'Nanophysics' },
  ],
  4: [
    { code: 'PHY 452', name: 'Statistical Physics II' },
    { code: 'PHY 453', name: 'Microprocessor and Computer Interfacing' },
    { code: 'PHY 455', name: 'Internship' },
    { code: 'PHY 457', name: 'Particle Physics and Instrumentation' },
    { code: 'PHY 462', name: 'Classical Mechanics' },
    { code: 'PHY 463', name: 'Nanophysics II' },
    { code: 'PHY 451', name: 'Electromagnetic Theory II' },
    { code: 'PHY 456', name: 'Quantum Mechanics II' },
    { code: 'PHY 458', name: 'Space and Atmospheric Physics' },
    { code: 'PHY 459', name: 'Computational Physics' },
    { code: 'PHY 460', name: 'Mathematical Physics III' },
  ],
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'research-physicist',
    label: 'Research Physicist',
    description: 'Great for academic passion',
  },
  {
    id: 'medical-physicist',
    label: 'Medical Physicist',
    description: 'Apply physics to healthcare and diagnostics',
  },
  {
    id: 'renewable-energy-engineer',
    label: 'Renewable Energy Engineer',
    description: 'Design and improve sustainable energy systems',
  },
  {
    id: 'accelerator-particle-physicist',
    label: 'Accelerator or Particle Physicist',
    description: 'Explore the fundamental building blocks of matter',
  },
  {
    id: 'space-aerospace-scientist',
    label: 'Space Scientist / Aerospace Engineer',
    description: 'Study and build for space and flight',
  },
  {
    id: 'semiconductor-physicist',
    label: 'Semiconductor Physicist',
    description: 'Work on the materials behind modern electronics',
  },
  {
    id: 'data-computational-physicist',
    label: 'Data Scientist / Computational Physicist',
    description: 'Model and simulate physical systems with data',
  },
]

const MAX_SELECTABLE_MODULES = 5

export interface SaveProfileRequest {
  year: StudyYear
  interestedModules: string[]
  careerGoal: string
}

export interface SaveProfileResult {
  message: string
  profileId: number
}

interface SaveProfileResponseDto {
  message: string
  profile_id: number
}

export interface QuizQuestion {
  id: number
  text: string
  options: string[]
}

interface GenerateQuestionResponseDto {
  question: {
    id: number
    text: string
    options: string[]
  }
}

export interface AnswerSubmission {
  questionId: number
  selectedAnswer: string
  timeTaken: number
}

export interface AnswerResult {
  correct: boolean
  correctAnswer: string
  currentScore: number
}

interface AnswerResponseDto {
  correct: boolean
  correct_answer: string
  current_score: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  correctAnswers: number
  wrongAnswers: number
  marks: number
}

interface LeaderboardEntryDto {
  rank: number
  username: string
  correct_answers: number
  wrong_answers: number
  marks: number
}

interface LeaderboardResponseDto {
  leaderboard: LeaderboardEntryDto[]
}

const toLeaderboardEntry = (dto: LeaderboardEntryDto): LeaderboardEntry => ({
  rank: dto.rank,
  username: dto.username,
  correctAnswers: dto.correct_answers,
  wrongAnswers: dto.wrong_answers,
  marks: dto.marks,
})

export const competitionService = {
  maxSelectableModules: MAX_SELECTABLE_MODULES,

  async saveProfile(profile: SaveProfileRequest): Promise<SaveProfileResult> {
    const result = await httpClient.post<SaveProfileResponseDto>('/profile', {
      year: profile.year,
      interested_modules: profile.interestedModules,
      career_goal: profile.careerGoal,
    })
    return { message: result.message, profileId: result.profile_id }
  },

  async generateQuestion(): Promise<QuizQuestion> {
    const result =
      await httpClient.post<GenerateQuestionResponseDto>('/quiz/generate')
    return {
      id: result.question.id,
      text: result.question.text,
      options: result.question.options,
    }
  },

  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResult> {
    const result = await httpClient.post<AnswerResponseDto>(
      `/quiz/${submission.questionId}/answer`,
      {
        question_id: submission.questionId,
        selected_answer: submission.selectedAnswer,
        time_taken: submission.timeTaken,
      },
    )
    return {
      correct: result.correct,
      correctAnswer: result.correct_answer,
      currentScore: result.current_score,
    }
  },

  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    const result = await httpClient.get<LeaderboardResponseDto>(
      `/leaderboard?limit=${limit}`,
    )
    return result.leaderboard.map(toLeaderboardEntry)
  },
}
