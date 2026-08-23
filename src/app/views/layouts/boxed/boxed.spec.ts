import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Boxed } from './boxed'

describe('Boxed', () => {
  let component: Boxed
  let fixture: ComponentFixture<Boxed>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boxed],
    }).compileComponents()

    fixture = TestBed.createComponent(Boxed)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
