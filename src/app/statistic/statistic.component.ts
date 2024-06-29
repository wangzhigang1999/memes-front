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
          return !item._id.includes("admin")
        })

        // remove host
        tmp.forEach((item: any) => {
          const regex = /(https?:\/\/)?[^\/:]+(:[0-9]+)?\//;
          item._id = item._id.replace(regex, "/");
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

    list.forEach((item: any) => {
      item._id = item._id.replace(/\/http:\/\/[0-9a-z.:]+\//, "");
    })

    const merge = (regex: RegExp, idFilter: string, objId: string): any => {
      let obj = { _id: objId, count: 0, avgTimecost: 0, maxTimecost: 0, minTimecost: 0 };
      let totalTimeCost = 0;

      for (let item of list) {

        if (regex.test(item._id)) {
          obj.count += item.count;
          totalTimeCost += item.avgTimecost * item.count;
          obj.maxTimecost = Math.max(obj.maxTimecost, item.maxTimecost);
          obj.minTimecost = Math.min(obj.minTimecost, item.minTimecost);
        }
      }

      obj.avgTimecost = Math.round(totalTimeCost / obj.count * 10) / 10;

      list = list.filter((item: any) => !regex.test(item._id));

      // Remove specified substring from _id
      list.forEach((item: any) => {
        item._id = item._id.replace(idFilter, "");
      });

      list.push(obj);
    };

    merge(/\/submission\/feedback\/[0-9a-z]+\/(like|dislike)/, "/https?:\/\/[0-9a-z.:]+/", '/submission/feedback');
    merge(/\/post/, '/post', '/submission/post');
    merge(/\/submission\/date\/[0-9]{4}-[0-9]{2}-[0-9]{2}/, "/\/submission\/date/", '/submission/date');
    merge(/\/news\/month\/[0-9]{2}/, "/news/date", '/news/date');
    merge(/\/submission\/id\/[0-9a-z]+/, "/submission/id/", '/submission/id');
    merge(/\/submission\/similar\/[0-9a-z]+/, "/submission/similar/", '/submission/similar');

    return list;
  }

}


