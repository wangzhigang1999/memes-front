import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {VoteComponent} from './submission/component/vote/vote.component';
import {HeaderComponent} from './public/header/header.component';
import {CardComponent} from './submission/component/card/card.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {TodayComponent} from './submission/today/today.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SafePipe} from './safe.pipe';
import {SubmitComponent} from './submission/submit/submit.component';
import {UuidInterceptor} from "./uuid.interceptor";
import {HistoryComponent} from './submission/history/history.component';
import {ReviewComponent} from './review/review.component';
import {StatisticComponent} from './statistic/statistic.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {FixMenuComponent} from './public/fix-menu/fix-menu.component';
import {AuthGuard} from "./auth.guard";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {EndlessComponent} from './submission/endless/endless.component';
import {TopComponent} from './submission/component/top/top.component';
import {NewsCardComponent} from './news/news-card/news-card.component';
import {NewsHomeComponent} from './news/news-home/news-home.component';
import {NewsTodayComponent} from './news/news-today/news-today.component';
import {EndComponent} from './public/end/end.component';
import {SearchComponent} from './search/search.component';
import {TruncatePipe} from './truncate.pipe';
import {NgOptimizedImage} from "@angular/common";
import {MarkdownModule} from "ngx-markdown";
import {ShareComponent} from "./share/share.component";

const routes: Routes = [
  {path: '', component: EndlessComponent},
  {path: 'search', component: SearchComponent},
  {path: 'news', component: NewsHomeComponent},
  {path: 'history-today', component: NewsTodayComponent},
  {path: 'endless', component: EndlessComponent},
  {path: 'today', component: TodayComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'review', component: ReviewComponent},
  {path: 'statistic', component: StatisticComponent, canActivate: [AuthGuard]},
  {path: 'share/:type/:id', component: ShareComponent},
  {path: '**', component: EndlessComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    VoteComponent,
    HeaderComponent,
    CardComponent,
    TodayComponent,
    SafePipe,
    SubmitComponent,
    HistoryComponent,
    ReviewComponent,
    StatisticComponent,
    FixMenuComponent,
    EndlessComponent,
    TopComponent,
    NewsCardComponent,
    NewsHomeComponent,
    NewsTodayComponent,
    EndComponent,
    SearchComponent,
    TruncatePipe,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    MarkdownModule.forRoot()
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
