import { TestBed } from '@angular/core/testing';
import { PokeapiService } from './pokeapi.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('PokeapiService', () => {
  let service: PokeapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeapiService],
    });

    service = TestBed.inject(PokeapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Garante que não ficaram requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of pokemons with limit and offset', () => {
    const mockResponse = { results: [{ name: 'bulbasaur' }] };

    service.getPokemons(10, 0).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch pokemon details by name', () => {
    const mockDetail = { name: 'bulbasaur', id: 1 };

    service.getPokemonDetails('bulbasaur').subscribe((res) => {
      expect(res).toEqual(mockDetail);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    expect(req.request.method).toBe('GET');
    req.flush(mockDetail);
  });
});
