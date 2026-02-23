/**
 * Minimal type declarations for Supabase Edge Functions (Deno runtime).
 * For full IntelliSense, install the "Deno" extension and enable it for this folder.
 */
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port?: number }
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.49.1" {
  export function createClient(url: string, key: string): {
    auth: { getUser(token: string): Promise<unknown>; admin: { getUserById(id: string): Promise<unknown> } };
    from(table: string): { select(cols: string): unknown; insert(row: unknown): Promise<{ error?: unknown }> };
  };
}

declare module "https://deno.land/x/smtp@v0.7.0/mod.ts" {
  export class SmtpClient {
    connectTLS(options: unknown): Promise<void>;
    send(options: unknown): Promise<void>;
    close(): Promise<void>;
  }
}
