import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink, NgbPagination],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  readonly #route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  //readonly #productId = Number(this.#route.snapshot.paramMap.get('id')!);

  products: Product [] = [];
  #currentCategoryId: number = 1;
  #previousCategoryId: number = 1;
  #currentCategoryName: string = "";
  #searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

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

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    console.log(`keyword=${theKeyword}, previousKeyword=${this.previousKeyword}`);
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword2=${theKeyword}, previousKeyword2=${this.previousKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using keyword 
    this.productService.searchProductsPaginate(
                                                this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyword
                                              ).subscribe(this.processResult());
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

    //
    // Check if we have a different category than previous 
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.#previousCategoryId != this.#currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.#previousCategoryId = this.#currentCategoryId;
    console.log(`currentCategoryId=${this.#currentCategoryId}, thePageNumber=${this.thePageNumber}, thePageSize=${this.thePageSize}, previousCategoryId=${this.#previousCategoryId}`);

    this.productService.getProductListPaginate(
                                                this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.#currentCategoryId
                                              ).subscribe(this.processResult());

  }

  updatePageSize(pageSize: string) {
    this.thePageSize = Number(pageSize);
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(): (data: any) => void {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);

    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }

}
