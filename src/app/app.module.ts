import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {VoteComponent} from './submission/vote/vote.component';
import {HeaderComponent} from './header/header.component';
import {SubmissionCardComponent} from './submission/submission-card/submission-card.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {TodayComponent} from './submission/today/today.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SafePipe} from './safe.pipe';
import {SubmitComponent} from './submission/submit/submit.component';
import {UuidInterceptor} from "./uuid.interceptor";
import {HistoryComponent} from './submission/history/history.component';
import {ReviewComponent} from './submission/review/review.component';
import {StatisticComponent} from './statistic/statistic.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {FixMenuComponent} from './fix-menu/fix-menu.component';
import {AuthGuard} from "./auth.guard";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {EndlessComponent} from './submission/endless/endless.component';
import { TopSubmissionComponent } from './submission/top-submission/top-submission.component';

const routes: Routes = [
  {path: '', component: EndlessComponent,},
  {path: 'endless', component: EndlessComponent},
  {path: 'today', component: TodayComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'review', component: ReviewComponent},
  {path: 'statistic', component: StatisticComponent, canActivate: [AuthGuard]},
  {path: '**', component: TodayComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    VoteComponent,
    HeaderComponent,
    SubmissionCardComponent,
    TodayComponent,
    SafePipe,
    SubmitComponent,
    HistoryComponent,
    ReviewComponent,
    StatisticComponent,
    FixMenuComponent,
    EndlessComponent,
    TopSubmissionComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule,
    InfiniteScrollModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: UuidInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
