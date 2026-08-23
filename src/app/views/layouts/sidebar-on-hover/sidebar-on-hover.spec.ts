import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarOnHover } from './sidebar-on-hover'

describe('SidebarOnHover', () => {
  let component: SidebarOnHover
  let fixture: ComponentFixture<SidebarOnHover>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarOnHover],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarOnHover)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
