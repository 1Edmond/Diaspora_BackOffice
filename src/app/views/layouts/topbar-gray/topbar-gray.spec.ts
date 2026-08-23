import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopbarGray } from './topbar-gray'

describe('TopbarGray', () => {
  let component: TopbarGray
  let fixture: ComponentFixture<TopbarGray>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarGray],
    }).compileComponents()

    fixture = TestBed.createComponent(TopbarGray)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
