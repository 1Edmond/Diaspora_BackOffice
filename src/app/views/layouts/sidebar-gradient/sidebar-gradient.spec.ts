import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarGradient } from './sidebar-gradient'

describe('SidebarGradient', () => {
  let component: SidebarGradient
  let fixture: ComponentFixture<SidebarGradient>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarGradient],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarGradient)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
