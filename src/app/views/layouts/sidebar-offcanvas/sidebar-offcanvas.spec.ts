import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarOffcanvas } from './sidebar-offcanvas'

describe('SidebarOffcanvas', () => {
  let component: SidebarOffcanvas
  let fixture: ComponentFixture<SidebarOffcanvas>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarOffcanvas],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarOffcanvas)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
