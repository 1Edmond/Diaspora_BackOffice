import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SuccessMail } from './success-mail'

describe('SuccessMail', () => {
  let component: SuccessMail
  let fixture: ComponentFixture<SuccessMail>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessMail],
    }).compileComponents()

    fixture = TestBed.createComponent(SuccessMail)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
