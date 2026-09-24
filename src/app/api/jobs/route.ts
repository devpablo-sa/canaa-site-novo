import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getDb } from "@/lib/db";
import { sendMail, escapeHtml } from "@/lib/mailer";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  const form = await req.formData();

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const area = String(form.get("area") || "").trim();
  const message = String(form.get("message") || "").trim();
  const resume = form.get("resume");

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }
  if (!(resume instanceof File) || resume.type !== "application/pdf") {
    return NextResponse.json({ error: "Currículo deve ser um PDF" }, { status: 400 });
  }
  if (resume.size > MAX_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await resume.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}.pdf`;
  await writeFile(path.join(uploadsDir, filename), buffer);

  const db = getDb();
  db.prepare(
    `INSERT INTO leads (source, name, company, whatsapp, email, message, lgpd_consent) VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).run("trabalhe-conosco", name, area, phone, email, message);

  await sendMail({
    subject: `Nova candidatura — ${area || "Trabalhe conosco"}`,
    replyTo: email,
    html: `
      <h2>Nova candidatura recebida</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Área de interesse:</strong> ${escapeHtml(area)}</p>
      <p><strong>Mensagem:</strong> ${escapeHtml(message || "—")}</p>
      <p><strong>Currículo salvo em:</strong> /uploads/resumes/${filename}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
