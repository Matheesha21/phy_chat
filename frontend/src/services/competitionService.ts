import { httpClient } from './httpClient'

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
  answers: { questionId: string; selectedOption: number }[]
}

export interface QuizResult {
  awardedPoints: number
  correctAnswers: number
  totalQuestions: number
  totalPoints: number
}

interface ModuleDto {
  id: string
  year: StudyYear
  code: string
  name: string
  description: string
  question_count: number
}

interface QuestionDto {
  id: string
  module_id: string
  prompt: string
  options: string[]
  correct_option: number
  explanation: string
  points: number
}

interface SubmitResultDto {
  awarded_points: number
  correct_answers: number
  total_questions: number
  total_points: number
}

interface LeaderboardEntryDto {
  rank: number
  student_id: string
  student_name: string
  points: number
  quizzes_completed: number
  is_current_student: boolean
}

const toModule = (dto: ModuleDto): PhysicsModule => ({
  id: dto.id,
  year: dto.year,
  code: dto.code,
  name: dto.name,
  description: dto.description,
  questionCount: dto.question_count,
})

const toQuestion = (dto: QuestionDto): QuizQuestion => ({
  id: dto.id,
  moduleId: dto.module_id,
  prompt: dto.prompt,
  options: dto.options,
  correctOption: dto.correct_option,
  explanation: dto.explanation,
  points: dto.points,
})

const toResult = (dto: SubmitResultDto): QuizResult => ({
  awardedPoints: dto.awarded_points,
  correctAnswers: dto.correct_answers,
  totalQuestions: dto.total_questions,
  totalPoints: dto.total_points,
})

const toLeaderboardEntry = (dto: LeaderboardEntryDto): LeaderboardEntry => ({
  rank: dto.rank,
  studentId: dto.student_id,
  studentName: dto.student_name,
  points: dto.points,
  quizzesCompleted: dto.quizzes_completed,
  isCurrentStudent: dto.is_current_student,
})

export const competitionService = {
  async getModules(year: StudyYear): Promise<PhysicsModule[]> {
    const modules = await httpClient.get<ModuleDto[]>(`/competitions/modules?year=${year}`)
    return modules.map(toModule)
  },

  async getQuestions(moduleId: string): Promise<QuizQuestion[]> {
    const questions = await httpClient.get<QuestionDto[]>(
      `/competitions/modules/${encodeURIComponent(moduleId)}/questions`,
    )
    return questions.map(toQuestion)
  },

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const result = await httpClient.post<SubmitResultDto>('/competitions/submit', {
      module_id: submission.moduleId,
      answers: submission.answers.map((answer) => ({
        question_id: answer.questionId,
        selected_option: answer.selectedOption,
      })),
    })
    return toResult(result)
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const entries = await httpClient.get<LeaderboardEntryDto[]>('/competitions/leaderboard')
    return entries.map(toLeaderboardEntry)
  },
}
