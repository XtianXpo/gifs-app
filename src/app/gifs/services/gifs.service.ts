import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ISearchResponseDataDto,
  ISearchResponseDto,
} from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'DC7RL18Ldv26QQ2BiMEWxU4KYiT2EFnB';

// ! providedIn: 'root', podemos usar ese servicio en cualquier parte de la app.
@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifsList: ISearchResponseDataDto[] = [];
  public isLoadingGifsData: boolean = false;

  private _tagsHistory: string[] = [];
  private apiKey: string = GIPHY_API_KEY;
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    console.log(this._tagsHistory);

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(
        (elm: string) => elm.toLowerCase() !== tag
      );
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    console.log('_tagsHistory', this._tagsHistory);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string): void {
    this.isLoadingGifsData = true;

    if (tag.length === 0) return;

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);

    this.organizeHistory(tag);
    // ! Cuando se trabaja con el http... estamos creando un observable
    this.http
      .get<ISearchResponseDto>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifsList = resp.data;
        console.log(resp);
        this.saveLocalStorage();
        this.isLoadingGifsData = false;
      });
  }
}
