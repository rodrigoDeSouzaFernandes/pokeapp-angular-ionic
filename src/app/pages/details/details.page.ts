import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonProgressBar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { PokeapiService } from '../../services/pokeapi.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonProgressBar,
    IonButton,
    IonButtons,
    IonBackButton,
    CommonModule,
    IonSpinner,
    IonCardSubtitle,
  ],
})
export class DetailsPage implements OnInit {
  pokemon: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeapiService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    alert(name);
    if (name) {
      this.loadPokemon(name);
    }
  }

  loadPokemon(name: string) {
    this.loading = true;
    this.pokeService.getPokemonDetails(name).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erro ao carregar dados do Pokémon');
      },
    });
  }

  formatHeight(height: number): string {
    return (height / 10).toFixed(1) + ' m';
  }

  formatWeight(weight: number): string {
    return (weight / 10).toFixed(1) + ' kg';
  }

  get artworkImg(): string {
    if (!this.pokemon) return '';
    return (
      this.pokemon.sprites?.other?.['official-artwork']?.front_default ||
      this.pokemon.sprites?.front_default ||
      ''
    );
  }
}
