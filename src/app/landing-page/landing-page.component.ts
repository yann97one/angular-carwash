import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ApiServiceService, Prestation } from '../api-service.service';
//import * as $ from 'jquery';

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

  //   $(document).on('scroll', function() {
  //     var pageTop = $(document).scrollTop();
  //     var windowHeight = $(window).height();
  //     var pageBottom = 0; // initialize to a value that is less than the position of the first card
  //     if (pageTop !== undefined && windowHeight !== undefined) {
  //         pageBottom = pageTop + windowHeight;
  //     }
  //     var cards = $(".card-container");
  //     if (cards.length > 0) { // make sure there is at least one card element
  //         var firstCard = cards[0];
  //         var firstCardTop = $(firstCard).position().top;
  //         if (firstCardTop < pageBottom) {
  //             $(firstCard).addClass("visible");
  //         } else {
  //             $(firstCard).removeClass("visible");
  //         }
  //     }
  //     for (var i = 1; i < cards.length; i++) {
  //         var card = cards[i];
  //         if ($(card).position().top < pageBottom) {
  //             $(card).addClass("visible");
  //         } else {
  //             $(card).removeClass("visible");
  //         }
  //     }
  // });

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
