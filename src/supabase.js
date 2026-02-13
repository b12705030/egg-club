// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgmlyxrutintssqzdxdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbWx5eHJ1dGludHNzcXpkeGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYyMDEsImV4cCI6MjA4NjIwMjIwMX0.cHF13jyn3Gog93QhLDUpD3UV0Y-1e0FMyDrRv_vbtD4';

export const supabase = createClient(supabaseUrl, supabaseKey);
