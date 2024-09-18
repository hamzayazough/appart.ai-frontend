import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapBoxService } from '../../../services/map-box-service/map-box.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Address } from '../../../intefaces/adress.interface';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrl: './address-autocomplete.component.scss'
})
export class AddressAutocompleteComponent implements OnInit {
  @Input() initialPlaceName: string | null = '';
  @Input() initialApartmentNumber: string | null = '';
  @Output() addressSelected = new EventEmitter<Address>();
  private address: Address = {} as Address;
  addressControl = new FormControl();
  suggestions: any[] = [];

  constructor(private mapboxService: MapBoxService) {}

  ngOnInit() {
    if (this.initialPlaceName) {
      this.addressControl.setValue(this.initialPlaceName);
    }

    this.addressControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.mapboxService.searchPlace(value).subscribe((response: any) => {
            this.suggestions = response.features;
          });
        } else {
          this.suggestions = [];
        }
      });
  }

  selectSuggestion(suggestion: any) {
    console.log(suggestion);
    const address: Address = {
      placeName: suggestion.place_name,
      apartmentNumber: this.initialApartmentNumber || '',
      location: suggestion.geometry.coordinates,
      
    };
    this.address = address;
    this.addressControl.setValue(suggestion.place_name);
    console.log("heho", address);

    this.addressSelected.emit(address);
    this.suggestions = [];
  }

  setApartmentNumber(event: any) {
    this.addressSelected.emit(
      {
        ...this.address,
        apartmentNumber: event.target.value
      }
    );
  }
  
  }
