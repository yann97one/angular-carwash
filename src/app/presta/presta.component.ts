import { Component, OnInit } from '@angular/core';
import { ApiServiceService, Prestation } from '../api-service.service';

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


  
  
  }

}
