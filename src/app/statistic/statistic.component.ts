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
    // 查找 /api 的位置
    const apiIndex = url.indexOf('/api/')

    // 如果找到了 /api
    if (apiIndex !== -1) {
      // 返回 /api 及其之后的部分
      return url.substring(apiIndex)
    } else {
      // 如果没有找到 /api，返回原始 URL
      return url
    }
  }
}
