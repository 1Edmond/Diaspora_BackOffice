import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core'

export type SortDirection = 'asc' | 'desc' | ''

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
}

export type SortEvent<T> = {
  column: string
  direction: SortDirection
}

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbSortableHeader<T> {
  @Input() sortable: string = ''
  @Input() direction: SortDirection = ''
  @Output() sort = new EventEmitter<SortEvent<T>>()

  private icon!: HTMLElement

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.icon = this.el.nativeElement.querySelector('svg')
    if (!this.icon) {
      this.icon = this.renderer.createElement('span')
      this.renderer.appendChild(this.el.nativeElement, this.icon)
    }
    this.updateIcon()
  }

  rotate() {
    this.direction = rotate[this.direction]
    this.sort.emit({ column: this.sortable, direction: this.direction })
    this.updateIcon()
  }

  private updateIcon() {
    if (!this.icon) return

    if (this.direction === 'asc') {
      this.icon.innerHTML = `
       <svg  xmlns="http://www.w3.org/2000/svg"  width="13"  height="13"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" style="margin-inline-start: 2px" /></svg>
      `
    } else if (this.direction === 'desc') {
      this.icon.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="13"  height="13"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 15l-4 4" /><path d="M8 15l4 4" style="margin-inline-start: 2px" /></svg>
      `
    } else {
      this.icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="margin-inline-start: 2px"
                  >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 9l4 -4l4 4m-4 -4v14" />
          <path d="M21 15l-4 4l-4 -4m4 4v-14" />
        </svg>
        `
    }
  }
}
