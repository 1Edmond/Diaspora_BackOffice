import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductInventory } from './product-inventory'

describe('ProductInventory', () => {
  let component: ProductInventory
  let fixture: ComponentFixture<ProductInventory>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventory],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductInventory)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
