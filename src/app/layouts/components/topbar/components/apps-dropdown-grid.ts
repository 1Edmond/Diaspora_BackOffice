import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
@Component({
  selector: 'apps-dropdown-grid',
  imports: [RouterLink, Icon, NgbDropdownModule],
  template: `
    <div id="apps-dropdown-grid" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button ngbDropdownToggle class="topbar-link drop-arrow-none" type="button">
          <app-icon icon="layout-grid" class="topbar-link-icon"></app-icon>
        </button>

        <div ngbDropdownMenu class="dropdown-menu-lg p-2 dropdown-menu-end">
          <div class="row align-items-center g-1">
            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title text-bg-light rounded-circle">
                    <img src="assets/images/logos/google.svg" alt="Google Logo" height="18" />
                  </span>
                </span>
                <span class="align-middle fw-medium">Google</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title text-bg-light rounded-circle">
                    <img src="assets/images/logos/figma.svg" alt="Figma Logo" height="18" />
                  </span>
                </span>
                <span class="align-middle fw-medium">Figma</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title text-bg-light rounded-circle">
                    <img src="assets/images/logos/slack.svg" alt="Slack Logo" height="18" />
                  </span>
                </span>
                <span class="align-middle fw-medium">Slack</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title text-bg-light rounded-circle">
                    <img src="assets/images/logos/dropbox.svg" alt="Dropbox Logo" height="18" />
                  </span>
                </span>
                <span class="align-middle fw-medium">Dropbox</span>
              </a>
            </div>

            <div class="col-4 text-center">
              <a [routerLink]="[]" class="btn btn-sm rounded-circle btn-icon btn-danger">
                <app-icon icon="circle-plus" class="fs-18"></app-icon>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <app-icon icon="calendar" class="fs-18"></app-icon>
                  </span>
                </span>
                <span class="align-middle fw-medium">Calendar</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <app-icon icon="message-circle" class="fs-18"></app-icon>
                  </span>
                </span>
                <span class="align-middle fw-medium">Chat</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <app-icon icon="folder" class="fs-18"></app-icon>
                  </span>
                </span>
                <span class="align-middle fw-medium">Files</span>
              </a>
            </div>

            <div class="col-4">
              <a [routerLink]="[]" class="border border-dashed rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                <span class="avatar-sm d-block mx-auto mb-1">
                  <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <app-icon icon="users" class="fs-18"></app-icon>
                  </span>
                </span>
                <span class="align-middle fw-medium">Team</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AppsDropdownGrid {}
