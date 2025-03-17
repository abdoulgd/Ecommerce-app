import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  readonly #route = inject(ActivatedRoute);

  //readonly #productId = Number(this.#route.snapshot.paramMap.get('id')!);

  products: Product [] = [];
  #currentCategoryId: number = 1;
  #currentCategoryName: string = "";
  #searchMode: boolean = false;

  ngOnInit() {
    this.#route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // get cuurent category Name
  get CurrentCategoryName(): string {
    return this.#currentCategoryName;
  }

  listProducts() {
    this.#searchMode = this.#route.snapshot.paramMap.has('keyword');

    if (this.#searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.#route.snapshot.paramMap.get('keyword')!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => this.products = data
    );
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.#route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol or Number()
      this.#currentCategoryId = Number(this.#route.snapshot.paramMap.get('id')!);

      // get the "name" param string
      this.#currentCategoryName = this.#route.snapshot.paramMap.get('name')!;
    } else {
      // not category id available ... default to category id 1
      this.#currentCategoryId = 1;
      this.#currentCategoryName = 'Books';
    }

    this.productService.getProductList(this.#currentCategoryId).subscribe(
      data => this.products = data
    );
  }

}
