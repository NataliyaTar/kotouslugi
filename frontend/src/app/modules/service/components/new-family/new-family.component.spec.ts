import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFamilyComponent } from './new-family.component';

describe('NewFamilyComponent', () => {
  let component: NewFamilyComponent;
  let fixture: ComponentFixture<NewFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFamilyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
