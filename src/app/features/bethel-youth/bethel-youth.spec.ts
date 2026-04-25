import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BethelYouth } from './bethel-youth';

describe('BethelYouth', () => {
  let component: BethelYouth;
  let fixture: ComponentFixture<BethelYouth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BethelYouth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BethelYouth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
