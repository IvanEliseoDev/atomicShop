import { config } from "../config";

// Uses Brevo's HTTP API (HTTPS port 443) instead of SMTP.
// Render free tier blocks outbound SMTP ports (587/465), but HTTPS works fine.
export const transporter = {
  sendMail: async (options: {
    from?: string;
    to: string | undefined;
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }) => {
    if (!options.to) throw new Error("sendMail: destinatario 'to' requerido");

    // Convert nodemailer-style attachments to Brevo's base64 format
    const attachment = options.attachments?.map((a) => ({
      name: a.filename,
      content:
        Buffer.isBuffer(a.content)
          ? a.content.toString("base64")
          : Buffer.from(a.content).toString("base64"),
    }));

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "AtomicShop", email: config.email.from },
        to: [{ email: options.to }],
        ...(options.replyTo && { replyTo: { email: options.replyTo } }),
        subject: options.subject,
        htmlContent: options.html,
        ...(attachment && attachment.length > 0 && { attachment }),
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Brevo API error ${response.status}: ${JSON.stringify(body)}`);
    }

    return response.json();
  },
};
