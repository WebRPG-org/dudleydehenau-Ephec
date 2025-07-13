import {Component} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { BarreNavigationComponent } from './barre-navigation/barre-navigation.component';
import { NotificationTriEnCoursComponent } from './pageTri/notification-tri-en-cours/notification-tri-en-cours.component';
import { CommonModule } from '@angular/common';
import { ErreurNotificationComponent } from './erreur-notification/erreur-notification.component';
import { AttentionNotificationComponent } from './attention-notification/attention-notification.component';
import { SupabaseCRUDService } from './services/supabaseCRUD.service';
import { TriNotifServiceService } from './services/tri-notif-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BarreNavigationComponent,
    MatToolbarModule,
    MatSidenavModule,
    NotificationTriEnCoursComponent,
    CommonModule,
    ErreurNotificationComponent,
    AttentionNotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ElectroSorter';
  notificationVisible : boolean = false;
  notificationErrorVisible = false;

  composantsFaibleQuantite: { type: string; quantity: number; description: string | null }[] = [];


  constructor(private supabaseService: SupabaseCRUDService, private triService: TriNotifServiceService){}

  async getData(){
    let data = await this.supabaseService.getComponentQuantity();

    for (let i = 0; i < data.length; i++){
      let composant = data[i];
      let feature = await this.supabaseService.getFeatureDescription(composant.Feature_id);
      let typeComposant = await this.supabaseService.getTypeComponent(composant.Type_id);
      if(composant.Quantity <= typeComposant?.Restock_value){
 

        this.composantsFaibleQuantite.push({
          type: typeComposant?.Name,
          quantity: composant.Quantity,
          description: feature
        });
      }
    }
      
  }


  ngOnInit() {
    this.getData();
    this.triService.getEtatTri().subscribe((etat)=>{
      this.notificationVisible = etat.triEnCours;
    });
    this.triService.getErreurTri().subscribe((etat)=>{
      this.notificationErrorVisible = etat.triErreur;
    });
  }
  
}



