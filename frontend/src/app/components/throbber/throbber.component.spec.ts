import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrobberComponent } from './throbber.component';

describe('ThrobberComponent', () => {
  let component: ThrobberComponent;
  let fixture: ComponentFixture<ThrobberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThrobberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThrobberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
