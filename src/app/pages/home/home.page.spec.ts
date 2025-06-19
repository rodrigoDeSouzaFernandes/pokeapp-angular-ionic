import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { PokeapiService } from '../../services/pokeapi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

class ToastControllerMock {
  create() {
    return Promise.resolve({
      present: () => Promise.resolve(),
    });
  }
}

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokeapiService: PokeapiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HomePage],
      providers: [
        PokeapiService,
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: Router, useClass: RouterMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    pokeapiService = TestBed.inject(PokeapiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemons successfully', () => {
    const mockPokemons = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    spyOn(pokeapiService, 'getPokemons').and.returnValue(of(mockPokemons));

    component.loadPokemons(0);

    expect(pokeapiService.getPokemons).toHaveBeenCalledWith(component.limit, 0);
    expect(component.pokemons.length).toBe(2);
    expect(component.pokemons[0].id).toBe(1);
    expect(component.pokemons[1].name).toBe('ivysaur');
    expect(component.loading).toBeFalse();
  });

  it('should toggle favorite and update localStorage', async () => {
    const pokemon = { id: 1, name: 'bulbasaur', url: '' };

    localStorage.clear();

    await component.toggleFavorite(pokemon, new Event('click'));
    expect(component.favoriteIds.has(pokemon.id)).toBeTrue();

    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(stored.find((p: any) => p.id === pokemon.id)).toBeTruthy();

    await component.toggleFavorite(pokemon, new Event('click'));
    expect(component.favoriteIds.has(pokemon.id)).toBeFalse();

    const storedAfter = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedAfter.find((p: any) => p.id === pokemon.id)).toBeFalsy();
  });
});
