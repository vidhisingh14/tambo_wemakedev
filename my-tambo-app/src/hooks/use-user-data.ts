"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase/client';

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
};

export type UserProgress = {
  streak: number;
  problems_solved: number;
  global_rank: number | null;
  last_activity_date: string | null;
};

export type UserSkill = {
  subject: string;
  proficiency: number;
};

export type Application = {
  id: string;
  company: string;
  company_logo: string | null;
  role: string;
  location: string | null;
  status: 'Interview' | 'OA Pending' | 'Applied' | 'Rejected' | 'Offer';
  stage: string | null;
  next_step: string | null;
  applied_date: string | null;
  notes: string | null;
};

export type Interview = {
  id: string;
  company: string;
  role: string;
  type: string;
  scheduled_at: string;
};

export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchUserData() {
      if (!user) return;
      try {
        setLoading(true);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          // PGRST116 = no rows, which is ok for new users
          throw progressError;
        }
        setProgress(progressData || {
          streak: 0,
          problems_solved: 0,
          global_rank: null,
          last_activity_date: null
        });

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select('subject, proficiency')
          .eq('user_id', user.id);

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Fetch applications
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Fetch upcoming interviews
        const { data: interviewsData, error: interviewsError } = await supabase
          .from('interviews')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1);

        if (interviewsError) throw interviewsError;
        setInterviews(interviewsData || []);

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchUserData();

    // Subscribe to realtime changes
    const applicationsSubscription = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch applications on change
          supabase
            .from('applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => setApplications(data || []));
        }
      )
      .subscribe();

    return () => {
      applicationsSubscription.unsubscribe();
    };
  }, [user]);

  return { profile, progress, skills, applications, interviews, loading, error };
}
