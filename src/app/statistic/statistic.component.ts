import { Component, OnInit } from '@angular/core'
import { AdminService } from '../service/admin.service'
import { Response } from '../model/response'
import { UidStat, UrlStat, VisitStatistic } from '../model/visit-statistic'
import { differenceInDays } from 'date-fns'

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
})
export class StatisticComponent implements OnInit {
  reqNumber = 0
  averageCost: number = 0
  urlStats: UrlStat[] = []
  uuidStats: UidStat[] = []
  date: number | undefined

  constructor(private service: AdminService) {}

  ngOnInit() {
    this.calculateDateGap()
    this.reload()
  }

  calculateDateGap() {
    const startDate = new Date('2023-03-11')
    const endDate = new Date()
    this.date = differenceInDays(endDate, startDate)
  }

  reload() {
    this.service.getVisitStatistics().subscribe({
      next: (response: Response) => {
        const statistic: VisitStatistic = response.data

        this.reqNumber = statistic.requestNumber
        this.averageCost = Math.round(statistic.averageLatency * 10) / 10

        this.uuidStats = this.sortByCount(statistic.uidStats)
        this.urlStats = this.sortByCount(statistic.urlStat)
      },
      error: (error: any) => {
        console.error('Error fetching statistics:', error)
      },
    })
  }

  sortByCount<T extends { count: number }>(array: T[]): T[] {
    return array.sort((a, b) => b.count - a.count)
  }

  shorten(url: string): string {
    // split by /api
    const parts = url.split('/api')
    if (parts.length > 1) {
      return parts[1]
    } else {
      return url
    }
  }
}
