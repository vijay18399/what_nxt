import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GchatPage } from './gchat.page';

describe('GchatPage', () => {
  let component: GchatPage;
  let fixture: ComponentFixture<GchatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GchatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
