export interface Response {
  "code": number,
  "message": string,
  "data": any

  // add constructor
  constructor(code: number, message: string, data: any): Response
}
