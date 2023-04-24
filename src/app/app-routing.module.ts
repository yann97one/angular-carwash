import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrestaComponent } from './presta/presta.component';
import { ProductComponent } from './product/product.component';
import { DevisComponent } from './devis/devis.component';

const routes: Routes = [
  {path:"",component:LandingPageComponent},
  {path: "presta",component:PrestaComponent},
  {path:"product",component:ProductComponent},
  {path:"devis",component:DevisComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
