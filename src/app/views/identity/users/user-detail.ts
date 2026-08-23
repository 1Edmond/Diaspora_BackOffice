import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { IdentityService } from '@core/services/identity/identity.service'
import { User } from '@core/models/identity/user.model'

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe],
  templateUrl: './user-detail.html',
  styles: ``,
})
export class UserDetail implements OnInit {
  user: User | null = null
  loading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.identityService.getUser(id).subscribe({
      next: (user: User) => {
        this.user = user
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/identity/users'])
      },
    })
  }
}