import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Scrollable } from './scrollable'

describe('Scrollable', () => {
  let component: Scrollable
  let fixture: ComponentFixture<Scrollable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scrollable],
    }).compileComponents()

    fixture = TestBed.createComponent(Scrollable)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
