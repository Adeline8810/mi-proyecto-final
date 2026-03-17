import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'administrar-preguntas',
    loadComponent: () =>
      import('./administrar-preguntas/administrar-preguntas.component').then(m => m.AdministrarPreguntasComponent)
  },
  {
    path: 'ver-usuarios',
    loadComponent: () =>
      import('./ver-usuarios/ver-usuarios.component').then(m => m.VerUsuariosComponent)
  },
  {
    path: 'ver-respuestas',
    loadComponent: () =>
      import('./ver-respuestas/ver-respuestas.component').then(m => m.VerRespuestasComponent)
  },
  { path: '**', redirectTo: '/admin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
