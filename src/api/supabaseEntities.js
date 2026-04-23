import { supabase } from '@/supabaseClient';

function makeEntity(tableName) {
  return {
    async list(orderBy) {
      let q = supabase.from(tableName).select('*');
      if (orderBy) {
        const desc = orderBy.startsWith('-');
        q = q.order(desc ? orderBy.slice(1) : orderBy, { ascending: !desc });
      }
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async filter(filters, orderBy) {
      let q = supabase.from(tableName).select('*');
      for (const [key, val] of Object.entries(filters)) {
        q = q.eq(key, val);
      }
      if (orderBy) {
        const desc = orderBy.startsWith('-');
        q = q.order(desc ? orderBy.slice(1) : orderBy, { ascending: !desc });
      }
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async create(data) {
      const { data: row, error } = await supabase.from(tableName).insert(data).select().single();
      if (error) throw error;
      return row;
    },

    async update(id, data) {
      const { data: row, error } = await supabase.from(tableName).update(data).eq('id', id).select().single();
      if (error) throw error;
      return row;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const entities = {
  Announcement: makeEntity('announcements'),
  Workshop: makeEntity('workshops'),
  Resource: makeEntity('resources'),
  Ranking: makeEntity('rankings'),
  Chapter: makeEntity('chapters'),
  ChapterMember: makeEntity('chapter_members'),
  ChapterAnnouncement: makeEntity('chapter_announcements'),
  CompetitionEvent: makeEntity('competition_events'),
  CurriculumUnit: makeEntity('curriculum_units'),
  EventRegistration: makeEntity('event_registrations'),
};
