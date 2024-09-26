import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentasComponent } from './rentas.component';

describe('RentasComponent', () => {
  let component: RentasComponent;
  let fixture: ComponentFixture<RentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
