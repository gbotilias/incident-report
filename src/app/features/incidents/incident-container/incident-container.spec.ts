import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentContainer } from './incident-container';

describe('IncidentContainer', () => {
  let component: IncidentContainer;
  let fixture: ComponentFixture<IncidentContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
