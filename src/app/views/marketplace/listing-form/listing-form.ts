import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Observable } from 'rxjs'
import { MarketplaceService } from '@core/services/marketplace.service'
import { CategoryDto, CreateListingRequest } from '@core/models/marketplace/marketplace.model'
import { PaymentMode } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-listing-form',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, RouterLink],
  templateUrl: './listing-form.html',
  styles: ``,
})
export class ListingForm implements OnInit {
  isEdit = false
  listingId = ''
  categories: CategoryDto[] = []

  model: CreateListingRequest = {
    title: '',
    description: '',
    contactInfo: '',
    categoryId: '',
    paymentMode: PaymentMode.ContactOnly,
    price: undefined,
    currency: 'EUR',
  }
  saving = false
  error = ''

  PaymentMode = PaymentMode

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.marketplaceService.getCategories(true).subscribe({
      next: (cats) => { this.categories = cats },
      error: () => {},
    })

    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isEdit = true
      this.listingId = id
      this.marketplaceService.getListing(id).subscribe({
        next: (l) => {
          this.model = {
            title: l.title,
            description: l.description || '',
            contactInfo: l.contactInfo || '',
            categoryId: l.categoryId,
            paymentMode: l.paymentMode,
            price: l.price,
            currency: l.currency || 'EUR',
          }
        },
        error: () => this.router.navigate(['/marketplace/listings']),
      })
    }
  }

  save() {
    if (!this.model.title || !this.model.categoryId) return
    this.saving = true
    this.error = ''
    const obs: Observable<any> = this.isEdit
      ? this.marketplaceService.updateListing(this.listingId, this.model)
      : this.marketplaceService.createListing(this.model)

    obs.subscribe({
      next: () => {
        this.saving = false
        this.router.navigate(['/marketplace/listings'])
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Failed to save'
      },
    })
  }
}
