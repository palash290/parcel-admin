import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingBoostComponent } from './listing-boost.component';

describe('ListingBoostComponent', () => {
  let component: ListingBoostComponent;
  let fixture: ComponentFixture<ListingBoostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingBoostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingBoostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
