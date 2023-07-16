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
  maxCost!: number;
  minCost!: number;
  ipCountList!: any;
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
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.service.getStatistics().subscribe(
      (response: Response) => {
        this.statistic = response.data;
        this.reqNumber = this.statistic.reqNumber;

        // keep .2f after point
        this.averageCost = Math.round(this.statistic.averageCost * 10) / 10;
        this.maxCost = Math.round(this.statistic.maxCost * 100) / 100;
        this.minCost = Math.round(this.statistic.minCost * 100) / 100;

        this.ipCountList = this.statistic.ipCountMap;
        this.urlCountList = this.statistic.urlCountMap;
        this.uuidCountList = this.statistic.uuidCountMap;

        // filter some url
        this.urlCountList = this.mergeVoteCount(this.urlCountList.filter((item: any) => {
          // if contains "statistic", "review", "release", then filter
          return !item.key.includes("statistic") && !item.key.includes("review") && !item.key.includes("release") && !item.key.includes("admin");
        }))
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


  replace(key: any) {
    return key.replace("https://api.memes.bupt.site", "").replace("http://api.memes.bupt.site", "")
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
    // merge all '/submission/vote/***' into '/submission/vote'
    let map = new Map();
    map.set("/submission/vote", 0)
    for (let item of list) {
      if (item.key.includes("/submission/vote")) {
        map.set("/submission/vote", map.get("/submission/vote") + item.value)
      }
    }
    // remove all '/submission/vote/1630697354/true'
    list = list.filter((item: any) => {
      return !item.key.includes("/submission/vote")
    })
    // add '/submission/vote' into list
    list.push(map)
    return list
  }
}


