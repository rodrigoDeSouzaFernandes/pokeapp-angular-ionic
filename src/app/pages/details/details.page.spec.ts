import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPage } from './details.page';
import { PokeapiService } from '../../services/pokeapi.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock do ActivatedRoute para fornecer o parâmetro 'name'
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => {
        if (key === 'name') {
          return 'pikachu';  // nome fictício para teste
        }
        return null;
      }
    }
  }
};

// Mock simples do serviço PokeapiService
class PokeapiServiceMock {
  getPokemonDetails(name: string) {
    // Retorna um Observable simulando a resposta do backend
    return of({
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'image-url.png'
          }
        }
      }
    });
  }
}

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let pokeService: PokeapiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PokeapiService, useClass: PokeapiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    pokeService = TestBed.inject(PokeapiService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon details on init', () => {
    spyOn(pokeService, 'getPokemonDetails').and.callThrough();

    component.ngOnInit();

    expect(pokeService.getPokemonDetails).toHaveBeenCalledWith('pikachu');
    expect(component.pokemon).toBeTruthy();
    expect(component.pokemon.name).toBe('pikachu');
    expect(component.loading).toBeFalse();
  });

  it('should format height correctly', () => {
    expect(component.formatHeight(15)).toBe('1.5 m');
  });

  it('should format weight correctly', () => {
    expect(component.formatWeight(320)).toBe('32.0 kg');
  });

  it('should return artwork image URL', () => {
    component.pokemon = {
      sprites: {
        other: {
          'official-artwork': { front_default: 'test-image.png' }
        }
      }
    };
    expect(component.artworkImg).toBe('test-image.png');
  });

  it('should return empty string if no pokemon', () => {
    component.pokemon = null;
    expect(component.artworkImg).toBe('');
  });
});
