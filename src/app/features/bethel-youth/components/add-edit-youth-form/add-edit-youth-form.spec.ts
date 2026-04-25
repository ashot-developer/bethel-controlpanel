import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYouthForm } from './add-edit-youth-form';

describe('AddEditYouthForm', () => {
  let component: AddEditYouthForm;
  let fixture: ComponentFixture<AddEditYouthForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditYouthForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYouthForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
