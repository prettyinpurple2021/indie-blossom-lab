/**
 * @file useAnnouncements.ts — Hooks for the announcements (banner) system.
 *
 * - useActiveAnnouncements: student-facing — returns announcements that are
 *   currently within their date window AND not yet dismissed by the user.
 * - useDismissAnnouncement: marks an announcement as dismissed for the
 *   current user (server-side, so dismissals persist across devices).
 * - Admin hooks (useAdminAnnouncements, useUpsertAnnouncement,
 *   useDeleteAnnouncement) power the admin CRUD page.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AnnouncementSeverity = 'info' | 'success' | 'warning';

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  severity: AnnouncementSeverity;
  cta_label: string | null;
  cta_url: string | null;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Public/student hook — returns the list of currently-active announcements
 * that the signed-in user has NOT yet dismissed. Polls every 5 minutes.
 */
export function useActiveAnnouncements() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['announcements', 'active', user?.id ?? 'anon'],
    enabled: !!user,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    queryFn: async (): Promise<Announcement[]> => {
      const nowIso = new Date().toISOString();

      const { data: active, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', nowIso)
        .or(`ends_at.is.null,ends_at.gt.${nowIso}`)
        .order('starts_at', { ascending: false });

      if (error) throw error;
      if (!active || active.length === 0) return [];

      const { data: dismissals } = await supabase
        .from('announcement_dismissals')
        .select('announcement_id')
        .eq('user_id', user!.id)
        .in('announcement_id', active.map((a) => a.id));

      const dismissed = new Set((dismissals ?? []).map((d) => d.announcement_id));
      return (active as Announcement[]).filter((a) => !dismissed.has(a.id));
    },
  });
}

/** Mutation: dismiss an announcement for the current user. */
export function useDismissAnnouncement() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (announcementId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('announcement_dismissals')
        .insert({ user_id: user.id, announcement_id: announcementId });
      // Ignore unique-violation: already dismissed
      if (error && error.code !== '23505') throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements', 'active'] });
    },
  });
}

/* ─────────────────────  ADMIN HOOKS  ───────────────────── */

export function useAdminAnnouncements() {
  return useQuery({
    queryKey: ['announcements', 'admin', 'all'],
    queryFn: async (): Promise<Announcement[]> => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Announcement[];
    },
  });
}

export interface AnnouncementInput {
  id?: string;
  title: string;
  body?: string | null;
  severity: AnnouncementSeverity;
  cta_label?: string | null;
  cta_url?: string | null;
  starts_at: string;
  ends_at?: string | null;
  is_active: boolean;
}

export function useUpsertAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AnnouncementInput) => {
      if (input.id) {
        const { id, ...rest } = input;
        const { error } = await supabase.from('announcements').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert(input);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}