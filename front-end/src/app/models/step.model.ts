import { UntypedFormGroup } from '@angular/forms';

export interface IStep {
  icon: string;
  title: string;
  text: string;
}

export interface IActiveStep {
  [key: string]: number;
}

export interface IServiceForms {
  [key: string]: UntypedFormGroup;
}
