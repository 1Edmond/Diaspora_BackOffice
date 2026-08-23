import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { Observable } from 'rxjs'
import { MarketplaceService } from '@core/services/marketplace.service'
import { CategoryDto, CreateCategoryRequest } from '@core/models/marketplace/marketplace.model'

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories implements OnInit {
  categories: CategoryDto[] = []
  loading = false

  model: CreateCategoryRequest = { name: '', description: '', iconUrl: '', displayOrder: 0 }
  saving = false
  error = ''
  editId: string | null = null

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.loadCategories()
  }

  loadCategories() {
    this.loading = true
    this.marketplaceService.getCategories(false).subscribe({
      next: (res) => { this.categories = res; this.loading = false },
      error: () => { this.loading = false },
    })
  }

  save() {
    if (!this.model.name) return
    this.saving = true
    this.error = ''
    const obs: Observable<any> = this.editId
      ? this.marketplaceService.updateCategory(this.editId, this.model)
      : this.marketplaceService.createCategory(this.model)

    obs.subscribe({
      next: () => {
        this.resetForm()
        this.loadCategories()
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Failed to save'
      },
    })
  }

  edit(cat: CategoryDto) {
    this.editId = cat.id
    this.model = { name: cat.name, description: cat.description || '', iconUrl: cat.iconUrl || '', displayOrder: cat.displayOrder }
  }

  toggleStatus(cat: CategoryDto) {
    this.marketplaceService.toggleCategoryStatus(cat.id, !cat.isActive).subscribe({
      next: () => this.loadCategories(),
      error: () => {},
    })
  }

  resetForm() {
    this.editId = null
    this.model = { name: '', description: '', iconUrl: '', displayOrder: 0 }
    this.saving = false
  }
}
