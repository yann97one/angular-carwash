import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ApiServiceService, Prestation } from '../api-service.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private apiService: ApiServiceService, private elRef: ElementRef) { }
  dataSource!: Prestation[];
  productSource!: Prestation[];

  ngOnInit(): void {
    const callbackGPT = (data: Prestation[])=>{
      if(data && data.length > 0){
        this.dataSource = data;
      }
    };

   
    this.apiService.getProducts((data: Prestation[])=>{
      callbackGPT(data);
    })


    //////////////Prestations///////////////
    const callback = (data: Prestation[])=>{
      if(data && data.length > 0){
        this.productSource = data;
      }
    };

    this.apiService.getPresta((data: Prestation[])=>{
      callback(data);
    })

  
  }


  

}
