import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatGridListModule } from "@angular/material/grid-list";
import { SupabaseCRUDService } from "../services/supabaseCRUD.service"
import {getCacheConfig} from "@angular/cli/src/commands/cache/utilities";

interface Components {
  [key: string]: number | null;
}

interface HistoricElement {
  id: number;
  date: Date;
  action: string;
  component_id: number
  counter: number;
}

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatGridListModule
  ],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
})
export class HistoriqueComponent implements OnInit {
  historicElements: HistoricElement[] = [];
  showMore = false;
  groupedHistoricElements: { date: number, elements: any[] }[] = [];
  data: any[] = [];

  constructor(private supabaseCRUDService: SupabaseCRUDService) {}

  ngOnInit(): void {
    this.fetchHistoricElements();
    this.getData();
  }

  // Fonction pour récupérer les éléments d'historique depuis la base de données
  async fetchHistoricElements(): Promise<void> {
    console.log("fonction appelée")
    try {
      const data = await this.supabaseCRUDService.getHistoric();
      console.log('données récupérées', data);
      if (!Array.isArray(data)) {
        console.error('Error, les données ne sont pas un tableau', data);
        return;
      }

      await this.getData();

      // Mapper les données de la base pour correspondre à l'interface HistoricElement
      this.historicElements = data.map((item: any) => {
        const rawDate = item.Date || item.date;
        const parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) {
          console.error('date invalide pour l\'élément :', rawDate);
          return null;
        }
        return {
          id: item.id || item.Id,
          date: parsedDate,
          action: item.action || item.Action,
          component_id: item.component_id || item.Component_id,
          counter: item.counter || item.Counter,
        } as HistoricElement;
      }).filter((item): item is HistoricElement => item !== null); // filtrer les éléments avec des dates invalides
      this.historicElements.sort((a,b) => b.date.getTime() - a.date.getTime());
      console.log('Éléments historiques mappés et filtrés: ', this.historicElements);
      this.groupHistoricElementsByDate();
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }

  // Grouper les éléments historiques par date
  groupHistoricElementsByDate() {
    const grouped = new Map<number, any[]>();

    this.historicElements.forEach(element => {
      const normalizeDate = new Date(
        element.date.getFullYear(),
        element.date.getMonth(),
        element.date.getDate()
      ).getTime();
      if (!grouped.has(normalizeDate)) {
        grouped.set(normalizeDate, []);
      }
      grouped.get(normalizeDate)?.push(element);
    });

    this.groupedHistoricElements = Array.from(grouped, ([date, elements]) => ({ date, elements }));
    console.log('Groupes Historiques : ', this.groupedHistoricElements);
  }

  async getData() {
    try {
      let reponse = await this.supabaseCRUDService.getComponentsWithDetails();
      if (Array.isArray(reponse)) {
        this.data = reponse;
        console.log(reponse)

      } else {
        console.warn('No valid data received');
      }
    } catch (error) {
      console.error('Error fetching data from Component table', error);
    }
  }

  getComponents(component_id: number): string {
    const component = this.data.find(item => item.Id === component_id);
    if (component) {
      return component.Type?.Name || `Composant inconnu (ID: ${component_id})`;
    }

    return 'Composant inconnu (ID: ${component_id})';

  }

  getName(component_id: number): string {
    const component = this.data.find(item => item.Id === component_id);
    if (component) {
      return component.Feature?.Description || 'Description Inconnue (ID: ${component_id})';
    }
    return 'Description Inconnue (ID: ${component_id})';
  }

  getImage(component_id: number): string {
    const component = this.data.find(item => item.Id === component_id);
    if (component) {
      return component.Feature?.Image || `Image Inconnue (ID: ${component_id})`;
    }
    return 'Image Inconnue (ID: ${component_id})';
  }

  getAction(action: string): string {
    switch (action) {
      case 'Ajout':
        return "Ajout";
      case 'Suppression':
        return "Suppression";
      case 'Triage':
        return "Tri";
      default:
        return "Action inconnue";
    }
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  isTextTooLong(text: string): boolean {
    return text.length > 100; // Si le texte dépasse 100 caractères, afficher "voir plus"
  }

  protected readonly getCacheConfig = getCacheConfig;
}

