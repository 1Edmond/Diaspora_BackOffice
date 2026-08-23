import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoginPin } from './login-pin'

describe('LoginPin', () => {
  let component: LoginPin
  let fixture: ComponentFixture<LoginPin>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPin],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginPin)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
