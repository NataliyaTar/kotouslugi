import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCatComponent } from './insurance-cat.component';

describe('InsuranceCatComponent', () => {
  let component: InsuranceCatComponent;
  let fixture: ComponentFixture<InsuranceCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceCatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsuranceCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
