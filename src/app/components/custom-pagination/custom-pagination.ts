import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { Icon } from '../icon/icon'

@Component({
  selector: 'app-custom-pagination',
  imports: [NgbPaginationModule, Icon],
  templateUrl: './custom-pagination.html',
  styles: ``,
})
export class CustomPagination {
  @Input() showingRange: string = ''
  @Input() itemsName: string = 'products'
  @Input() collectionSize!: number
  @Input() page!: number
  @Input() pageSize!: number
  @Output() pageChange = new EventEmitter<number>()

  onPageChange(newPage: number) {
    this.page = newPage
    this.pageChange.emit(newPage)
  }
}
