import { Component } from '@angular/core';
import { LevelService } from '../../services/search-levels.service';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-tri-button',
    standalone: true,
    imports: [],
    templateUrl: './tri-button.component.html',
    styleUrl: './tri-button.component.scss'
})

export class TriButtonComponent {
    triState = { option1: 'asc', option2: 'asc', option3: 'asc' };

    constructor(private levelService: LevelService, private http: HttpClient) { }

    ngOnInit(): void {
        this.tri('option3');
    }

    tri(option: string) {
        let niveaux: any[] = [];
        if (this.levelService.filteredGames) {
            niveaux = this.levelService.filteredGames;
        } else {
            this.http.get<any>('http://localhost:3000/level/data').subscribe((data: Array<any>) => {
                niveaux = data;
            });
        }
        //console.log(niveaux);
        switch (option) {
            case 'option1':
                niveaux.sort((a: any, b: any) => this.triState.option1 === 'asc' ? a.likes - b.likes : b.likes - a.likes);
                this.triState.option1 = this.triState.option1 === 'asc' ? 'desc' : 'asc';
                break;
            case 'option2':
                niveaux.sort((a: any, b: any) => this.triState.option2 === 'asc' ? new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime() : new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
                this.triState.option2 = this.triState.option2 === 'asc' ? 'desc' : 'asc';
                break;
            case 'option3':
                niveaux.sort((a: any, b: any) => this.triState.option3 === 'asc' ? b.views - a.views : a.views - b.views);
                this.triState.option3 = this.triState.option3 === 'asc' ? 'desc' : 'asc';
                break;
        }
    this.levelService.updateLevelData(niveaux);
    }
}