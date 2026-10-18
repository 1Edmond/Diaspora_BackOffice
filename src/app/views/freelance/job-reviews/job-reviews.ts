import { Component, OnInit } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { FreelanceService } from '@core/services/freelance.service'
import { ToastService } from '@core/services/toast.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { JobReviewDto } from '@core/models/freelance/freelance.model'

@Component({
  selector: 'app-job-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, PageBreadcrumb, Icon],
  templateUrl: './job-reviews.html',
  styles: [`
    .rating-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-weight: 600;
    }
  `],
})
export class JobReviewsComponent implements OnInit {
  reviews: JobReviewDto[] = []
  page = 1
  pageSize = 15
  totalCount = 0
  totalPages = 1
  loading = false

  selectedRating: number | null = null
  searchQuery = ''

  constructor(
    private freelanceService: FreelanceService,
    private toast: ToastService,
    private confirmModal: ConfirmModalService
  ) {}

  ngOnInit() {
    this.loadReviews()
  }

  loadReviews() {
    this.loading = true
    this.freelanceService.getJobReviewsAdmin({
      page: this.page,
      pageSize: this.pageSize,
      rating: this.selectedRating ?? undefined,
      search: this.searchQuery.trim() || undefined,
    }).subscribe({
      next: (res) => {
        this.reviews = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des avis freelance.')
        this.loading = false
      },
    })
  }

  onFilterChange() {
    this.page = 1
    this.loadReviews()
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return
    this.page = newPage
    this.loadReviews()
  }

  async deleteReview(review: JobReviewDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer cet avis de mission ?',
      message: `Voulez-vous vraiment supprimer l'évaluation laissée par "${review.raterName || 'Utilisateur'}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer l\'évaluation',
      cancelText: 'Annuler',
      variant: 'danger',
      icon: 'trash-2',
    })

    if (!confirmed) return

    this.freelanceService.deleteJobReview(review.id).subscribe({
      next: () => {
        this.toast.success('Avis supprimé avec succès.')
        this.loadReviews()
      },
      error: () => {
        this.toast.error('Erreur lors de la suppression de l\'avis.')
      },
    })
  }
}
