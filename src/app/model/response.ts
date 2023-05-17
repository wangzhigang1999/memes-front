export interface Response {
  "code": number,
  "message": string,
  "data": any

  constructor(code: number, message: string, data: any): Response
}
