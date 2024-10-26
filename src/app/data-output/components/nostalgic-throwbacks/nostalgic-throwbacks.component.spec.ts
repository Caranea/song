import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NostalgicThrowbacksComponent } from './nostalgic-throwbacks.component';

describe('NostalgicThrowbacksComponent', () => {
  let component: NostalgicThrowbacksComponent;
  let fixture: ComponentFixture<NostalgicThrowbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NostalgicThrowbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NostalgicThrowbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
