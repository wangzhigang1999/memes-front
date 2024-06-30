import {NgOptimizedImage} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MarkdownModule} from "ngx-markdown";
import {AppComponent} from './app.component';
import {AuthGuard} from "./auth.guard";
import {NewsCardComponent} from './news/news-card/news-card.component';
import {NewsHomeComponent} from './news/news-home/news-home.component';
import {NewsTodayComponent} from './news/news-today/news-today.component';
import {EndComponent} from './public/end/end.component';
import {FixMenuComponent} from './public/fix-menu/fix-menu.component';
import {HeaderComponent} from './public/header/header.component';
import {ReviewComponent} from './review/review.component';
import {SafePipe} from './safe.pipe';
import {SearchComponent} from './search/search.component';
import {ShareComponent} from "./share/share.component";
import {StatisticComponent} from './statistic/statistic.component';
import {CardComponent} from './submission/component/card/card.component';
import {TopComponent} from './submission/component/top/top.component';
import {FeedbackComponent} from './submission/component/feedback/feedback.component';
import {EndlessComponent} from './submission/endless/endless.component';
import {HistoryComponent} from './submission/history/history.component';
import {SimilarComponent} from "./submission/similar/similar.component";
import {SubmitComponent} from './submission/submit/submit.component';
import {TodayComponent} from './submission/today/today.component';
import {TruncatePipe} from './truncate.pipe';
import {UUIDInterceptor} from "./uuid.interceptor";
import {NgxMasonryModule} from "ngx-masonry";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ConfigComponent} from "./config/config.component";
import {LazyLoadDirective} from "./lazy-load.directive";
import {SearchCardComponent} from "./search/search-card/search-card.component";

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
  {path: 'similar/:id', component: SimilarComponent},
  {path: 'config', component: ConfigComponent},
  {path: '**', component: EndlessComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
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
    ShareComponent,
    SimilarComponent,
    LazyLoadDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    NgxMasonryModule,
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    MarkdownModule.forRoot(),
    SearchCardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: UUIDInterceptor, multi: true
    }
  ],
  exports: [
    CardComponent,
    TruncatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
