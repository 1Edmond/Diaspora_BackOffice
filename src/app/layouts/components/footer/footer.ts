import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            © {{ currentYear }} {{ name }} By
            <span class="fw-semibold">{{ author }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
