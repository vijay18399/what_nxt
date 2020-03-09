import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OcrPage } from './ocr.page';

describe('OcrPage', () => {
  let component: OcrPage;
  let fixture: ComponentFixture<OcrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OcrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
