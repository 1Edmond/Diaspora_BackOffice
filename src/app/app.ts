import { Component, inject, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { provideFlatpickrDefaults } from 'angularx-flatpickr'
import { filter, map, mergeMap } from 'rxjs/operators'
import { META_DATA } from './constants'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  providers: [provideFlatpickrDefaults()],
})
export class App implements OnInit {
  private titleService = inject(Title)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute
          while (route.firstChild) {
            route = route.firstChild
          }
          return route
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['title']) {
          this.titleService.setTitle(data['title'] + ` |  ${META_DATA.title}`)
        }
      })
  }
}
