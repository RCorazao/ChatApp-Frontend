import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'shared-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  form: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  avatarError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      avatar: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('firstName', this.form.get('firstName')?.value);
      formData.append('lastName', this.form.get('lastName')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('password', this.form.get('password')?.value);
      formData.append('avatar', this.form.get('avatar')?.value as File);

      this.signUp(formData);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match('image.*')) {
        this.avatarError = null;
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarPreview = reader.result;
        };
        reader.readAsDataURL(file);
        this.form.patchValue({ avatar: file });
      } else {
        this.avatarError = 'Invalid file type. Please upload an image.';
        this.avatarPreview = null;
        this.form.patchValue({ avatar: null });
      }
    }
  }

  private signUp(formData: FormData) {
    this.authService.signUp(formData)
      .subscribe( {
        next: () => {
          this.router.navigate(['/login']);
        },
        error: err => this.handleBackendErrors(err)
      });
  }

  handleBackendErrors(error: any) {   
    if (error.error && error.error.errors) {
      const backendErrors = error.error.errors;
      Object.keys(backendErrors).forEach((field) => {
        const control = this.form.get(field.toLowerCase());        
        if (control) {
          control.setErrors({ backend: backendErrors[field] });
        }
      });
    }
  }

}
