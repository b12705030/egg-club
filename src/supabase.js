// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apimbgxhxqmmpoxsufzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaW1iZ3hoeHFtbXBveHN1ZnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNjk3ODksImV4cCI6MjA2NTc0NTc4OX0.eTMgaxr8O6EPAzY1xb9c4Co9yvGGZD9W1B1xghmeXaE';

export const supabase = createClient(supabaseUrl, supabaseKey);
