export interface Submission {
  "submissionType": string,
  "url": string,
  "hash": number,
  "name": string,
  "deleted": boolean,
  "timestamp": number,
  "up": number,
  "down": number

  // add constructor
  constructor(submissionType: string, url: string, hash: number, name: string, deleted: boolean, timestamp: number, up: number, down: number): Submission

}
