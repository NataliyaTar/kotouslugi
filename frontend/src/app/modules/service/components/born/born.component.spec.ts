import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BornComponent } from './born.component';

describe('BornComponent', () => {
  let component: BornComponent;
  let fixture: ComponentFixture<BornComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BornComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BornComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
