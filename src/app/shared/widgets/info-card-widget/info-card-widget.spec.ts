import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoCardWidget } from './info-card-widget';

describe('InfoCardWidget', () => {
  let component: InfoCardWidget;
  let fixture: ComponentFixture<InfoCardWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCardWidget]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCardWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
