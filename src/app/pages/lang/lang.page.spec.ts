import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LangPage } from './lang.page';

describe('LangPage', () => {
  let component: LangPage;
  let fixture: ComponentFixture<LangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
