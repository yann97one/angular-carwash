import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService, Prestation } from '../api-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})


export class ProductComponent implements OnInit {
  itemId!:string;
  cols: string[] = [
    'nom',
    'caractéristiques',
    'description',
    'img_src',
    'prix',

  ]
  dataSource!: Prestation[];


  constructor( private apiService: ApiServiceService) { }

  ngOnInit(): void {
    const callbackGPT = (data: Prestation[])=>{
      if(data && data.length > 0){
        this.dataSource = data;
      }
    };


    this.apiService.getProducts((data: Prestation[])=>{
      callbackGPT(data);
    })

   
  }

  addToBasket(id:string){
       id = this.itemId;
      const basket = localStorage.setItem(id,'basket');
      

  }

  

}
