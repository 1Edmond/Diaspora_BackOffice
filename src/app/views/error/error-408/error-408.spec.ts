import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Error408 } from './error-408'

describe('Error408', () => {
  let component: Error408
  let fixture: ComponentFixture<Error408>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error408],
    }).compileComponents()

    fixture = TestBed.createComponent(Error408)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
