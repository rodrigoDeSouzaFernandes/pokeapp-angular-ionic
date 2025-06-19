import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '../../models/pokemon.model';
import { ToastController } from '@ionic/angular';
import { PokemonCardComponent } from 'src/app/components/pokemon-card/pokemon-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonSpinner,
    CommonModule,
    IonIcon,
    PokemonCardComponent,
  ],
})
export class HomePage implements OnInit {
  pokemons: Pokemon[] = [];
  favoriteIds = new Set<number>();
  pageSize = 20;
  offset = 0;
  limit = this.pageSize;
  loading = false;

  constructor(
    private _pokemonService: PokeapiService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadPokemons();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    const favorites: Pokemon[] = stored ? JSON.parse(stored) : [];
    this.favoriteIds = new Set(favorites.map((p) => p.id));
  }

  loadPokemons(offset: number = this.offset) {
    this.loading = true;
    this._pokemonService.getPokemons(offset, this.limit).subscribe({
      next: (res: { results: Pokemon[] }) => {
        const newPokemons: Pokemon[] = res.results.map((pokemon) => {
          const parts = pokemon.url.split('/').filter(Boolean);
          const id = +parts[parts.length - 1];
          return { ...pokemon, id };
        });

        this.pokemons = [...this.pokemons, ...newPokemons];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadMore() {
    this.offset += this.pageSize;
    this.limit += this.pageSize;
    this.loadPokemons(this.offset);
  }

  async toggleFavorite(pokemon: Pokemon, event: Event) {
    event.stopImmediatePropagation();

    const storageKey = 'favorites';

    const stored = localStorage.getItem(storageKey);
    const favorites: Pokemon[] = stored ? JSON.parse(stored) : [];

    const index = favorites.findIndex((p) => p.id === pokemon.id);

    if (index > -1) {
      favorites.splice(index, 1);
      this.favoriteIds.delete(pokemon.id);
      await this.presentToast(`${pokemon.name} removido dos favoritos.`);
    } else {
      favorites.push(pokemon);
      this.favoriteIds.add(pokemon.id);
      await this.presentToast(`${pokemon.name} adicionado aos favoritos.`);
    }

    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      color: 'primary',
    });
    toast.present();
  }
}
