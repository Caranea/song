import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopArtistTableComponent } from './top-artist-table.component';

describe('TopArtistTableComponent', () => {
  let component: TopArtistTableComponent;
  let fixture: ComponentFixture<TopArtistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopArtistTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopArtistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
