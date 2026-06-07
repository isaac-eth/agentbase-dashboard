import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Stores which clients have already been sent their payment info.
 *
 * State lives in Vercel KV (Upstash Redis) so it is shared across every device
 * and user — check a box on one machine and everyone sees it. It is kept as a
 * single Redis hash `payment-info-sent`, keyed by agent name, value "1".
 *
 * Requires the KV env vars (KV_REST_API_URL / KV_REST_API_TOKEN) that Vercel
 * injects when a KV store is connected to the project. When they are missing
 * the endpoint degrades gracefully: reads return an empty map and writes 503,
 * so the rest of the Clients page keeps working.
 */
export const dynamic = "force-dynamic";

const HASH_KEY = "payment-info-sent";

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// GET -> { configured: boolean, sent: Record<agentName, true> }
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!kvConfigured()) {
    return NextResponse.json({ configured: false, sent: {} });
  }

  const { kv } = await import("@vercel/kv");
  const raw = (await kv.hgetall<Record<string, string>>(HASH_KEY)) ?? {};
  const sent: Record<string, boolean> = {};
  for (const agent of Object.keys(raw)) sent[agent] = true;
  return NextResponse.json({ configured: true, sent });
}

// POST { agent: string, sent: boolean } -> toggles a single client.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!kvConfigured()) {
    return NextResponse.json(
      { error: "storage not configured" },
      { status: 503 },
    );
  }

  let body: { agent?: unknown; sent?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const agent = typeof body.agent === "string" ? body.agent.trim() : "";
  if (!agent) return NextResponse.json({ error: "missing agent" }, { status: 400 });

  const { kv } = await import("@vercel/kv");
  if (body.sent) {
    await kv.hset(HASH_KEY, { [agent]: "1" });
  } else {
    await kv.hdel(HASH_KEY, agent);
  }

  return NextResponse.json({ ok: true, agent, sent: Boolean(body.sent) });
}
