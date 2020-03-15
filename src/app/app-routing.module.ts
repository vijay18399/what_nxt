import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'lang',
    loadChildren: () => import('./pages/lang/lang.module').then( m => m.LangPageModule)
  },
  {
    path: 'filter',
    loadChildren: () => import('./pages/filter/filter.module').then( m => m.FilterPageModule)
  },
  {
    path: 'tab',
    loadChildren: () => import('./pages/tab/tab.module').then( m => m.TabPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'selector',
    loadChildren: () => import('./pages/selector/selector.module').then( m => m.SelectorPageModule)
  },
  {
    path: 'gchat',
    loadChildren: () => import('./pages/gchat/gchat.module').then( m => m.GchatPageModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./pages/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'bot',
    loadChildren: () => import('./pages/bot/bot.module').then( m => m.BotPageModule)
  },
  {
    path: 'ginfo',
    loadChildren: () => import('./pages/ginfo/ginfo.module').then( m => m.GinfoPageModule)
  },
  {
    path: 'ocr',
    loadChildren: () => import('./pages/ocr/ocr.module').then( m => m.OcrPageModule)
  },
  {
    path: 'canvas',
    loadChildren: () => import('./pages/canvas/canvas.module').then( m => m.CanvasPageModule)
  },
  {
    path: 'uselector',
    loadChildren: () => import('./pages/uselector/uselector.module').then( m => m.UselectorPageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/result/result.module').then( m => m.ResultPageModule)
  },
  {
    path: 'spam',
    loadChildren: () => import('./pages/spam/spam.module').then( m => m.SpamPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
