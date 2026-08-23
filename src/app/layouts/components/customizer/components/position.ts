import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'position',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0">Layout Position</h5>
        <div class="d-flex gap-1">
          <div id="position-fixed">
            <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-fixed" value="fixed" [checked]="layout.position === 'fixed'" (change)="layout.updateLayout({ position: 'fixed' })" />
            <label class="btn btn-sm btn-soft-warning w-sm" for="layout-position-fixed">Fixed</label>
          </div>
          <div id="position-scrollable">
            <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-scrollable" value="scrollable" [checked]="layout.position === 'scrollable'" (change)="layout.updateLayout({ position: 'scrollable' })" />
            <label class="btn btn-sm btn-soft-warning w-sm ms-0" for="layout-position-scrollable">Scrollable</label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Position {
  constructor(public layout: LayoutService) {}
}
