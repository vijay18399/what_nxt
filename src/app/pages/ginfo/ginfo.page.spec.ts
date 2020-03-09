import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GinfoPage } from './ginfo.page';

describe('GinfoPage', () => {
  let component: GinfoPage;
  let fixture: ComponentFixture<GinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
