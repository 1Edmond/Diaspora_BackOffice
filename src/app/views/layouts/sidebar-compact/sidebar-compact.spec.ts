import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarCompact } from './sidebar-compact'

describe('SidebarCompact', () => {
  let component: SidebarCompact
  let fixture: ComponentFixture<SidebarCompact>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCompact],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarCompact)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
