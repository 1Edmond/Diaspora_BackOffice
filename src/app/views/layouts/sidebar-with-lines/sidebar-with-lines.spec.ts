import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarWithLines } from './sidebar-with-lines'

describe('SidebarWithLines', () => {
  let component: SidebarWithLines
  let fixture: ComponentFixture<SidebarWithLines>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarWithLines],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarWithLines)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
