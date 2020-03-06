import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StationsPage } from './stations.page';

describe('StationsPage', () => {
  let component: StationsPage;
  let fixture: ComponentFixture<StationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
