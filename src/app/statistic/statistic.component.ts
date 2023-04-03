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

  reqNumber!: number;
  averageCost!: number;
  maxCost!: number;
  minCost!: number;
  ipCountList!: any;
  urlCountList!: any;
  uuidCountList!: any;


  constructor(private service: AdminService) {
  }

  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.service.getStatistics().subscribe(
      (response: Response) => {
        this.statistic = response.data;
        this.reqNumber = this.statistic.reqNumber;

        // keep .2f after point
        this.averageCost = Math.round(this.statistic.averageCost * 100) / 100;
        this.maxCost = Math.round(this.statistic.maxCost * 100) / 100;
        this.minCost = Math.round(this.statistic.minCost * 100) / 100;

        this.ipCountList = this.statistic.ipCountMap;
        this.urlCountList = this.statistic.urlCountMap;
        this.uuidCountList = this.statistic.uuidCountMap;

        // filter some url
        this.urlCountList = this.urlCountList.filter((item: any) => {
          return item.key != "https://api.memes.bupt.site/submission/statistic"
            && item.key != "https://api.memes.bupt.site/submission/review"
            && item.key != "https://api.memes.bupt.site/submission/release"
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


  replace(key: any) {
    return key.replace("https://api.memes.bupt.site", "")
  }

  top(k: number, list: any[]) {
    try {
      let max = Math.min(k, list.length)
      return list.slice(0, max)
    } catch (e) {
      return []
    }
  }
}


