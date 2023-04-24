import { Component, OnInit } from '@angular/core';
import { ApiServiceService, Prestation } from '../api-service.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-presta',
  templateUrl: './presta.component.html',
  styleUrls: ['./presta.component.scss']
})
export class PrestaComponent implements OnInit {
  dataSource!: Prestation[];
  constructor( private apiService: ApiServiceService) { }

  ngOnInit(): void {
    const callbackGPT = (data: Prestation[])=>{
      if(data && data.length > 0){
        this.dataSource = data;
      }
    };

    this.apiService.getPresta((data: Prestation[])=>{
      callbackGPT(data);
    })


    $(document).on('scroll', function() {
      var pageTop = $(document).scrollTop();
      var windowHeight = $(window).height();
      var pageBottom = 0; // initialize to a value that is less than the position of the first card
      if (pageTop !== undefined && windowHeight !== undefined) {
          pageBottom = pageTop + windowHeight;
      }
      var cards = $(".card-container");
      if (cards.length > 0) { // make sure there is at least one card element
          var firstCard = cards[0];
          var firstCardTop = $(firstCard).position().top;
          if (firstCardTop < pageBottom) {
              $(firstCard).addClass("visible");
          } else {
              $(firstCard).removeClass("visible");
          }
      }
      for (var i = 1; i < cards.length; i++) {
          var card = cards[i];
          if ($(card).position().top < pageBottom) {
              $(card).addClass("visible");
          } else {
              $(card).removeClass("visible");
          }
      }
  });
  
  
  }

}
