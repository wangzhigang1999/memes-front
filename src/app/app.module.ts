import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {VoteComponent} from './vote/vote.component';
import {HeaderComponent} from './header/header.component';
import {SubmissionCardComponent} from './submission-card/submission-card.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {TodayComponent} from './today/today.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {path: '', component: AppComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    VoteComponent,
    HeaderComponent,
    SubmissionCardComponent,
    TodayComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
