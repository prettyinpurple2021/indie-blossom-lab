import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  // Auth: require a logged-in user
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return json({ error: 'Unauthorized' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: userData, error: userErr } = await userClient.auth.getUser()
  if (userErr || !userData.user?.email) return json({ error: 'Unauthorized' }, 401)

  const email = userData.user.email.toLowerCase()
  const admin = createClient(supabaseUrl, serviceKey)

  // GET: return suppression status
  if (req.method === 'GET') {
    const { data } = await admin
      .from('suppressed_emails')
      .select('email, reason, created_at')
      .eq('email', email)
      .maybeSingle()
    return json({ email, suppressed: !!data, record: data ?? null })
  }

  // POST: { action: 'resubscribe' }
  if (req.method === 'POST') {
    let body: any = {}
    try { body = await req.json() } catch { /* noop */ }

    if (body.action === 'resubscribe') {
      const { error: delSupErr } = await admin
        .from('suppressed_emails')
        .delete()
        .eq('email', email)
      if (delSupErr) {
        console.error('resubscribe delete suppressed failed', delSupErr)
        return json({ error: 'Failed to resubscribe' }, 500)
      }
      // Reset unsubscribe token so a fresh one can be issued on next send
      await admin.from('email_unsubscribe_tokens').delete().eq('email', email)
      return json({ success: true })
    }

    return json({ error: 'Unknown action' }, 400)
  }

  return json({ error: 'Method not allowed' }, 405)
})