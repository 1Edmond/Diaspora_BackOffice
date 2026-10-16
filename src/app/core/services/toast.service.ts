import { Injectable } from '@angular/core';

export type ToastVariant = 'success' | 'danger' | 'warning' | 'info' | 'primary';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private container: HTMLElement | null = null;

  private ensureContainer(): HTMLElement {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
      this.container.style.zIndex = '1090';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show(message: string, variant: ToastVariant = 'info', title?: string, durationMs = 4000): void {
    const container = this.ensureContainer();
    const toastEl = document.createElement('div');
    toastEl.className = `toast show align-items-center text-bg-${variant} border-0 shadow mb-2`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    const headerHtml = title
      ? `<div class="fw-semibold small mb-1">${this.escapeHtml(title)}</div>`
      : '';

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${headerHtml}
          <div>${this.escapeHtml(message)}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
      </div>
    `;

    const closeBtn = toastEl.querySelector('.btn-close');
    const removeToast = () => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.remove(), 200);
    };
    closeBtn?.addEventListener('click', removeToast);

    container.appendChild(toastEl);
    if (durationMs > 0) {
      setTimeout(removeToast, durationMs);
    }
  }

  success(message: string, title = 'Succès'): void {
    this.show(message, 'success', title);
  }

  error(message: string, title = 'Erreur'): void {
    this.show(message, 'danger', title, 5000);
  }

  warning(message: string, title = 'Attention'): void {
    this.show(message, 'warning', title, 4500);
  }

  info(message: string, title = 'Information'): void {
    this.show(message, 'info', title);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
