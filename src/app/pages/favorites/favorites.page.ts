import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { Pokemon } from '../../models/pokemon.model';
import { alertController } from '@ionic/core';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    CommonModule,
    IonIcon,
    PokemonCardComponent,
  ],
})
export class FavoritesPage implements OnInit {
  pokemons: Pokemon[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    this.pokemons = stored ? JSON.parse(stored) : [];
  }

  openDetails(name: string) {
    alert(`Abrir detalhes do Pokémon: ${name}`);
  }

  async removeFavorite(pokemon: Pokemon, event: Event) {
    event.stopImmediatePropagation();

    const alert = await alertController.create({
      header: 'Remover favorito',
      message: `Deseja remover ${pokemon.name} dos favoritos?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Remover',
          handler: () => {
            this.pokemons = this.pokemons.filter((p) => p.id !== pokemon.id);
            localStorage.setItem('favorites', JSON.stringify(this.pokemons));
          },
        },
      ],
    });

    await alert.present();
  }
}
