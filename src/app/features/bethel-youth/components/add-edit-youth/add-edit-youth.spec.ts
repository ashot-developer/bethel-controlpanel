import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYouth } from './add-edit-youth';

describe('AddEditYouth', () => {
  let component: AddEditYouth;
  let fixture: ComponentFixture<AddEditYouth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditYouth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYouth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
