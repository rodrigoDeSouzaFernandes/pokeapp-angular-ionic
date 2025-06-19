import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokeapiServiceSpy: jasmine.SpyObj<PokeapiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(waitForAsync(() => {
    const pokeapiSpy = jasmine.createSpyObj('PokeapiService', ['getPokemons']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const toast = jasmine.createSpyObj('ToastController', ['create']);

    // Mock do toast que retorna um objeto com método present()
    const toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toast.create.and.returnValue(Promise.resolve(toastElementSpy));

    TestBed.configureTestingModule({
      imports: [HomePage], // Importar componente standalone aqui
      providers: [
        { provide: PokeapiService, useValue: pokeapiSpy },
        { provide: Router, useValue: router },
        { provide: ToastController, useValue: toast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    pokeapiServiceSpy = TestBed.inject(PokeapiService) as jasmine.SpyObj<PokeapiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites from localStorage', () => {
    const mockFavorites = [
      { id: 1, name: 'bulbasaur', url: '...' },
      { id: 2, name: 'ivysaur', url: '...' },
    ];
    localStorage.setItem('favorites', JSON.stringify(mockFavorites));

    component.loadFavorites();

    expect(component.favoriteIds.has(1)).toBeTrue();
    expect(component.favoriteIds.has(2)).toBeTrue();
  });

  it('should load pokemons successfully', () => {
    const apiResponse = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    pokeapiServiceSpy.getPokemons.and.returnValue(of(apiResponse));

    component.loadPokemons(0);

    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].id).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading pokemons', () => {
    pokeapiServiceSpy.getPokemons.and.returnValue(throwError(() => 'API Error'));

    component.loadPokemons(0);

    expect(component.loading).toBeFalse();
  });

  it('should add pokemon to favorites', async () => {
    const mockPokemon = { id: 1, name: 'bulbasaur', url: '...' };

    const event = new Event('click');
    spyOn(event, 'stopImmediatePropagation');

    await component.toggleFavorite(mockPokemon, event);

    const stored = JSON.parse(localStorage.getItem('favorites')!);
    expect(stored.length).toBe(1);
    expect(component.favoriteIds.has(1)).toBeTrue();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled();
  });

  it('should remove pokemon from favorites', async () => {
    const mockPokemon = { id: 1, name: 'bulbasaur', url: '...' };
    localStorage.setItem('favorites', JSON.stringify([mockPokemon]));
    component.favoriteIds.add(1);

    const event = new Event('click');
    spyOn(event, 'stopImmediatePropagation');

    await component.toggleFavorite(mockPokemon, event);

    const stored = JSON.parse(localStorage.getItem('favorites')!);
    expect(stored.length).toBe(0);
    expect(component.favoriteIds.has(1)).toBeFalse();
    expect(toastControllerSpy.create).toHaveBeenCalled();
  });

  it('should navigate to favorites', () => {
    component.seeFavorites();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should load more pokemons', () => {
    spyOn(component, 'loadPokemons');
    component.offset = 0;
    component.pageSize = 50;

    component.loadMore();

    expect(component.offset).toBe(50);
    expect(component.loadPokemons).toHaveBeenCalledWith(50);
  });
});
