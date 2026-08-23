import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LayoutInfo } from './layout-info'

describe('LayoutInfo', () => {
  let component: LayoutInfo
  let fixture: ComponentFixture<LayoutInfo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutInfo],
    }).compileComponents()

    fixture = TestBed.createComponent(LayoutInfo)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
