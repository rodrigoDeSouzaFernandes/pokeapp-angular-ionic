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
  IonCardSubtitle,
  IonSpinner,
} from '@ionic/angular/standalone';
import { PokeapiService } from '../../services/pokeapi.service';

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
    IonCardSubtitle,
    IonSpinner,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 20;
  loading = false;

  constructor(private _pokemonService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(offset: number = this.offset) {
    this.loading = true;
    this._pokemonService.getPokemons(offset, this.limit).subscribe({
      next: (res: any) => {
        const newPokemons = res.results.map((pokemon: any) => {
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
    this.offset += 20;
    this.limit += 20;
    this.loadPokemons(this.offset);
  }

  openDetails(name: string) {
    alert(`Abrir detalhes do Pokémon: ${name}`);
    // Aqui você pode navegar para outra página com detalhes usando router.navigate etc
  }
}
