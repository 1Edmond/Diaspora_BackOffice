import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Icon } from '@app/components/icon/icon';

export interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
  icon?: string;
  isPrompt?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputRequired?: boolean;
  initialValue?: string;
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  template: `
    <div class="modal-header border-bottom-0 pb-0">
      <div class="d-flex align-items-center gap-2">
        <div
          class="avatar-sm rounded-circle d-flex align-items-center justify-content-center"
          [ngClass]="'bg-soft-' + (config.variant || 'primary') + ' text-' + (config.variant || 'primary')"
        >
          <app-icon [icon]="config.icon || getDefaultIcon()" class="fs-4"></app-icon>
        </div>
        <h5 class="modal-title mb-0">{{ config.title }}</h5>
      </div>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>

    <div class="modal-body pt-3">
      <p class="text-muted mb-0" style="white-space: pre-line;">{{ config.message }}</p>

      @if (config.isPrompt) {
        <div class="mt-3">
          @if (config.inputLabel) {
            <label class="form-label fw-medium">{{ config.inputLabel }}
              @if (config.inputRequired !== false) {
                <span class="text-danger">*</span>
              }
            </label>
          }
          <textarea
            class="form-control"
            rows="3"
            [(ngModel)]="inputValue"
            [placeholder]="config.inputPlaceholder || 'Saisissez votre motif...'"
            [class.is-invalid]="submitted && config.inputRequired !== false && !inputValue.trim()"
          ></textarea>
          @if (submitted && config.inputRequired !== false && !inputValue.trim()) {
            <div class="invalid-feedback">Ce champ est obligatoire.</div>
          }
        </div>
      }
    </div>

    <div class="modal-footer border-top-0 pt-0">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss()">
        {{ config.cancelText || 'Annuler' }}
      </button>
      <button
        type="button"
        class="btn"
        [ngClass]="'btn-' + (config.variant || 'primary')"
        (click)="onConfirm()"
      >
        {{ config.confirmText || 'Confirmer' }}
      </button>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() config: ConfirmModalConfig = {
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
    variant: 'primary'
  };

  inputValue = '';
  submitted = false;

  constructor(public activeModal: NgbActiveModal) {}

  getDefaultIcon(): string {
    switch (this.config.variant) {
      case 'danger':
        return 'alert-triangle';
      case 'warning':
        return 'alert-circle';
      case 'success':
        return 'check-circle';
      case 'info':
        return 'info';
      default:
        return 'help-circle';
    }
  }

  onConfirm(): void {
    this.submitted = true;
    if (this.config.isPrompt) {
      if (this.config.inputRequired !== false && !this.inputValue.trim()) {
        return;
      }
      this.activeModal.close(this.inputValue.trim());
    } else {
      this.activeModal.close(true);
    }
  }
}
