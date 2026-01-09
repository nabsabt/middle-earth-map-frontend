import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'search-input',
  templateUrl: './search.input.component.html',
  styleUrl: './search.input.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class SearchInputComponent {
  value = '';
  isFocused = false;

  onSearch() {
    // TODO: call your search logic
    console.log('search:', this.value);
  }
}
