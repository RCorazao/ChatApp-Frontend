import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'chat-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {

  public searchInput: string = '';

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter<string>();

  searchContact() {
    if (this.searchInput.trim()) {
      this.onValue.emit(this.searchInput);
      this.searchInput = '';
    }
  }

}
