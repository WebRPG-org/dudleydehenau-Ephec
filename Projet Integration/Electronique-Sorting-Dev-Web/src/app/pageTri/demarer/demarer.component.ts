
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseCRUDService } from '../../services/supabaseCRUD.service';
import { TriWebSocketService } from '../../services/robot_arm.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Add this import
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demarer',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './demarer.component.html',
  styleUrls: ['./demarer.component.scss'],
})
export class DemarerComponent implements OnInit, OnDestroy {

  demarerPageOn = true;
  triPageOn = false;


  utilisateurs: { nomProf: string }[] = [];
  selectedUser = 'null';
  isUserValid = true;
  sortedItems: string[] = [];
  private sortSubscription: Subscription | null = null;

  constructor(
    private supabaseService: SupabaseCRUDService,
    private triWebSocketService: TriWebSocketService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient // Inject HttpClient
  ) {}

  async getData() {
    let data = await this.supabaseService.getUtilisateurs();
    for (let i = 0; i < data.length; i++) {
      let nom = data[i];
      this.utilisateurs.push({ nomProf: nom.Host_name });
    }
  }

  ngOnInit() {
    this.getData();

    // S'abonner aux éléments triés
    this.sortSubscription = this.triWebSocketService.items$.subscribe(
      (items) => {
        this.sortedItems = items;
        console.log('Éléments triés:', this.sortedItems);
      }
    );
  }

  demarerTri() {
    if (this.selectedUser == null || this.selectedUser == 'null') {
      this.snackBar.open(
        'Veuillez sélectionner un utilisateur pour démarrer le tri',
        'Fermer',
        {
          duration: 3000,
        }
      );
      return;
    }

    this.onOFF();

    // Démarrer la connexion WebSocket uniquement pendant le tri
    this.triWebSocketService.startTri();

    // Simulate starting the sorting process (replace with actual API call if needed)
    this.http.post('http://127.0.0.1:8000/start-sorting', {}).subscribe({
      next: (response) => {
        this.snackBar.open('Tri démarré avec succès', 'OK', {
          duration: 3000,
        });
        //this.router.navigate(['/tri']);
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du démarrage du tri', 'Fermer', {
          duration: 3000,
        });
        console.error('Erreur lors du démarrage du tri', error);
      },
    });
  }

  ngOnDestroy() {
    // Désabonnement et déconnexion
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
    this.triWebSocketService.disconnect();
  }

  arretUrgence(){
    console.log("Arrêt d'urgence !")
  }


  onOFF(){
    if(this.demarerPageOn == true){
      this.demarerPageOn = false;
      this.triPageOn = true;
    }else{
      this.triPageOn = false;
      this.demarerPageOn = true;
    }
  }
}




