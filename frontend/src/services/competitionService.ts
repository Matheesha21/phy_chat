import { httpClient } from './httpClient'

export type StudyYear = 1 | 2 | 3 | 4

export interface PhysicsModule {
  code: string
  name: string
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

const MAX_SELECTABLE_MODULES = 5

export interface SaveProfileRequest {
  year: StudyYear
  interestedModules: string[]
  description?: string | null
}

export interface SaveProfileResult {
  id: number
  userId: number
  studyYear: number
  interestModules: string[]
  description: string | null
}

interface ProfileResponseDto {
  id: number
  user_id: number
  study_year: number
  interest_modules: string[]
  description: string | null
}

export interface QuizQuestion {
  id: number
  topic: string | null
  question: string
  options: string[]
}

interface QuizQuestionDto {
  id: number
  topic: string | null
  question: string
  options: string[]
}

export interface AnswerSubmission {
  quizId: number
  selectedOptionIndex: number
  timeTakenSeconds: number
}

export interface AnswerResult {
  quizId: number
  isCorrect: boolean
  correctOptionIndex: number
  scoreAwarded: number
}

interface AnswerResponseDto {
  quiz_id: number
  is_correct: boolean
  correct_option_index: number
  score_awarded: number
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
    const result = await httpClient.post<ProfileResponseDto>('/profile/', {
      study_year: profile.year,
      interest_modules: profile.interestedModules,
      description: profile.description ?? null,
    })
    return {
      id: result.id,
      userId: result.user_id,
      studyYear: result.study_year,
      interestModules: result.interest_modules,
      description: result.description,
    }
  },

  async generateQuestion(): Promise<QuizQuestion> {
    const result = await httpClient.post<QuizQuestionDto>('/quiz/generate')
    return {
      id: result.id,
      topic: result.topic,
      question: result.question,
      options: result.options,
    }
  },

  async submitAnswer(submission: AnswerSubmission): Promise<AnswerResult> {
    const result = await httpClient.post<AnswerResponseDto>(
      `/quiz/${submission.quizId}/answer`,
      {
        selected_option_index: submission.selectedOptionIndex,
        time_taken_seconds: submission.timeTakenSeconds,
      },
    )
    return {
      quizId: result.quiz_id,
      isCorrect: result.is_correct,
      correctOptionIndex: result.correct_option_index,
      scoreAwarded: result.score_awarded,
    }
  },

  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    const result = await httpClient.get<LeaderboardResponseDto>(
      `/leaderboard?limit=${limit}`,
    )
    return result.leaderboard.map(toLeaderboardEntry)
  },
}
