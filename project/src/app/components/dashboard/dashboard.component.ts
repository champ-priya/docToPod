import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService, Podcast } from '../../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  podcasts: Podcast[] = [];
  loading = true;
  error = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadPodcasts();
  }

  async loadPodcasts() {
    this.loading = true;
    const { data, error } = await this.supabaseService.getPodcasts();

    if (error) {
      this.error = error.message;
    } else {
      this.podcasts = data || [];
    }
    this.loading = false;
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  async deletePodcast(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this podcast?')) {
      const { error } = await this.supabaseService.deletePodcast(id);
      if (!error) {
        await this.loadPodcasts();
      }
    }
  }

  playPodcast(podcast: Podcast) {
    if (podcast.status === 'completed' && podcast.audio_url) {
      alert(`Playing: ${podcast.title}`);
    }
  }
}
