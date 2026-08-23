import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ReviewDto } from '@core/models/marketplace/marketplace.model'

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, FormsModule],
  templateUrl: './reviews.html',
  styles: ``,
})
export class Reviews implements OnInit {
  reviews: ReviewDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  listingId = ''

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {}

  loadReviews() {
    if (!this.listingId) return
    this.loading = true
    this.marketplaceService.getReviews(this.listingId, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.reviews = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onListingIdChange() {
    this.page = 1
    this.reviews = []
    this.loadReviews()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadReviews()
  }
}
