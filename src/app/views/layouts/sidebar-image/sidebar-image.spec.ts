import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarImage } from './sidebar-image'

describe('SidebarImage', () => {
  let component: SidebarImage
  let fixture: ComponentFixture<SidebarImage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarImage],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarImage)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
