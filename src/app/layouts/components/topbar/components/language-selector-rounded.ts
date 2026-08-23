import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

type LanguageType = {
  code: string
  name: string
  flag: string
}

@Component({
  selector: 'language-selector-rounded',
  imports: [RouterLink, NgbDropdownModule],
  template: `
    <div id="language-selector-rounded" class="topbar-item">
      <div ngbDropdown placement="bottom-end">
        <button class="topbar-link fw-bold drop-arrow-none" ngbDropdownToggle type="button">
          <img [src]="selectedLanguage.flag" alt="user-image" class="rounded-circle me-2" height="18" />
          <span id="selected-language-code">{{ selectedLanguage.code.toUpperCase() }}</span>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-end">
          @for (language of languageData; track $index) {
            <a [routerLink]="[]" ngbDropdownItem (click)="selectLanguage(language)" [title]="language.name">
              <img [src]="language.flag" [alt]="language.name" class="me-1 rounded-circle" height="18" />
              <span class="align-middle">{{ language.name }}</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LanguageSelectorRounded {
  languageData: LanguageType[] = [
    { code: 'en', name: 'English', flag: 'assets/images/flags/us.svg' },
    { code: 'de', name: 'Deutsch', flag: 'assets/images/flags/de.svg' },
    { code: 'it', name: 'Italiano', flag: 'assets/images/flags/it.svg' },
    { code: 'es', name: 'Español', flag: 'assets/images/flags/es.svg' },
    { code: 'ru', name: 'Русский', flag: 'assets/images/flags/ru.svg' },
    { code: 'hi', name: 'हिन्दी', flag: 'assets/images/flags/in.svg' },
    { code: 'ar', name: 'عربي', flag: 'assets/images/flags/sa.svg' },
  ]

  selectedLanguage: LanguageType = this.languageData[0]

  selectLanguage(language: LanguageType) {
    this.selectedLanguage = language
  }
}
