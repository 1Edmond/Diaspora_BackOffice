import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Error401 } from './error-401'

describe('Error401', () => {
  let component: Error401
  let fixture: ComponentFixture<Error401>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error401],
    }).compileComponents()

    fixture = TestBed.createComponent(Error401)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
