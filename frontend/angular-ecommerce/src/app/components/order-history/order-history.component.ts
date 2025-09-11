import { Component, inject, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {

  private readonly orderHistoryService: OrderHistoryService = inject(OrderHistoryService);

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory(): void {

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    if (theEmail) {
      // retrieve data from the Spring Boot REST API
      this.orderHistoryService.getOrderHistory(theEmail).subscribe(data => {
          this.orderHistoryList = data._embedded.orders;
        });
    }
  }

}
