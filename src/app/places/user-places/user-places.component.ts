import { Component, signal, inject, DestroyRef} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';

import { HttpClient } from '@angular/common/http';

import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  //places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;
  
    ngOnInit(){
      this.isFetching.set(true);
      const subscription = this.placesService.loadUserPlaces()
      .subscribe({
        // next: (places) => {   //added in service
        //   this.places.set(places); 
        // },
        error: (error: Error) => {
          console.log(error);
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      })
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }

}
