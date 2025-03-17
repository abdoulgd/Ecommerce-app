import { Component, inject } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  readonly productService = inject(ProductService);
  readonly route = inject(ActivatedRoute);

  product!: Product;

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    // get the "id" param string. convert string to a number using the "+" symbol or Number()
    const productId: number = Number(this.route.snapshot.paramMap.get('id')!);

    this.productService.getProduct(productId).subscribe(
      data => this.product = data
    );
  }

}
