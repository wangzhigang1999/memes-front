// VisitStatistic.ts

export interface UidStat {
  uuid: string
  firstTime: number
  lastTime: number
  avg: number
  min: number
  max: number
  count: number
}

export interface UrlStat {
  url: string
  firstTime: number
  lastTime: number
  avg: number
  min: number
  max: number
  method: string
  count: number
}

export class VisitStatistic {
  requestNumber: number
  uidStats: UidStat[]
  averageLatency: number
  urlStat: UrlStat[]

  constructor(requestNumber: number, uidStat: UidStat[], averageLatency: number, urlStat: UrlStat[]) {
    this.requestNumber = requestNumber
    this.uidStats = uidStat
    this.averageLatency = averageLatency
    this.urlStat = urlStat
  }
}
