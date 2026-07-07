import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedingPartnerComponent } from './breeding-partner.component';

describe('BreedingPartnerComponent', () => {
  let component: BreedingPartnerComponent;
  let fixture: ComponentFixture<BreedingPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedingPartnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedingPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
