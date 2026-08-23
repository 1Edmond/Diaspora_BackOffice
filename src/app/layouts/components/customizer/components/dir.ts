import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-dir',
  imports: [],
  template: `
    <div id="dir" class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Layout Direction</h5>
      <div class="row g-3">
        <div class="col-4" id="dir-ltr">
          <div class="form-check sidebar-setting card-radio">
            <input class="form-check-input" type="radio" name="dir" id="layout-dir-ltr" value="ltr" [checked]="layout.direction === 'ltr'" (change)="changeDirection('ltr')" />
            <label class="form-check-label p-0 w-100" for="layout-dir-ltr">
              <img src="assets/images/layouts/dir-ltr.png" alt="layout-img" class="img-fluid" />
            </label>
          </div>
          <h5 class="mb-0 text-center text-muted mt-2">LTR</h5>
        </div>

        <div class="col-4" id="dir-rtl">
          <div class="form-check sidebar-setting card-radio">
            <input class="form-check-input" type="radio" name="dir" id="layout-dir-rtl" value="rtl" [checked]="layout.direction === 'rtl'" (change)="changeDirection('rtl')" />
            <label class="form-check-label p-0 w-100" for="layout-dir-rtl">
              <img src="assets/images/layouts/dir-rtl.png" alt="layout-img" class="img-fluid" />
            </label>
          </div>
          <h5 class="mb-0 text-center text-muted mt-2">RTL</h5>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Dir {
  constructor(public layout: LayoutService) {}

  changeDirection(dir: 'ltr' | 'rtl') {
    this.layout.updateLayout({ direction: dir })
  }
}
