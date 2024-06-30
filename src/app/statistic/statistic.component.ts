import {Component} from '@angular/core';
import {AdminService} from "../service/admin.service";
import {Response} from "../model/response";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent {

  reqNumber = 0;
  averageCost: number = 0;
  urlCountList!: any;
  uuidCountList!: any;
  date: number;

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
        let statistic = response.data;
        this.reqNumber = statistic.reqNumber;

        // keep .2f after point
        this.averageCost = Math.round(statistic.averageCost * 10) / 10;
        this.uuidCountList = statistic.uuidCountMap;

        // filter some url
        let tmp = statistic.urlCountMap.filter((item: any) => {
          return !item.url.includes("admin")
        })

        // remove host
        tmp.forEach((item: any) => {
          const regex = /(https?:\/\/)?[^\/:]+(:[0-9]+)?\//;
          item.url = item.url.replace(regex, "/");
        })

        this.urlCountList = this.mergeCounts(tmp).sort(
          (a: any, b: any) => {
            return b.count - a.count;
          }
        )

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


  timestampToHHMM(timestamp: number) {
    let date = new Date(timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes();
    return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute);
  }

  msConvert(ms: number) {
    return Math.round(ms * 100) / 100
  }

  top(k: number, list: any[]) {
    try {
      let max = Math.min(k, list.length)
      return list.slice(0, max)
    } catch (e) {
      return []
    }
  }

  mergeCounts(list: any[]): any[] {
    const merge = (regex: RegExp, idFilter: string, method: string, url: string): any => {
      let obj = {method: method, url: url, count: 0, avg: 0, max: 0, min: 0};
      let totalTimeCost = 0;

      for (let item of list) {
        if (regex.test(item.url) && item.method === method) {
          obj.count += item.count;
          totalTimeCost += item.avg * item.count;
          obj.max = Math.max(obj.max, item.max);
          obj.min = Math.min(obj.min, item.min);
        }
      }

      obj.avg = Math.round(totalTimeCost / obj.count * 10) / 10;

      list = list.filter((item: any) => !regex.test(item.url));

      // Remove specified substring from _id
      list.forEach((item: any) => {
        item.url = item.url.replace(idFilter, "");
      });

      list.push(obj);
    };

    merge(/\/submission\/feedback\/[0-9a-z]+\/(like|dislike)/, "/https?:\/\/[0-9a-z.:]+/", "POST", '/submission/feedback');
    merge(/\/news\/month\/[0-9]{2}/, "/news/date", "GET", '/news/date');
    merge(/\/submission\/id\/[0-9a-z]+/, "/submission/id/", "GET", '/submission/id');
    merge(/\/submission\/similar\/[0-9a-z]+/, "/submission/similar/", "GET", '/submission/similar');

    return list.filter(item => item.count > 0)
  }

}


