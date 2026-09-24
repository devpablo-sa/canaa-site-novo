import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }
  const db = getDb();
  db.prepare(`INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)`).run(parsed.data.email);
  return NextResponse.json({ ok: true });
}
