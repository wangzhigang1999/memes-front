export interface Submission {
  "id": string,
  "submissionType": string,
  "url": string,
  "content": string,
  "uploader": string,
  "hash": number,
  "name": string,
  "deleted": boolean,
  "timestamp": number,
  "up": number,
  "down": number

  // add constructor
  constructor(submissionType: string, url: string, hash: number, name: string, deleted: boolean, timestamp: number, up: number, down: number): Submission

  constructor(submissionType: string, url: string, uploader: string, hash: number, name: string, deleted: boolean, timestamp: number, up: number, down: number): Submission

}
