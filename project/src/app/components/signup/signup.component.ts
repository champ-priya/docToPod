import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  fullName = '';
  loading = false;
  error = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async signupWithEmail() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    const { data, error } = await this.supabaseService.signUp(
      this.email,
      this.password,
      this.fullName
    );

    if (error) {
      this.error = error.message;
      this.loading = false;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  signupWithGoogle() {
    alert('Google signup will be implemented soon');
  }

  signupWithApple() {
    alert('Apple signup will be implemented soon');
  }
}
