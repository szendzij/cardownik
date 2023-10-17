import { TestBed } from '@angular/core/testing';
import {
  AlertController,
  AngularDelegate,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { CameraService } from './camera.service';
import {SharedTestingModule} from "../../../../tests/modules";

describe('DialogService', () => {
  let service: CameraService;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(() => {
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    popoverControllerSpy = jasmine.createSpyObj('PopoverController', [
      'create',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ModalController,
        AngularDelegate,
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: PopoverController, useValue: popoverControllerSpy },
      ],
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(CameraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
