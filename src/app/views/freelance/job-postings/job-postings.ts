import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { FreelanceService } from '@core/services/freelance.service';
import { ConfirmModalService } from '@core/services/confirm-modal.service';
import { ToastService } from '@core/services/toast.service';
import {
  JobCategoryDto,
  JobPostingDto,
  JobPostingStatus,
  JobPostingSummaryDto,
  PaymentTiming,
  PaymentType,
} from '@core/models/freelance/freelance.model';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, DatePipe, DecimalPipe, Icon],
  templateUrl: './job-postings.html',
})
export class JobPostingsComponent implements OnInit {
  jobPostings: JobPostingSummaryDto[] = [];
  categories: JobCategoryDto[] = [];
  loading = false;
  totalCount = 0;
  totalPages = 1;
  page = 1;
  pageSize = 10;

  // Filtres
  searchTerm = '';
  selectedCategory = '';
  selectedStatus: number | null = null;
  selectedRemote: boolean | null = null;

  // Modale de détail
  selectedJob: JobPostingDto | null = null;
  loadingDetail = false;
  showDetailModal = false;

  actionLoading = false;
  successMessage = '';
  errorMessage = '';

  JobPostingStatus = JobPostingStatus;
  PaymentType = PaymentType;
  PaymentTiming = PaymentTiming;
  Math = Math;

  constructor(
    private freelanceService: FreelanceService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadJobPostings();
  }

  loadCategories() {
    this.freelanceService.getCategories(false).subscribe({
      next: (cats) => (this.categories = cats || []),
      error: () => {},
    });
  }

  loadJobPostings() {
    this.loading = true;
    this.freelanceService
      .getJobPostings({
        page: this.page,
        pageSize: this.pageSize,
        search: this.searchTerm || undefined,
        categoryId: this.selectedCategory || undefined,
        status: this.selectedStatus !== null ? this.selectedStatus : undefined,
        isRemote: this.selectedRemote !== null ? this.selectedRemote : undefined,
        activeOnly: false,
      })
      .subscribe({
        next: (res) => {
          this.jobPostings = res.items || [];
          this.totalCount = res.totalCount || 0;
          this.totalPages = res.totalPages || Math.ceil(this.totalCount / this.pageSize) || 1;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onFilter() {
    this.page = 1;
    this.loadJobPostings();
  }

  onResetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = null;
    this.selectedRemote = null;
    this.page = 1;
    this.loadJobPostings();
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadJobPostings();
  }

  viewDetail(jobId: string) {
    this.loadingDetail = true;
    this.showDetailModal = true;
    this.freelanceService.getJobPostingById(jobId).subscribe({
      next: (job) => {
        this.selectedJob = job;
        this.loadingDetail = false;
      },
      error: (err) => {
        this.loadingDetail = false;
        this.showMessage('error', err?.error?.error || 'Erreur lors du chargement des détails.');
        this.closeDetailModal();
      },
    });
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedJob = null;
  }

  async publishJob(job: JobPostingSummaryDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Publier la mission',
      message: `Confirmez-vous la publication de la mission "${job.title}" ?`,
      confirmText: 'Publier',
      variant: 'success',
      icon: 'check-circle',
    });
    if (!confirmed) return;

    this.actionLoading = true;
    this.freelanceService.publishJobPosting(job.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showMessage('success', 'Offre de mission publiée avec succès.');
        this.loadJobPostings();
      },
      error: (err) => {
        this.actionLoading = false;
        this.showMessage('error', err?.error?.error || 'Erreur lors de la publication.');
      },
    });
  }

  async closeRegistration(job: JobPostingSummaryDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Clôturer les inscriptions',
      message: `Voulez-vous fermer les candidatures pour la mission "${job.title}" ?`,
      confirmText: 'Clôturer',
      variant: 'warning',
      icon: 'lock',
    });
    if (!confirmed) return;

    this.actionLoading = true;
    this.freelanceService.closeRegistration(job.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showMessage('success', 'Inscriptions clôturées avec succès.');
        this.loadJobPostings();
      },
      error: (err) => {
        this.actionLoading = false;
        this.showMessage('error', err?.error?.error || 'Erreur lors de la clôture.');
      },
    });
  }

  async cancelJob(job: JobPostingSummaryDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Annuler la mission',
      message: `Voulez-vous annuler définitivement la mission "${job.title}" ?`,
      confirmText: 'Annuler la mission',
      variant: 'danger',
      icon: 'alert-triangle',
    });
    if (!confirmed) return;

    this.actionLoading = true;
    this.freelanceService.cancelJobPosting(job.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showMessage('success', 'Mission annulée avec succès.');
        this.loadJobPostings();
      },
      error: (err) => {
        this.actionLoading = false;
        this.showMessage('error', err?.error?.error || 'Erreur lors de l\'annulation.');
      },
    });
  }

  async deleteJob(job: JobPostingSummaryDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer la mission',
      message: `ATTENTION : Êtes-vous sûr de vouloir supprimer la mission "${job.title}" ?`,
      confirmText: 'Supprimer',
      variant: 'danger',
      icon: 'trash-2',
    });
    if (!confirmed) return;

    this.actionLoading = true;
    this.freelanceService.deleteJobPosting(job.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.showMessage('success', 'Mission supprimée.');
        this.loadJobPostings();
      },
      error: (err) => {
        this.actionLoading = false;
        this.showMessage('error', err?.error?.error || 'Erreur lors de la suppression.');
      },
    });
  }

  getStatusBadgeClass(status: JobPostingStatus): string {
    switch (status) {
      case JobPostingStatus.Draft:
        return 'bg-soft-secondary text-secondary';
      case JobPostingStatus.Published:
        return 'bg-soft-success text-success';
      case JobPostingStatus.RegistrationClosed:
        return 'bg-soft-info text-info';
      case JobPostingStatus.InProgress:
        return 'bg-soft-primary text-primary';
      case JobPostingStatus.Completed:
        return 'bg-soft-dark text-dark';
      case JobPostingStatus.Cancelled:
        return 'bg-soft-danger text-danger';
      default:
        return 'bg-soft-secondary text-secondary';
    }
  }

  getStatusLabel(status: JobPostingStatus): string {
    switch (status) {
      case JobPostingStatus.Draft:
        return 'Brouillon';
      case JobPostingStatus.Published:
        return 'Publiée';
      case JobPostingStatus.RegistrationClosed:
        return 'Inscriptions Fermées';
      case JobPostingStatus.InProgress:
        return 'En Cours';
      case JobPostingStatus.Completed:
        return 'Terminée';
      case JobPostingStatus.Cancelled:
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  }

  getPaymentTypeLabel(type: PaymentType): string {
    switch (type) {
      case PaymentType.Fixed:
        return 'Forfaitaire';
      case PaymentType.Hourly:
        return 'À l\'heure';
      case PaymentType.Daily:
        return 'À la journée';
      default:
        return 'Standard';
    }
  }

  private showMessage(type: 'success' | 'error', msg: string) {
    if (type === 'success') {
      this.successMessage = msg;
      this.toast.success(msg);
      setTimeout(() => (this.successMessage = ''), 5000);
    } else {
      this.errorMessage = msg;
      this.toast.error(msg);
      setTimeout(() => (this.errorMessage = ''), 6000);
    }
  }
}
