import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopbarGradient } from './topbar-gradient'

describe('TopbarGradient', () => {
  let component: TopbarGradient
  let fixture: ComponentFixture<TopbarGradient>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarGradient],
    }).compileComponents()

    fixture = TestBed.createComponent(TopbarGradient)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
