import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Horizontal } from './horizontal'

describe('Horizontal', () => {
  let component: Horizontal
  let fixture: ComponentFixture<Horizontal>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Horizontal],
    }).compileComponents()

    fixture = TestBed.createComponent(Horizontal)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
