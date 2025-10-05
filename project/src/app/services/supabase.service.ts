import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Podcast {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  source_type: 'website' | 'youtube' | 'pdf' | 'text';
  source_url?: string;
  source_content?: string;
  language: string;
  host_voices: string[];
  duration: number;
  audio_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      'https://uruusazzwmcyryikczrv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydXVzYXp6d21jeXJ5aWtjenJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2Mzg4OTksImV4cCI6MjA3NTIxNDg5OX0.tk18zxt75Yyfm6er616uFASD_bzeYkNC4rZ0R1X3haU'
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        this.currentUserSubject.next(session?.user ?? null);
      })();
    });

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async createPodcast(podcast: Podcast) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('podcasts')
      .insert([{ ...podcast, user_id: user.id }])
      .select()
      .single();

    return { data, error };
  }

  async getPodcasts() {
    const { data, error } = await this.supabase
      .from('podcasts')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  }

  async getPodcastById(id: string) {
    const { data, error } = await this.supabase
      .from('podcasts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    return { data, error };
  }

  async updatePodcast(id: string, updates: Partial<Podcast>) {
    const { data, error } = await this.supabase
      .from('podcasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deletePodcast(id: string) {
    const { error } = await this.supabase
      .from('podcasts')
      .delete()
      .eq('id', id);

    return { error };
  }
}
