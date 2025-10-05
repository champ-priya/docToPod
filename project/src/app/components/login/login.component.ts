import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async loginWithEmail() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    const { data, error } = await this.supabaseService.signIn(this.email, this.password);

    if (error) {
      this.error = error.message;
      this.loading = false;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loginWithGoogle() {
    alert('Google login will be implemented soon');
  }

  loginWithApple() {
    alert('Apple login will be implemented soon');
  }
}
