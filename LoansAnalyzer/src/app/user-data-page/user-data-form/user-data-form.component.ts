import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobType } from '../Models/JobTypes/JobType';
import { IdType } from '../Models/IdTypes/IdType';
import { IdTypeService } from '../Models/IdTypes/IdType-service';
import { JobTypeService } from '../Models/JobTypes/JobType-service';
import { ErrorMessagesProvider } from './ErrorMessagesProvider';
import { UserDTO } from '../Models/User/UserDTO/UserDTO';
import { UserPostService } from './UserPost-service';
import { JobDetailsDTO } from '../Models/User/UserDTO/JobDetailsDTO';
import { GovernmentDocumentDTO } from '../Models/User/UserDTO/GovernmentDocumentDTO';
import { ConfirmPopUpComponent } from './confirm-pop-up/confirm-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { UserInfo } from 'src/app/Models/UserInfo/UserInfo';

@Component({
  selector: 'user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.css']
})
export class UserDataFormComponent {

  @Output() SetClientData = new EventEmitter<UserDTO>();
  @Output() DiscardClientData = new EventEmitter<UserDTO>();

  hide = true;
  saveError = false;
  saveSuccess = false;

  UserInfo:UserDTO|null = null;

  jobTypes: JobType[] = [];
  idTypes: IdType[] = [];

  errorMessagesProvider = new ErrorMessagesProvider();

  async GetIdDropdownOptions(){
    this.idTypes = await IdTypeService.PopulateIdsDropdown();
  }

  async GetJobDropdownOptions(){
    this.jobTypes = await JobTypeService.PopulateJobsDropdown();
  }

  constructor(private dialogRef:MatDialog) {

    this.GetIdDropdownOptions();
    this.GetJobDropdownOptions();
  }


  //Form Controls

  NameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z]+'),
    Validators.minLength(3),
  ]);
  SurNameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z]+'),
    Validators.minLength(3),
  ]);
  BirthDateControl = new FormControl('', [Validators.required]);
  JobTypeControl = new FormControl('', [Validators.required]);
  JobStartDateControl = new FormControl('', [Validators.required]);
  JobEndDateControl = new FormControl('', []);
  GovDocumentTypeControl = new FormControl('', [Validators.required]);
  GovDocumentNumberControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]+'),
    Validators.minLength(12),
  ]);


  //Error messages

  getErrorMessage(fieldName:string,control:FormControl){
    if(control.hasError('required'))return this.errorMessagesProvider.GetRequiredErrorMessage(fieldName);
    if(control.hasError('pattern'))return this.errorMessagesProvider.GetPatternErrorMessage(fieldName);
    if(control.hasError('minlength'))return this.errorMessagesProvider.GetMinLengthErrorMessage(fieldName);
    return '';
  }
  // Form submission function
  async SubmitForm() {

    this.saveError=true;
    if(this.NameControl.valid&&
      this.SurNameControl.valid&&
      this.BirthDateControl.valid&&
      this.JobTypeControl.valid&&
      this.JobStartDateControl.valid&&
      this.JobEndDateControl.valid&&
      this.GovDocumentTypeControl.valid&&
      this.GovDocumentNumberControl.valid
      )this.saveError=false;

    if (this.saveError == false) {

      let GovernmentDocumentTypeId = this.idTypes.find((obj) => {
        return obj.name === this.GovDocumentTypeControl.value;
      })!.id;
      let GovernmentDocumentDescription = this.idTypes.find((obj) => {
        return obj.name === this.GovDocumentTypeControl.value;
      })!.descripion;

      let JobDetailsTypeId = this.jobTypes.find((obj) => {
        return obj.name === this.JobTypeControl.value;
      })!.id;
      let JobDetailsDescription = this.jobTypes.find((obj) => {
        return obj.name === this.JobTypeControl.value;
      })!.descripion;

      this.UserInfo = new UserDTO(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        this.NameControl.value!,
        this.SurNameControl.value!,
        "email",
        this.BirthDateControl.value!,
        new JobDetailsDTO(
          JobDetailsTypeId,
          this.JobTypeControl.value!,
          JobDetailsDescription,
          this.JobStartDateControl.value!,
          this.JobEndDateControl.value!
        ),
        new GovernmentDocumentDTO(
          GovernmentDocumentTypeId,
          this.GovDocumentTypeControl.value!,
          GovernmentDocumentDescription,
          this.GovDocumentNumberControl.value!
        )
      );

      if(await UserPostService.PostUser(this.UserInfo)){this.OpenConfirmDialog();}
    }
  }

  DiscardForm() {
    this.DiscardClientData.emit();
  }

  OpenConfirmDialog(){
    const dialog = this.dialogRef.open(ConfirmPopUpComponent,{data: {}});
    dialog.componentInstance.onCloseReason.subscribe((data) => {
      if(data)this.SaveUserInfo();
    });
  }

  SaveUserInfo(){
    this.SetClientData.emit(this.UserInfo!);
  }


}
