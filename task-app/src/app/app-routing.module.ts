import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesLogComponent } from './components/sales-log/sales-log.component';

const routes: Routes = [
  { path: '', redirectTo: '/sales-log', pathMatch: 'full' },
  { path: 'sales-log', component: SalesLogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }