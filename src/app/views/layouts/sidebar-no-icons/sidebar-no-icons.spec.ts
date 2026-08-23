import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarNoIcons } from './sidebar-no-icons'

describe('SidebarNoIcons', () => {
  let component: SidebarNoIcons
  let fixture: ComponentFixture<SidebarNoIcons>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNoIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarNoIcons)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
