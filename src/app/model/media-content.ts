export enum DataType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  MARKDOWN = 'MARKDOWN',
}

export enum AiModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

export enum ContentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export interface MediaContent {
  id: number // Assuming Long maps to number in TypeScript.  Adjust if needed (e.g., string if using UUIDs)
  dataType: DataType
  dataContent: string
  userId: string
  checksum: string
  llmDescription: string
  llmModerationStatus: AiModerationStatus
  rejectionReason: string
  tags: string[]
  fileSize: number // Assuming Long maps to number in TypeScript.  Adjust if needed.
  metadata: { [key: string]: any } //  Using a generic object type for metadata
  status: ContentStatus
  createdAt: string // Using string as LocalDateTime maps to string
  updatedAt: string // Using string as LocalDateTime maps to string
  sharpReview: string
}

export interface MediaContentBuilder {
  id?: number
  dataType?: DataType
  dataContent?: string
  userId?: string
  checksum?: string
  llmDescription?: string
  llmModerationStatus?: AiModerationStatus
  rejectionReason?: string
  tags?: string[]
  fileSize?: number
  metadata?: { [key: string]: any }
  status?: ContentStatus
  createdAt?: string
  updatedAt?: string
  sharpReview?: string

  withId(id: number): MediaContentBuilder

  withDataType(dataType: DataType): MediaContentBuilder

  withDataContent(dataContent: string): MediaContentBuilder

  withUserId(userId: string): MediaContentBuilder

  withChecksum(checksum: string): MediaContentBuilder

  withLlmDescription(llmDescription: string): MediaContentBuilder

  withLlmModerationStatus(llmModerationStatus: AiModerationStatus): MediaContentBuilder

  withRejectionReason(rejectionReason: string): MediaContentBuilder

  withTags(tags: string[]): MediaContentBuilder

  withFileSize(fileSize: number): MediaContentBuilder

  withMetadata(metadata: { [key: string]: any }): MediaContentBuilder

  withStatus(status: ContentStatus): MediaContentBuilder

  withCreatedAt(createdAt: string): MediaContentBuilder

  withUpdatedAt(updatedAt: string): MediaContentBuilder

  withSharpReview(sharpReview: string): MediaContentBuilder

  build(): MediaContent
}

export class MediaContentImpl implements MediaContent {
  id: number
  dataType: DataType
  dataContent: string
  userId: string
  checksum: string
  llmDescription: string
  llmModerationStatus: AiModerationStatus
  rejectionReason: string
  tags: string[]
  fileSize: number
  metadata: { [key: string]: any }
  status: ContentStatus
  createdAt: string
  updatedAt: string
  sharpReview: string

  constructor(builder: MediaContentBuilder) {
    this.id = builder.id || 0 // Providing default value
    this.dataType = builder.dataType || DataType.IMAGE // Providing default value
    this.dataContent = builder.dataContent || '' // Providing default value
    this.userId = builder.userId || '' // Providing default value
    this.checksum = builder.checksum || '' // Providing default value
    this.llmDescription = builder.llmDescription || '' // Providing default value
    this.llmModerationStatus = builder.llmModerationStatus || AiModerationStatus.PENDING // Providing default value
    this.rejectionReason = builder.rejectionReason || '' // Providing default value
    this.tags = builder.tags || [] // Providing default value
    this.fileSize = builder.fileSize || 0 // Providing default value
    this.metadata = builder.metadata || {} // Providing default value
    this.status = builder.status || ContentStatus.PENDING // Providing default value
    this.createdAt = builder.createdAt || '' // Providing default value
    this.updatedAt = builder.updatedAt || '' // Providing default value
    this.sharpReview = builder.sharpReview || ''
  }
}

export class MediaContentBuilderImpl implements MediaContentBuilder {
  id?: number
  dataType?: DataType
  dataContent?: string
  userId?: string
  checksum?: string
  llmDescription?: string
  llmModerationStatus?: AiModerationStatus
  rejectionReason?: string
  tags?: string[]
  fileSize?: number
  metadata?: { [key: string]: any }
  status?: ContentStatus
  createdAt?: string
  updatedAt?: string
  sharpReview?: string

  withId(id: number): MediaContentBuilder {
    this.id = id
    return this
  }

  withDataType(dataType: DataType): MediaContentBuilder {
    this.dataType = dataType
    return this
  }

  withDataContent(dataContent: string): MediaContentBuilder {
    this.dataContent = dataContent
    return this
  }

  withUserId(userId: string): MediaContentBuilder {
    this.userId = userId
    return this
  }

  withChecksum(checksum: string): MediaContentBuilder {
    this.checksum = checksum
    return this
  }

  withLlmDescription(llmDescription: string): MediaContentBuilder {
    this.llmDescription = llmDescription
    return this
  }

  withLlmModerationStatus(llmModerationStatus: AiModerationStatus): MediaContentBuilder {
    this.llmModerationStatus = llmModerationStatus
    return this
  }

  withRejectionReason(rejectionReason: string): MediaContentBuilder {
    this.rejectionReason = rejectionReason
    return this
  }

  withTags(tags: string[]): MediaContentBuilder {
    this.tags = tags
    return this
  }

  withFileSize(fileSize: number): MediaContentBuilder {
    this.fileSize = fileSize
    return this
  }

  withMetadata(metadata: { [key: string]: any }): MediaContentBuilder {
    this.metadata = metadata
    return this
  }

  withStatus(status: ContentStatus): MediaContentBuilder {
    this.status = status
    return this
  }

  withCreatedAt(createdAt: string): MediaContentBuilder {
    this.createdAt = createdAt
    return this
  }

  withUpdatedAt(updatedAt: string): MediaContentBuilder {
    this.updatedAt = updatedAt
    return this
  }
  withSharpReview(sharpReview: string): MediaContentBuilder {
    this.sharpReview = sharpReview
    return this
  }

  build(): MediaContent {
    return new MediaContentImpl(this)
  }
}

// Example usage of builder (similar to Lombok's @Builder):
// const media = new MediaContentBuilderImpl().withId(123).withDataType(DataType.IMAGE).build();
