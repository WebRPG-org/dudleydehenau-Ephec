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
import { ChambrePlayComponent } from './pages/game/chambre/chambrePlay/chambre-play.component';
import {RpgGameComponent} from "./pages/game/prison/rpg-game/rpg-game.component";
import {AuthGuardService} from "./services/auth-guard.service";
import { ScoreTestComponent } from './pages/test/score-test/score-test.component';


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
    component: SignupComponent,
  },
  { path: 'game/chambre',
    component: ChambreComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/prison',
    component: PrisonComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/jardin',
    component: JardinComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/espace',
    component: EspaceComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/chateau',
    component: ChateauComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/chateau/niveau',
    component: NiveauComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/hopital',
    component: HopitalComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/chambre/chambrePlay',
    component: ChambrePlayComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'game/prison/niveau',
    component: RpgGameComponent,
    canActivate: [AuthGuardService]
  }
];


