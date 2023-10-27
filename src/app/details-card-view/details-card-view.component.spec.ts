import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {DetailsCardViewComponent} from "./details-card-view.component";

describe('ExploreContainerComponent', () => {
  let component: DetailsCardViewComponent;
  let fixture: ComponentFixture<DetailsCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsCardViewComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
