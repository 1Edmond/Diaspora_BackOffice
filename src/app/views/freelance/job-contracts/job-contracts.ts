import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { FreelanceService } from '@core/services/freelance.service';
import {
  CheckInMethod,
  CheckInStatus,
  JobApplicationDto,
  JobApplicationStatus,
  JobCheckInDto,
} from '@core/models/freelance/freelance.model';

@Component({
  selector: 'app-job-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, DatePipe, Icon],
  templateUrl: './job-contracts.html',
})
export class JobContractsComponent implements OnInit {
  activeTab: 'applications' | 'checkins' = 'applications';

  // Candidatures
  applications: JobApplicationDto[] = [];
  loadingApps = false;
  totalApps = 0;
  pageApps = 1;
  pageSizeApps = 10;

  // Pointages
  checkIns: JobCheckInDto[] = [];
  loadingCheckIns = false;
  totalCheckIns = 0;
  pageCheckIns = 1;
  pageSizeCheckIns = 10;

  JobApplicationStatus = JobApplicationStatus;
  CheckInStatus = CheckInStatus;

  constructor(private freelanceService: FreelanceService) {}

  ngOnInit() {
    this.loadApplications();
    this.loadCheckIns();
  }

  loadApplications() {
    this.loadingApps = true;
    this.freelanceService.getReceivedApplications(this.pageApps, this.pageSizeApps).subscribe({
      next: (res) => {
        this.applications = res.items || [];
        this.totalApps = res.totalCount || 0;
        this.loadingApps = false;
      },
      error: () => {
        this.loadingApps = false;
      },
    });
  }

  loadCheckIns() {
    this.loadingCheckIns = true;
    this.freelanceService.getCheckIns(this.pageCheckIns, this.pageSizeCheckIns).subscribe({
      next: (res) => {
        this.checkIns = res.items || [];
        this.totalCheckIns = res.totalCount || 0;
        this.loadingCheckIns = false;
      },
      error: () => {
        this.loadingCheckIns = false;
      },
    });
  }

  Math = Math;

  getApplicationStatusBadgeClass(status: JobApplicationStatus): string {
    switch (status) {
      case JobApplicationStatus.Pending:
        return 'bg-soft-warning text-warning';
      case JobApplicationStatus.Accepted:
        return 'bg-soft-success text-success';
      case JobApplicationStatus.Rejected:
        return 'bg-soft-danger text-danger';
      case JobApplicationStatus.Withdrawn:
        return 'bg-soft-secondary text-secondary';
      case JobApplicationStatus.Completed:
        return 'bg-soft-info text-info';
      case JobApplicationStatus.NoShow:
        return 'bg-soft-danger text-danger';
      default:
        return 'bg-soft-secondary text-secondary';
    }
  }

  getApplicationStatusLabel(status: JobApplicationStatus): string {
    switch (status) {
      case JobApplicationStatus.Pending:
        return 'En Attente';
      case JobApplicationStatus.Accepted:
        return 'Acceptée';
      case JobApplicationStatus.Rejected:
        return 'Rejetée';
      case JobApplicationStatus.Withdrawn:
        return 'Retirée';
      case JobApplicationStatus.Completed:
        return 'Terminée';
      case JobApplicationStatus.NoShow:
        return 'Absent / No-Show';
      default:
        return 'Inconnu';
    }
  }

  getCheckInStatusBadgeClass(status: CheckInStatus): string {
    switch (status) {
      case CheckInStatus.Pending:
        return 'bg-soft-warning text-warning';
      case CheckInStatus.CheckedIn:
        return 'bg-soft-primary text-primary';
      case CheckInStatus.CheckedOut:
        return 'bg-soft-info text-info';
      case CheckInStatus.NoShow:
        return 'bg-soft-danger text-danger';
      default:
        return 'bg-soft-secondary text-secondary';
    }
  }

  getCheckInStatusLabel(status: CheckInStatus): string {
    switch (status) {
      case CheckInStatus.Pending:
        return 'En attente';
      case CheckInStatus.CheckedIn:
        return 'Pointage Arrivée';
      case CheckInStatus.CheckedOut:
        return 'Pointage Départ';
      case CheckInStatus.NoShow:
        return 'Absent / No-Show';
      default:
        return 'Inconnu';
    }
  }
}
