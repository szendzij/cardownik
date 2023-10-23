import {Component, OnInit} from '@angular/core';
import {DialogService} from "../core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'add-cards-form-component',
  templateUrl: './add-cards-form-component.html',
  styleUrls: ['./add-cards-form.component.scss'],
})
export class AddCardsFormComponent implements OnInit {

  public addCard = new FormGroup({
    id: new FormControl(),
    shopName: new FormControl('', Validators.required),
    barcode: new FormControl(''),
    shopLocalization: new FormControl('', Validators.required),
    modified: new FormControl(new Date().toLocaleString("pl-PL"))
  });

  constructor(private readonly dialogService: DialogService) { }

  ngOnInit(): void { }

  public async closeModal(): Promise<void> {
    await this.dialogService.dismissModal({});
  }

}
