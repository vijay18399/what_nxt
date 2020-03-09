import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UselectorPage } from './uselector.page';

describe('UselectorPage', () => {
  let component: UselectorPage;
  let fixture: ComponentFixture<UselectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UselectorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UselectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
