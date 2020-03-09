import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpamPage } from './spam.page';

describe('SpamPage', () => {
  let component: SpamPage;
  let fixture: ComponentFixture<SpamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
