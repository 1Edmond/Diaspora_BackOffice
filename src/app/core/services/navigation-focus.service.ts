import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationFocusService {
  private readonly STORAGE_KEY = 'diaspora_focus_module';

  activeModule = signal<string | null>(sessionStorage.getItem(this.STORAGE_KEY));

  isFocused = computed(() => this.activeModule() !== null);

  focusModule(moduleKey: string): void {
    this.activeModule.set(moduleKey);
    sessionStorage.setItem(this.STORAGE_KEY, moduleKey);
  }

  clearFocus(): void {
    this.activeModule.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
