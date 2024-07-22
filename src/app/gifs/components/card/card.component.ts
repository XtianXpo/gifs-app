import { Component, Input, OnInit } from '@angular/core';
import { ISearchResponseDataDto } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  @Input()
  public gif: ISearchResponseDataDto | null = null;

  ngOnInit(): void {
    if (!this.gif) throw new Error('Method not implemented.');
  }
}
