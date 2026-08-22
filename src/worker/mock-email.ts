import fs from 'fs/promises';
import path from 'path';

const MAIL_DIR = path.resolve(process.cwd(), 'mail-received');

export async function sendMockEmail(jobId: string, to: string, from: string, subject: string, body: string) {
  // Ensure the directory exists
  await fs.mkdir(MAIL_DIR, { recursive: true });

  const emailContent = `
To: ${to}
From: ${from}
Subject: ${subject}
Date: ${new Date().toISOString()}

${body}
  `.trim();

  const filePath = path.join(MAIL_DIR, `${jobId}.txt`);
  await fs.writeFile(filePath, emailContent, 'utf-8');
  console.log(`[MockEmail] Sent email to ${to}, saved as ${filePath}`);
}
