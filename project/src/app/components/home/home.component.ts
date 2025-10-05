import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService, Podcast } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedTab: 'website' | 'youtube' | 'pdf' | 'text' = 'website';
  inputUrl = '';
  textContent = '';
  selectedLanguage = 'American English';
  selectedHosts = ['Emily', 'Michael'];
  loading = false;
  error = '';

  examplePrompts = [
    { icon: '📄', text: 'Stanford AI Index Report 2024' },
    { icon: '🎥', text: "Musk's Vision: Building Tomorrow" },
    { icon: '📚', text: 'Knowledge Distillation in LLM' },
    { icon: '📝', text: '5 daily productivity tips' }
  ];

  constructor(
    private supabaseService: SupabaseService,
    public router: Router
  ) {}

  selectTab(tab: 'website' | 'youtube' | 'pdf' | 'text') {
    this.selectedTab = tab;
    this.inputUrl = '';
    this.textContent = '';
  }

  toggleHost(host: string) {
    const index = this.selectedHosts.indexOf(host);
    if (index > -1) {
      if (this.selectedHosts.length > 1) {
        this.selectedHosts.splice(index, 1);
      }
    } else {
      this.selectedHosts.push(host);
    }
  }

  async startGenerate() {
    const user = this.supabaseService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedTab !== 'text' && !this.inputUrl) {
      this.error = 'Please enter a URL';
      return;
    }

    if (this.selectedTab === 'text' && !this.textContent) {
      this.error = 'Please enter some text';
      return;
    }

    this.loading = true;
    this.error = '';

    const podcast: Podcast = {
      title: this.selectedTab === 'text'
        ? 'Custom Text Podcast'
        : `Podcast from ${this.selectedTab}`,
      description: this.selectedTab === 'text' ? this.textContent.substring(0, 200) : this.inputUrl,
      source_type: this.selectedTab,
      source_url: this.selectedTab !== 'text' ? this.inputUrl : undefined,
      source_content: this.selectedTab === 'text' ? this.textContent : undefined,
      language: this.selectedLanguage,
      host_voices: this.selectedHosts,
      duration: 0,
      status: 'processing'
    };

    const { data, error } = await this.supabaseService.createPodcast(podcast);

    if (error) {
      this.error = error.message;
      this.loading = false;
    } else {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    }
  }

  useExamplePrompt(prompt: string) {
    this.textContent = prompt;
    this.selectedTab = 'text';
  }
}
