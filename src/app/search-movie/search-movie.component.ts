import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { SearchMovie } from '../search-movie.model';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  searchForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      identifier: [''],
      title: [''],
      type: ['series', Validators.required],
      releaseYear: ['', [Validators.required, this.rangeDateValidator(1900, new Date().getFullYear())]],
      fiche: [{ value: 'courte', disabled: true }]
    });
    
    this.searchForm.patchValue({
      fiche: 'courte'
    });

    this.searchForm.get('identifier')?.valueChanges.subscribe(value => {
      const ficheControl = this.searchForm.get('fiche');
      if (value) {
        ficheControl?.enable();
      } else {
        ficheControl?.disable();
      }
    });
  }

  ngOnInit() {}

  get formControls() {
    return this.searchForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    const formData: SearchMovie = this.searchForm.value;
    console.log('Formulaire envoyé: ', formData);
  }

  rangeDateValidator(minYear: number, maxYear: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const releaseYear = control.value;
      if (releaseYear < minYear || releaseYear > maxYear) {
        return { min: { minYear, maxYear } };
      }
      return null;
    };
  }

  isRequiredValidator(controlName1: string, controlName2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const title = control.get(controlName1);
      const identifier = control.get(controlName2);

      if (!(title?.value || identifier?.value)) {
        return { 'isRequired': true };
      }
      return null;
    };
  }
}
