import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { Router } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept pokemon and isFavorite inputs', () => {
    const mockPokemon: Pokemon = { id: 1, name: 'bulbasaur', url: '' };
    component.pokemon = mockPokemon;
    component.isFavorite = true;
    fixture.detectChanges();

    expect(component.pokemon).toEqual(mockPokemon);
    expect(component.isFavorite).toBeTrue();
  });

  it('should emit favoriteClick with pokemon and event', () => {
    const mockPokemon: Pokemon = { id: 1, name: 'bulbasaur', url: '' };
    component.pokemon = mockPokemon;
    const event = new Event('click');

    spyOn(component.favoriteClick, 'emit');

    component.onFavoriteClick(event);

    expect(component.favoriteClick.emit).toHaveBeenCalledWith({
      pokemon: mockPokemon,
      event,
    });
  });

  it('should navigate to details page on openDetails', () => {
    component.openDetails('bulbasaur');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pokemon', 'bulbasaur']);
  });
});
