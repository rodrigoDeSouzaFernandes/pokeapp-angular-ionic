import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { Pokemon } from '../../models/pokemon.model';
import { IonicModule } from '@ionic/angular';
import { alertController } from '@ionic/core';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPage, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;

    // Mock do alertController.create com cast para "enganar" o TS
    spyOn(alertController, 'create').and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
        // Se quiser, pode incluir mais métodos usados no alert aqui
      } as unknown as HTMLIonAlertElement)
    );
  });

  afterEach(() => {
    localStorage.clear();
    (alertController.create as jasmine.Spy).calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites from localStorage on ngOnInit', () => {
    const mockFavorites: Pokemon[] = [
      { id: 1, name: 'bulbasaur', url: '' },
      { id: 2, name: 'ivysaur', url: '' },
    ];
    localStorage.setItem('favorites', JSON.stringify(mockFavorites));

    component.ngOnInit();

    expect(component.pokemons.length).toBe(2);
    expect(component.pokemons[0].name).toBe('bulbasaur');
  });

  it('should handle empty localStorage gracefully', () => {
    localStorage.removeItem('favorites');

    component.loadFavorites();

    expect(component.pokemons.length).toBe(0);
  });

  it('should call window.alert with correct message on openDetails', () => {
    spyOn(window, 'alert');

    component.openDetails('pikachu');

    expect(window.alert).toHaveBeenCalledWith('Abrir detalhes do Pokémon: pikachu');
  });

  it('should create and present alert on removeFavorite', async () => {
    const pokemon: Pokemon = { id: 1, name: 'bulbasaur', url: '' };
    component.pokemons = [pokemon];
    const event = jasmine.createSpyObj('event', ['stopImmediatePropagation']);

    await component.removeFavorite(pokemon, event);

    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(alertController.create).toHaveBeenCalled();

    const callArg = (alertController.create as jasmine.Spy).calls.mostRecent().args[0];
    expect(callArg.header).toBe('Remover favorito');
    expect(callArg.message).toBe(`Deseja remover ${pokemon.name} dos favoritos?`);
  });
});
