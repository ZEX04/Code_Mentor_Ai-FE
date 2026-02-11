
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqqdmxvhhrxdghnhefmp.supabase.co';
const supabaseKey = 'sb_publishable_uFkTNQBEEI5_cfWrKmSseQ_76imNDzP';

export const supabase = createClient(supabaseUrl, supabaseKey);
