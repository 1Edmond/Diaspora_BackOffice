import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarDark } from './sidebar-dark'

describe('SidebarDark', () => {
  let component: SidebarDark
  let fixture: ComponentFixture<SidebarDark>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDark],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarDark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
