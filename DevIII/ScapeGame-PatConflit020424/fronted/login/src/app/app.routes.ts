import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {ChambreComponent} from "./pages/game/chambre/chambre.component";
import {PrisonComponent} from "./pages/game/prison/prison.component";
import {JardinComponent} from "./pages/game/jardin/jardin.component";
import {EspaceComponent} from "./pages/game/espace/espace.component";
import {ChateauComponent} from "./pages/game/chateau/chateau.component";
import {HopitalComponent} from "./pages/game/hopital/hopital.component";
import { NiveauComponent } from './pages/game/chateau/niveau/niveau.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  { path: 'game/chambre',
    component: ChambreComponent
  },
  { path: 'game/prison',
    component: PrisonComponent
  },
  { path: 'game/jardin',
    component: JardinComponent
  },
  { path: 'game/espace',
    component: EspaceComponent
  },
  { path: 'game/chateau',
    component: ChateauComponent
  },
  { path: 'game/hopital',
    component: HopitalComponent
  },
  { path: 'game/chateau/niveau',
    component: NiveauComponent
  }
];


