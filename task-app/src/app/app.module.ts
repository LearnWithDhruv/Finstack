import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesLogComponent } from './components/sales-log/sales-log.component';
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';
import { UniquePipe } from './unique.pipe';
import { FilterByDatePipe } from './filter-by-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SalesLogComponent,
    NewTaskModalComponent,
    UniquePipe,
    FilterByDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }