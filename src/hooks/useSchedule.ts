import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  duration: number;
  event_type: string;
  task_id: string | null;
  internship_id: string | null;
  created_at: string;
}

export function useSchedule(userId: string | undefined) {
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchScheduleEvents();
    }
  }, [userId]);

  const fetchScheduleEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setScheduleEvents(data || []);
    } catch (error) {
      console.error('Error fetching schedule events:', error);
      toast.error('Failed to load schedule events');
    } finally {
      setLoading(false);
    }
  };

  const createScheduleEvent = async (event: Omit<ScheduleEvent, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .insert([
          {
            ...event,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setScheduleEvents(prev => [...prev, data]);
      toast.success('Event scheduled!');
      return data;
    } catch (error) {
      console.error('Error creating schedule event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  const updateScheduleEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setScheduleEvents(prev => prev.map(e => e.id === id ? data : e));
      toast.success('Event updated');
      return data;
    } catch (error) {
      console.error('Error updating schedule event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  };

  const deleteScheduleEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setScheduleEvents(prev => prev.filter(e => e.id !== id));
      toast.success('Event deleted');
    } catch (error) {
      console.error('Error deleting schedule event:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  };

  return {
    scheduleEvents,
    loading,
    createScheduleEvent,
    updateScheduleEvent,
    deleteScheduleEvent,
    refetch: fetchScheduleEvents,
  };
}