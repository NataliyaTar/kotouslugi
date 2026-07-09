import { Component } from '@angular/core';

@Component({
  selector: 'app-receipt',
  standalone: true,
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {

  receipt = {
    number: 'CHK-10001',
    date: '08.06.2026',
    cat: 'Барсик',
    document: '123456789',
    fines: [
      {
        number: 'ШТ-10001',
        amount: 500
      },
      {
        number: 'ШТ-10002',
        amount: 1200
      }
    ],
    total: 1700
  };

}
