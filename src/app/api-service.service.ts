import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
export interface Prestation {
  id?: string;
  nom: string;
  caracteristique: string;
  img_src:string;
  description: string;
  temps_estime: string;
  prise_rendez_vous: string;
  prix: string | any;

}
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
urlPresta = "http://testphp/API/api_devis_angular/api_presta.php";
urlProduit = "http://testphp/API/api_devis_angular/api_produit.php";
  constructor(private http:HttpClient) { }

  getProducts(callback : Function ){
    
    this.http.get<Prestation[]>(this.urlProduit,{responseType:'json',withCredentials:true,observe:'response'}).subscribe((data)=>{
      console.log(data);
      callback(data.body)
    });
  }

  getPresta(callback:Function){
     this.http.get<Prestation[]>(this.urlPresta,{responseType:"json",withCredentials:true,observe:'response'}).subscribe((data)=>{
      console.log(data);
      callback(data.body);
     });
  }
}
