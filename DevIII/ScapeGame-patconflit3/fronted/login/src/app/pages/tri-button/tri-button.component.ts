import { Component } from '@angular/core';

@Component({
  selector: 'app-tri-button',
  standalone: true,
  imports: [],
  templateUrl: './tri-button.component.html',
  styleUrl: './tri-button.component.scss'
})
export class TriButtonComponent {
    triState = { option1: 'asc', option2: 'asc', option3: 'asc' };

    tri(option: string) {
            this.triState[option as keyof typeof this.triState] = this.triState[option as keyof typeof this.triState] === 'asc' ? 'desc' : 'asc';
            switch (option) {
                case 'option1':
                    // trier
                    break;
                case 'option2':
                    // trier
                    break;
                case 'option3':
                    // trier
                    break;
            }
        }
}
