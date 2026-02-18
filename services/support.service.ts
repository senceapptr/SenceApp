import { supabase } from '@/lib/supabase';

export interface SupportRequestInput {
  category: string;
  message: string;
  subject: string;
}

export interface FeedbackRequestInput {
  message: string;
  subject: string;
  type: string;
}

export const supportService = {
  async submitSupportRequest(input: SupportRequestInput) {
    try {
      const { data, error } = await supabase.functions.invoke('support-intake', {
        body: {
          action: 'submit_support',
          ...input,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return { data: data?.data || null, error: null };
    } catch (error) {
      console.error('submitSupportRequest error:', error);
      return { data: null, error: error as Error };
    }
  },

  async submitFeedback(input: FeedbackRequestInput) {
    try {
      const { data, error } = await supabase.functions.invoke('support-intake', {
        body: {
          action: 'submit_feedback',
          ...input,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return { data: data?.data || null, error: null };
    } catch (error) {
      console.error('submitFeedback error:', error);
      return { data: null, error: error as Error };
    }
  },
};
