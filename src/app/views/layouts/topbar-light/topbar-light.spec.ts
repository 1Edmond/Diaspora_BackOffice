import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TopbarLight } from './topbar-light'

describe('TopbarLight', () => {
  let component: TopbarLight
  let fixture: ComponentFixture<TopbarLight>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarLight],
    }).compileComponents()

    fixture = TestBed.createComponent(TopbarLight)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
