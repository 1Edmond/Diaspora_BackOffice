import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'

@Component({
  selector: 'app-empty',
  imports: [PageBreadcrumb],
  templateUrl: './empty.html',
  styles: ``,
})
export class Empty {}
