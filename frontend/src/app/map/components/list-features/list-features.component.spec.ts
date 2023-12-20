import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeaturesComponent } from 'src/app/map/components/list-features/list-features.component';

describe('ListFeaturesComponent', () => {
  let component: ListFeaturesComponent;
  let fixture: ComponentFixture<ListFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
