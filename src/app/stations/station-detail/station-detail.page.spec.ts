import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StationDetailPage } from './station-detail.page';

describe('StationDetailPage', () => {
  let component: StationDetailPage;
  let fixture: ComponentFixture<StationDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
