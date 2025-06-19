import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonIcon, CommonModule],
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isFavorite = false;

  @Output() cardClick = new EventEmitter<string>(); // emite o nome do Pokémon
  @Output() favoriteClick = new EventEmitter<{pokemon: Pokemon, event: Event}>();

  onCardClick() {
    this.cardClick.emit(this.pokemon.name);
  }

  onFavoriteClick(event: Event) {
    event.stopImmediatePropagation();
    this.favoriteClick.emit({ pokemon: this.pokemon, event });
  }
}
