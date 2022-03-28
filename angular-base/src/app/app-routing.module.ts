import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyComponent } from 'qiankun-ng-common';
import { HeroComponent } from './hero/hero.component';

const routes: Routes = [
  {
    path: 'angular-sub',
    component: EmptyComponent
  },
  {
    path: 'angular-sub/home',
    component: EmptyComponent
  },
  {
    path: 'angular-sub2',
    component: EmptyComponent
  },
  {
    path: 'hero',
    component:HeroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
