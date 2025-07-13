import { Component } from '@angular/core';
import { TriButtonComponent } from '../tri-button/tri-button.component';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [TriButtonComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

}
