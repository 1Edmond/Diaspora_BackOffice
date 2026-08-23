import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarGray } from './sidebar-gray'

describe('SidebarGray', () => {
  let component: SidebarGray
  let fixture: ComponentFixture<SidebarGray>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarGray],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarGray)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
