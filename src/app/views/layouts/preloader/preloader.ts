import { Component, signal } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'

@Component({
  selector: 'app-preloader',
  imports: [PageBreadcrumb],
  templateUrl: './preloader.html',
  styles: ``,
})
export class Preloader {
  loading = signal(true)
  timer!: ReturnType<typeof setTimeout>

  ngOnInit() {
    this.timer = setTimeout(() => {
      this.loading.set(false)
    }, 2000)
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
  }
}
