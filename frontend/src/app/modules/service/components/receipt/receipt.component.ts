import { Component } from '@angular/core';
import { FineService } from '@services/fine/fine.service';
import { IReceipt } from '@models/fine.model';

@Component({
  selector: 'app-receipt',
  standalone: true,
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {

  // чек последней оплаты (если открыли напрямую — пустой)
  public receipt: IReceipt;

  constructor(private fineService: FineService) {
    this.receipt = this.fineService.receipt || {
      number: '-',
      date: '-',
      cat: '-',
      document: '-',
      fines: [],
      total: 0
    };
  }

}
