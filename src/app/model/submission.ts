import { MediaContent } from './media-content'

export interface Submission {
  id: number // Assuming Long in Java translates to number in TypeScript
  mediaContentIdList: number[] // Assuming Long in Java translates to number in TypeScript
  likesCount: number
  dislikesCount: number
  tags: string[]
  createdAt: string // Assuming LocalDateTime translates to string (ISO 8601 format)
  updatedAt: string // Assuming LocalDateTime translates to string (ISO 8601 format)
  mediaContentList: MediaContent[] // Optional because it's marked as `exist = false` in Java
}
