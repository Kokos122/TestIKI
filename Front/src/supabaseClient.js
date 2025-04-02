import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcubdookacnahxhgqehg.supabase.co' // замени на свой
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjdWJkb29rYWNuYWh4aGdxZWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTk2MTYsImV4cCI6MjA1ODQ5NTYxNn0.hNbD8HEv7s3j5UVsSe38mlusUvKKHchS2tMg4jUEynM'       // замени на свой

export const supabase = createClient(supabaseUrl, supabaseKey)
