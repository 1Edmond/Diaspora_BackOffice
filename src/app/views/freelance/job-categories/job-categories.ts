import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { FreelanceService } from '@core/services/freelance.service';
import { JobCategoryDto } from '@core/models/freelance/freelance.model';

@Component({
  selector: 'app-job-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb],
  templateUrl: './job-categories.html',
})
export class JobCategoriesComponent implements OnInit {
  categories: JobCategoryDto[] = [];
  filteredCategories: JobCategoryDto[] = [];
  loading = false;
  searchTerm = '';

  constructor(private freelanceService: FreelanceService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.freelanceService.getCategories(false).subscribe({
      next: (cats) => {
        this.categories = cats || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.description && c.description.toLowerCase().includes(term))
      );
    }
  }
}
