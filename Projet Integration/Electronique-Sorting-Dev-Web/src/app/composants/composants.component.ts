import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { SupabaseCRUDService } from '../services/supabaseCRUD.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-composants',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatChipsModule, 
    MatGridListModule
  ],
  templateUrl: './composants.component.html',
  styleUrls: ['./composants.component.scss'],
})
export class ComposantsComponent implements OnInit {
  name!: string;
  quantity!: number;


  data: any[] = [];

  constructor(private supabaseCRUDService: SupabaseCRUDService, private router: Router) {}

  async getData() {
    try {
      // Fetch data from the Component table
      let response = await this.supabaseCRUDService.getComponentsWithDetails();
      // On vérifie si `response` est un tableau et s'il contient des objets ayant la clé `Name`
      if (Array.isArray(response)) {
        this.data = response;

        for(let unComposant of this.data){
          let typeRestock = await this.supabaseCRUDService.getTypeComponent(unComposant.Type_id);
          unComposant.notifQuantite = typeRestock?.Restock_value;

        }

      } else {
        console.warn('No valid data received');
      }
    } catch (error) {
      console.error('Error fetching data from Component table:', error);
    }
  }

  ngOnInit() {
    // this.supabaseService.login();

    this.getData();
    // this.insertData();
  }


  changePage(){
    this.router.navigate(["/modifier"]);
  }
}