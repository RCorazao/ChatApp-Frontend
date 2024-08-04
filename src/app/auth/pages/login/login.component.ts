import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { SignInRequest } from '../../interfaces/signin.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form: FormGroup;
  public message?: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(){
    if (this.form.valid){
      this.signIn(this.form.value);
    }
  }

  private signIn(request: SignInRequest) {
    this.authService.signIn(request)
      .subscribe( {
        next: response => {
          this.authService.loggedUser = response.data;
          this.router.navigate(['/chat']);
        },
        error: err => this.message = err.error.message
      });
  }

}
