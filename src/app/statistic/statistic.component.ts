import {Component} from '@angular/core';
import {AdminService} from "../service/admin.service";
import {Response} from "../model/response";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent {

  statistic!: any;

  reqNumber = 0;
  averageCost: number = 0;
  urlCountList!: any;
  uuidCountList!: any;
  date: number;

  protected readonly Math = Math;

  constructor(private service: AdminService) {
    let start = new Date("2023-03-11");
    let end = new Date();
    // find the gap between start and end
    // @ts-ignore
    let gap = (end - start) / 1000 / 60 / 60 / 24;
    this.date = Math.round(gap);
    this.refresh();

  }


  refresh() {
    this.service.getStatistics().subscribe(
      (response: Response) => {
        this.statistic = response.data;
        this.reqNumber = this.statistic.reqNumber;

        // keep .2f after point
        this.averageCost = Math.round(this.statistic.averageCost * 10) / 10;
        this.uuidCountList = this.statistic.uuidCountMap;

        // filter some url
        this.urlCountList = this.mergeVoteCount(
          this.statistic.urlCountMap.filter((item: any) => {
            return !item._id.includes("statistic") && !item._id.includes("review") && !item._id.includes("release") && !item._id.includes("admin");
          })).sort((a: any, b: any) => {
          return b.count - a.count
        })
      }
    )
  }

  count(map: Object) {
    // count the number of key-value pairs in map
    let count = 0;
    for (let key in map) {
      count++;
    }
    return count;
  }


  replace(key: string) {
    return key.replace("https://api.memes.bupt.site", "")
      .replace("http://api.memes.bupt.site", "")
    // .replace("http://100.68.68.47:8080", "")
  }

  timestampToHHMM(timestamp: number) {
    let date = new Date(timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes();
    return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute);
  }

  msConvert(ms: number) {
    // if <1000ms, return ms
    if (ms < 1000) {
      return Math.round(ms * 100) / 100 + " ms"
    } else {
      return Math.round(ms / 1000 * 10) / 10 + " s"
    }
  }

  top(k: number, list: any[]) {
    try {
      let max = Math.min(k, list.length)
      return list.slice(0, max)
    } catch (e) {
      return []
    }
  }

  mergeVoteCount(list: any[]): any[] {
    let obj = {_id: '/submission/vote', count: 0, avgTimecost: 0, maxTimecost: 0, minTimecost: 0}
    let totalTimeCost = 0;
    for (let item of list) {
      if (item._id.includes("/submission/vote")) {
        obj.count += item.count
        totalTimeCost += item.avgTimecost * item.count
        obj.maxTimecost = Math.max(obj.maxTimecost, item.maxTimecost)
        obj.minTimecost = Math.min(obj.minTimecost, item.minTimecost)
      }
    }
    obj.avgTimecost = Math.round(totalTimeCost / obj.count * 10) / 10

    // remove all '/submission/vote/1630697354/true'
    list = list.filter((item: any) => {
      return !item._id.includes("/submission/vote")
    })

    // add '/submission/vote' into list
    list.push(obj)
    return list
  }
}


