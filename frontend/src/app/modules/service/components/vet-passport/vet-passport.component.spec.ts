import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { VetPassportComponent } from './vet-passport.component';

describe('VetPassportComponent', () => {
  let component: VetPassportComponent;
  let fixture: ComponentFixture<VetPassportComponent>;

  const mockSteps = [
    { id: 0, title: 'Данные питомца' },
    { id: 1, title: 'Чипирование' },
    { id: 2, title: 'Вакцинации' },
    { id: 3, title: 'Проверка и QR-код' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VetPassportComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetPassportComponent);
    component = fixture.componentInstance;

    // Мокаем сервисы
    const serviceInfoService = TestBed.inject(ServiceInfoService as any);
    const constantsService = TestBed.inject(ConstantsService as any);
    const activatedRoute = TestBed.inject(ActivatedRoute as any);

    // Настраиваем моки
    activatedRoute.data = of({ idService: 'vet-passport' });
    constantsService.getCatOptionsAll = () => of([]);
    serviceInfoService.getSteps = () => of(mockSteps);
    serviceInfoService.activeStep = of({ 'vet-passport': 0 });
    serviceInfoService.servicesForms$ = { next: () => {} };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading).toBeTrue();
  });

  it('should have correct number of steps', () => {
    expect(component.active).toBe(0);
  });

  it('should navigate to next step', () => {
    component.active = 0;
    component.nextStep();
    expect(component.active).toBe(1);
  });

  it('should navigate to previous step', () => {
    component.active = 2;
    component.prevStep();
    expect(component.active).toBe(1);
  });

  it('should not go below step 0', () => {
    component.active = 0;
    component.prevStep();
    expect(component.active).toBe(0);
  });

  it('should not go above last step', () => {
    component.active = 3;
    component.nextStep();
    expect(component.active).toBe(3);
  });

  it('should add vaccination', () => {
    const initialLength = component.vaccinations.length;
    component.addVaccination();
    expect(component.vaccinations.length).toBe(initialLength + 1);
  });

  it('should remove vaccination', () => {
    component.vaccinations = [
      { name: 'Вакцина 1', date: '2024-01-01', nextDate: '2025-01-01', veterinarian: 'Иванов' },
      { name: 'Вакцина 2', date: '2024-02-01', nextDate: '2025-02-01', veterinarian: 'Петров' }
    ];
    component.removeVaccination(0);
    expect(component.vaccinations.length).toBe(1);
    expect(component.vaccinations[0].name).toBe('Вакцина 2');
  });

  it('should generate QR code', () => {
    component.generateQR();
    expect(component.qrCodeUrl).toContain('api.qrserver.com');
  });

  it('should handle photo selection', (done) => {
    const file = new File(['test image'], 'cat.jpg', { type: 'image/jpeg' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onPhotoSelected({ target: input } as any);

    setTimeout(() => {
      expect(component.avatarFile).toBeTruthy();
      expect(component.avatarFile?.name).toBe('cat.jpg');
      done();
    }, 100);
  });

  it('should remove photo', () => {
    component.avatarFile = { file: new File([''], 'test.jpg'), url: 'test', name: 'test.jpg' };
    component.removePhoto();
    expect(component.avatarFile).toBeNull();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should mark form as touched on submit when invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.submitForm();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
