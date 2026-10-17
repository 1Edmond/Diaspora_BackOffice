import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { NgbDropdownModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FreelanceService } from '@core/services/freelance.service';
import {
  JobCategoryDto,
  CreateJobCategoryRequest,
  UpdateJobCategoryRequest,
} from '@core/models/freelance/freelance.model';
import {
  COMMON_LANGUAGES,
  LanguageOption,
  getLanguageDisplay,
} from '@core/constants/languages.constant';
import { ConfirmModalService } from '@core/services/confirm-modal.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-job-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, Icon, NgbDropdownModule],
  templateUrl: './job-categories.html',
  styles: ``,
})
export class JobCategoriesComponent implements OnInit {
  categories: JobCategoryDto[] = [];
  filteredCategories: JobCategoryDto[] = [];
  loading = false;
  searchTerm = '';

  model: CreateJobCategoryRequest = {
    name: '',
    slug: '',
    description: '',
    iconUrl: '',
    displayOrder: 0,
  };
  saving = false;
  error = '';
  successMessage = '';
  editId: string | null = null;

  // Dynamic multilingual languages for creation & edition
  formLanguage = 'fr';
  formLanguages: string[] = ['fr'];
  formTranslations: { [culture: string]: { Name: string; Description: string } } = {
    fr: { Name: '', Description: '' },
  };
  customLangInput = '';
  commonLanguages = COMMON_LANGUAGES;

  // Translation management modal
  translatingCat: JobCategoryDto | null = null;
  translatingLanguages: string[] = ['fr', 'en', 'ru'];
  selectedCulture = 'fr';
  customModalLangInput = '';
  translationData: { [culture: string]: { Name?: string; Description?: string } } = {
    fr: { Name: '', Description: '' },
  };
  translationLoading = false;
  translationSaving = false;
  translationSuccess = '';
  translationError = '';
  translationModalRef: NgbModalRef | null = null;

  constructor(
    private freelanceService: FreelanceService,
    private modalService: NgbModal,
    private confirmModal: ConfirmModalService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  getLangInfo(code: string): LanguageOption {
    return getLanguageDisplay(code);
  }

  addFormLanguage(code: string) {
    const normalized = (code || '').trim().toLowerCase();
    if (!normalized) return;
    if (!this.formLanguages.includes(normalized)) {
      this.formLanguages.push(normalized);
      if (!this.formTranslations[normalized]) {
        this.formTranslations[normalized] = { Name: '', Description: '' };
      }
    }
    this.formLanguage = normalized;
    this.customLangInput = '';
  }

  removeFormLanguage(code: string, event: Event) {
    event.stopPropagation();
    if (this.formLanguages.length <= 1) return;
    this.formLanguages = this.formLanguages.filter((l) => l !== code);
    delete this.formTranslations[code];
    if (this.formLanguage === code) {
      this.formLanguage = this.formLanguages[0];
    }
  }

  loadCategories() {
    this.loading = true;
    this.freelanceService.getCategories(false).subscribe({
      next: (res) => {
        this.categories = res || [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading freelance categories:', err);
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
          (c.description && c.description.toLowerCase().includes(term)) ||
          (c.slug && c.slug.toLowerCase().includes(term))
      );
    }
  }

  save() {
    const primaryName =
      this.formTranslations['fr']?.Name?.trim() ||
      this.formTranslations[this.formLanguage]?.Name?.trim() ||
      Object.values(this.formTranslations).find((t) => !!t.Name?.trim())?.Name?.trim() ||
      '';

    if (!primaryName) {
      this.error = 'Veuillez saisir un nom pour la catégorie de mission dans au moins une langue.';
      return;
    }

    const primaryDesc =
      this.formTranslations['fr']?.Description?.trim() ||
      this.formTranslations[this.formLanguage]?.Description?.trim() ||
      '';

    this.model.name = primaryName;
    this.model.description = primaryDesc;

    // Build dynamic translations dictionary
    const dynamicTranslations: { [culture: string]: { [field: string]: string } } = {};
    for (const lang of this.formLanguages) {
      const trans = this.formTranslations[lang];
      if (trans && (trans.Name?.trim() || trans.Description?.trim())) {
        dynamicTranslations[lang] = {
          Name: trans.Name?.trim() || primaryName,
          Description: trans.Description?.trim() || '',
        };
      }
    }

    this.model.displayOrder = Number(this.model.displayOrder) || 0;
    this.model.iconUrl = this.model.iconUrl?.trim() || undefined;
    this.model.slug = this.model.slug?.trim() || undefined;
    this.model.translations = dynamicTranslations;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    const obs: Observable<any> = this.editId
      ? this.freelanceService.updateCategory(this.editId, this.model as UpdateJobCategoryRequest)
      : this.freelanceService.createCategory(this.model);

    obs.subscribe({
      next: () => {
        this.successMessage = this.editId
          ? 'Catégorie de mission mise à jour avec ses traductions multilingues.'
          : 'Catégorie de mission créée avec succès.';
        this.toastService.show(this.successMessage, 'success');
        this.resetForm();
        this.loadCategories();
      },
      error: (err: any) => {
        this.saving = false;
        console.error('Save freelance category error:', err);
        const serverError =
          err.error?.error ||
          err.error?.Error ||
          err.error?.message ||
          err.error?.title ||
          (err.error?.errors ? Object.values(err.error.errors).flat().join(', ') : '') ||
          (typeof err.error === 'string' ? err.error : '') ||
          (err.status ? `Erreur HTTP ${err.status} (${err.statusText || 'Échec'})` : '');
        this.error = serverError || "Erreur lors de l'enregistrement de la catégorie freelance.";
      },
    });
  }

  edit(cat: JobCategoryDto) {
    this.editId = cat.id;
    this.model = {
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      iconUrl: cat.iconUrl || '',
      displayOrder: cat.displayOrder,
      parentCategoryId: cat.parentCategoryId,
    };
    this.formLanguages = ['fr'];
    this.formTranslations = {
      fr: { Name: cat.name, Description: cat.description || '' },
    };
    this.formLanguage = 'fr';

    this.freelanceService.getCategoryTranslations(cat.id).subscribe({
      next: (trans) => {
        if (trans) {
          Object.keys(trans).forEach((lang) => {
            const culture = lang.toLowerCase();
            if (!this.formLanguages.includes(culture)) {
              this.formLanguages.push(culture);
            }
            this.formTranslations[culture] = {
              Name: trans[lang]['Name'] || '',
              Description: trans[lang]['Description'] || '',
            };
          });
        }
      },
      error: () => {},
    });
  }

  toggleStatus(cat: JobCategoryDto) {
    this.freelanceService.toggleCategoryStatus(cat.id, !cat.isActive).subscribe({
      next: () => {
        this.toastService.show(`Catégorie "${cat.name}" ${!cat.isActive ? 'activée' : 'désactivée'}.`, 'success');
        this.loadCategories();
      },
      error: (err) => {
        this.toastService.show(err.error?.error || 'Erreur lors du changement de statut.', 'danger');
      },
    });
  }

  async deleteCategory(cat: JobCategoryDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer la catégorie ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la catégorie "${cat.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'danger',
      icon: 'trash-2',
    });

    if (!confirmed) return;

    this.freelanceService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.toastService.show('Catégorie supprimée avec succès.', 'success');
        this.loadCategories();
      },
      error: (err) => {
        this.toastService.show(
          err.error?.error || err.error?.message || 'Erreur lors de la suppression de la catégorie.',
          'danger'
        );
      },
    });
  }

  resetForm() {
    this.editId = null;
    this.model = {
      name: '',
      slug: '',
      description: '',
      iconUrl: '',
      displayOrder: 0,
    };
    this.formLanguages = ['fr'];
    this.formTranslations = {
      fr: { Name: '', Description: '' },
    };
    this.formLanguage = 'fr';
    this.saving = false;
    this.customLangInput = '';
    this.error = '';
  }

  openTranslations(cat: JobCategoryDto, content: any) {
    this.translatingCat = cat;
    this.selectedCulture = 'fr';
    this.translationSuccess = '';
    this.translationError = '';
    this.translationLoading = true;
    this.translatingLanguages = ['fr'];
    this.translationData = {
      fr: { Name: cat.name, Description: cat.description || '' },
    };

    this.translationModalRef = this.modalService.open(content, { centered: true, size: 'lg' });

    this.freelanceService.getCategoryTranslations(cat.id).subscribe({
      next: (translations) => {
        this.translationLoading = false;
        if (translations) {
          Object.keys(translations).forEach((lang) => {
            const culture = lang.toLowerCase();
            if (!this.translatingLanguages.includes(culture)) {
              this.translatingLanguages.push(culture);
            }
            this.translationData[culture] = {
              Name: translations[lang]['Name'] || '',
              Description: translations[lang]['Description'] || '',
            };
          });
        }
      },
      error: (err) => {
        this.translationLoading = false;
        console.error('Error loading translations:', err);
      },
    });
  }

  addModalLanguage(code: string) {
    const normalized = (code || '').trim().toLowerCase();
    if (!normalized) return;
    if (!this.translatingLanguages.includes(normalized)) {
      this.translatingLanguages.push(normalized);
      if (!this.translationData[normalized]) {
        this.translationData[normalized] = { Name: '', Description: '' };
      }
    }
    this.selectedCulture = normalized;
    this.customModalLangInput = '';
  }

  saveTranslation(culture: string) {
    if (!this.translatingCat) return;
    this.translationSaving = true;
    this.translationSuccess = '';
    this.translationError = '';

    const fields: { [field: string]: string } = {
      Name: this.translationData[culture]?.Name || '',
      Description: this.translationData[culture]?.Description || '',
    };

    this.freelanceService
      .updateCategoryTranslation(this.translatingCat.id, culture, fields)
      .subscribe({
        next: () => {
          this.translationSaving = false;
          this.translationSuccess = `Traduction (${culture.toUpperCase()}) enregistrée avec succès.`;
          this.loadCategories();
        },
        error: (err: any) => {
          this.translationSaving = false;
          this.translationError =
            err.error?.error || err.error?.message || "Erreur lors de l'enregistrement de la traduction.";
        },
      });
  }

  closeTranslationModal() {
    this.translationModalRef?.close();
    this.translationModalRef = null;
    this.translatingCat = null;
  }
}
