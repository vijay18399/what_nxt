import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BotsPage } from './bots.page';

describe('BotsPage', () => {
  let component: BotsPage;
  let fixture: ComponentFixture<BotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
