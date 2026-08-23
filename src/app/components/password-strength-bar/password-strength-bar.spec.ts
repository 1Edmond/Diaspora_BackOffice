import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PasswordStrengthBar } from './password-strength-bar'

describe('PasswordStrengthBar', () => {
  let component: PasswordStrengthBar
  let fixture: ComponentFixture<PasswordStrengthBar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthBar],
    }).compileComponents()

    fixture = TestBed.createComponent(PasswordStrengthBar)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
