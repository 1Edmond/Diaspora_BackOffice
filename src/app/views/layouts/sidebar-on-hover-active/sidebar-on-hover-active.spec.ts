import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarOnHoverActive } from './sidebar-on-hover-active'

describe('SidebarOnHoverActive', () => {
  let component: SidebarOnHoverActive
  let fixture: ComponentFixture<SidebarOnHoverActive>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarOnHoverActive],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarOnHoverActive)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
