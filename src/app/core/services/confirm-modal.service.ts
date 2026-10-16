import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ConfirmModalComponent,
  ConfirmModalConfig
} from '@shared/components/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  constructor(private modalService: NgbModal) {}

  /**
   * Opens a confirmation modal and resolves to true if confirmed, false if dismissed/cancelled.
   */
  async confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
    icon?: string;
  }): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });
    const config: ConfirmModalConfig = {
      ...options,
      isPrompt: false
    };
    modalRef.componentInstance.config = config;

    try {
      const result = await modalRef.result;
      return result === true;
    } catch {
      return false;
    }
  }

  /**
   * Opens a prompt modal with a required or optional text input and resolves to the string if confirmed, or null if dismissed.
   */
  async prompt(options: {
    title: string;
    message: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputRequired?: boolean;
    initialValue?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
    icon?: string;
  }): Promise<string | null> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });
    const config: ConfirmModalConfig = {
      ...options,
      isPrompt: true,
      inputRequired: options.inputRequired ?? true
    };
    modalRef.componentInstance.config = config;
    if (options.initialValue) {
      modalRef.componentInstance.inputValue = options.initialValue;
    }

    try {
      const result = await modalRef.result;
      return typeof result === 'string' ? result : null;
    } catch {
      return null;
    }
  }
}
