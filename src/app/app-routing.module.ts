import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    canActivate: [AuthGuard],
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'songs',
    canActivate: [AuthGuard],
    loadChildren: './songs/songs.module#SongsPageModule'
  },
  {
    path: 'bookings',
    canActivate: [AuthGuard],
    loadChildren: './bookings/bookings.module#BookingsPageModule'
  },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'bookings', loadChildren: './bookings/bookings.module#BookingsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
