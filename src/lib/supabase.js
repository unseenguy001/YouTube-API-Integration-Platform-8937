import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  console.warn('Please update your Supabase credentials in src/lib/supabase.js')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase