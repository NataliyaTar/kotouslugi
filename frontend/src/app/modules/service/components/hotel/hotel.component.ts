import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThrobberComponent } from '@components/throbber/throbber.component';
import { CheckInfoComponent } from '@components/check-info/check-info.component';
import { HotelService } from '@services/hotel/hotel.service';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ThrobberComponent,
    CheckInfoComponent
  ],
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
  loading = true;
  notEnoughCats = false;
  form!: FormGroup;
  active = 0;

  cats: any[] = [];
  hotels: any[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.fetchOptions();
  }

  fetchOptions(): void {
    this.hotelService.getCatsAndHotels().subscribe((data: { cats: any[], hotels: any[] }) => {
      if (!data.cats.length || !data.hotels.length) {
        this.notEnoughCats = true;
        this.loading = false;
        return;
      }

      this.cats = data.cats;
      this.hotels = data.hotels;
      this.initForm();
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      cat: [this.cats[0].id, Validators.required],
      hotel: [this.hotels[0].id, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.loading = false;
  }

  getControl(id: string): FormControl {
    return this.form.get(id) as FormControl;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    const payload = {
      id_cat: formData.cat,
      id_hotel: formData.hotel,
      record_start: formData.startDate,
      record_finish: formData.endDate
    };

    this.hotelService.checkSpace(payload.id_hotel, payload.record_start, payload.record_finish).subscribe((available: boolean) => {
      if (!available) {
        this.errorMessage = 'В выбранный отель нет свободных мест на эти даты';
        this.successMessage = '';
        return;
      }

      this.hotelService.bookOverexposure(payload).subscribe(() => {
        this.successMessage = 'Котик успешно записан на передержку!';
        this.errorMessage = '';
        this.active = 1;
        this.form.reset();
      });
    });
  }

}
