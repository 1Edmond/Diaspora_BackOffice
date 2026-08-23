import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Error400 } from './error-400'

describe('Error400', () => {
  let component: Error400
  let fixture: ComponentFixture<Error400>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error400],
    }).compileComponents()

    fixture = TestBed.createComponent(Error400)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
