import { Routes } from '@angular/router';
import { ComposantsComponent } from './composants/composants.component';

import { HistoriqueComponent } from './historique/historique.component';
import { ModifierComponent } from './modifier/modifier.component';
import { DemarerComponent } from './pageTri/demarer/demarer.component';
import { TriComponent } from './pageTri/tri/tri.component';
import { ParametresComponent } from './parametres/parametres.component';


export const routes: Routes = [
    {
        path: '',
        component: ComposantsComponent
    },
    {
        path: 'modifier',
        component: ModifierComponent
    },
    {
        path: 'historique',
        component: HistoriqueComponent
    },
    {
        path: 'parametres',
        component: ParametresComponent
    },
    {
        path: 'demarer',
        component: DemarerComponent
    },
    {
        path: 'tri',
        component: TriComponent
    }
];