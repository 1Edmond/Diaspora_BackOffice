import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Rating } from '@app/components/rating/rating'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { productData, ProductType } from '../../data'

@Component({
  selector: 'app-product-inventory',
  imports: [RouterLink, CustomPagination, AsyncPipe, NgbDropdownModule, Rating],
  providers: [TableService],
  templateUrl: './product-inventory.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductInventory {
  productData = productData
  productData$: Observable<ProductType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ProductType>) {
    this.productData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.tableService.setItems(structuredClone(productData), 7)
    })
  }
  protected readonly toPascalCase = toPascalCase
}
