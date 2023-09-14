import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';
import { AppComponentBase } from 'src/app/shared/app-component-base';
@Component({
  selector: 'app-custom-dropdown-countries',
  templateUrl: './custom-dropdown-countries.component.html',
  styleUrls: ['./custom-dropdown-countries.component.scss'],
})
export class CustomDropdownCountriesComponent extends AppComponentBase {
  @Output() countrySelected: EventEmitter<any> = new EventEmitter<any>();
  showDropdown: boolean = false;
  selectedCountry: any;
  filteredCountries: any[] = [];
  showError: boolean = false;
  constructor(private elementRef: ElementRef) {
    super();
    this.countryFlag;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.filteredCountries = this.countryFlag;
  }

  selectCountry(country: any) {
    if (country) {
      this.selectedCountry = country;
      this.showDropdown = false;
      this.countrySelected.emit(country);
    } else {
      console.log('no country selected');
    }
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  onSearch(event: Event) {
    let searchText = (event.target as HTMLInputElement).value;
    if (!searchText) {
      this.filteredCountries = this.countryFlag;
    } else {
      this.filteredCountries = this.countryFlag.filter((country) =>
        country.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (
      this.selectedCountry &&
      !this.filteredCountries.includes(this.selectedCountry)
    ) {
      this.selectedCountry = null; // Clear the selected country if it's not in the filtered list
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
