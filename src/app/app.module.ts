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
import {EditorComponent} from './doc/editor/editor.component';
import {DocComponent} from './doc/doc.component';
import {DocCardComponent} from './doc/doc-card/doc-card.component';
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path: '', component: TodayComponent,},
  {path: 'today', component: TodayComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'review', component: ReviewComponent},
  {path: 'statistic', component: StatisticComponent, canActivate: [AuthGuard]},
  {path: 'docs', component: DocComponent},
  {path: 'editor', component: EditorComponent},
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
    EditorComponent,
    DocComponent,
    DocCardComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule
  ],
  providers: [
    // {
    //   provide: ErrorHandler,
    //   useValue: Sentry.createErrorHandler({
    //     showDialog: true,
    //   }),
    // },
    // {
    //   provide: Sentry.TraceService,
    //   deps: [Router],
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => () => {
    //   },
    //   deps: [Sentry.TraceService],
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS, useClass: UuidInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
