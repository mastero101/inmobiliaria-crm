import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadesFormComponent } from './propiedades-form.component';

describe('PropiedadesFormComponent', () => {
  let component: PropiedadesFormComponent;
  let fixture: ComponentFixture<PropiedadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedadesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropiedadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
