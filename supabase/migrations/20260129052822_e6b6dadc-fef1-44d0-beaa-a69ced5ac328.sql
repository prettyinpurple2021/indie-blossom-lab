-- Create RLS policies for api_rate_limits table
-- This table is managed by edge functions using service role (bypasses RLS)
-- Users should not have direct access to rate limit data

-- Policy: Deny all user SELECT access (service role bypasses RLS)
CREATE POLICY "No user select on rate limits"
ON public.api_rate_limits
FOR SELECT
TO authenticated
USING (false);

-- Policy: Deny all user INSERT access
CREATE POLICY "No user insert on rate limits"
ON public.api_rate_limits
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy: Deny all user UPDATE access
CREATE POLICY "No user update on rate limits"
ON public.api_rate_limits
FOR UPDATE
TO authenticated
USING (false);

-- Policy: Deny all user DELETE access
CREATE POLICY "No user delete on rate limits"
ON public.api_rate_limits
FOR DELETE
TO authenticated
USING (false);