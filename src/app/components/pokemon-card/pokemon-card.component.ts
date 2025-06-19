import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonIcon, CommonModule],
})
export class PokemonCardComponent {
  constructor(private router: Router) {}
  @Input() pokemon!: Pokemon;
  @Input() isFavorite = false;

  @Output() favoriteClick = new EventEmitter<{
    pokemon: Pokemon;
    event: Event;
  }>();

  openDetails(name: string) {
    this.router.navigate(['/pokemon', name]);
  }

  onFavoriteClick(event: Event) {
    event.stopImmediatePropagation();
    this.favoriteClick.emit({ pokemon: this.pokemon, event });
  }
}
