import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import * as db from './db';
import * as auth from './auth';

const PORT = 3000;

// Express 4 does not forward rejected promises from async handlers to the
// error middleware on its own — this wrapper makes sure a DB failure returns
// a 500 instead of leaving the request hanging.
function asyncHandler(fn: (req: express.Request, res: express.Response) => Promise<any>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res).catch(next);
  };
}

function createSmtpTransporter(smtp: Pick<db.SmtpConfig, 'host' | 'port' | 'secure' | 'user' | 'pass'>) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

async function startServer() {
  await db.waitForDb();
  await db.ensureSeeded();

  const app = express();
  app.use(express.json());

  // API Endpoints

  // --- ADMIN AUTH ---
  app.post('/api/admin/login', asyncHandler(async (req, res) => {
    const { passcode } = req.body;
    if (!auth.checkPassword(passcode)) {
      return res.status(401).json({ error: 'Code de sécurité incorrect. Veuillez contacter l\'administrateur système.' });
    }
    const token = auth.createSession();
    auth.setSessionCookie(res, token);
    res.json({ success: true });
  }));

  app.post('/api/admin/logout', asyncHandler(async (req, res) => {
    auth.destroySession(auth.getSessionToken(req));
    auth.clearSessionCookie(res);
    res.json({ success: true });
  }));

  app.get('/api/admin/session', asyncHandler(async (req, res) => {
    res.json({ authenticated: auth.isValidSession(auth.getSessionToken(req)) });
  }));

  // --- SERVICES ---
  app.get('/api/services', asyncHandler(async (req, res) => {
    res.json(await db.getServices());
  }));

  app.post('/api/services', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setServices(req.body);
      res.json({ success: true, message: 'Services saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // --- PROJECTS ---
  app.get('/api/projects', asyncHandler(async (req, res) => {
    res.json(await db.getProjects());
  }));

  app.post('/api/projects', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setProjects(req.body);
      res.json({ success: true, message: 'Projects saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // --- TESTIMONIALS ---
  app.get('/api/testimonials', asyncHandler(async (req, res) => {
    res.json(await db.getTestimonials());
  }));

  app.post('/api/testimonials', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setTestimonials(req.body);
      res.json({ success: true, message: 'Testimonials saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // --- TEAM MEMBERS ---
  app.get('/api/team', asyncHandler(async (req, res) => {
    res.json(await db.getTeam());
  }));

  app.post('/api/team', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setTeam(req.body);
      res.json({ success: true, message: 'Team members saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // --- BENEFITS ---
  app.get('/api/benefits', asyncHandler(async (req, res) => {
    res.json(await db.getBenefits());
  }));

  app.post('/api/benefits', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setBenefits(req.body);
      res.json({ success: true, message: 'Benefits saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // --- FORMATIONS ---
  app.get('/api/formations', asyncHandler(async (req, res) => {
    res.json(await db.getFormations());
  }));

  app.post('/api/formations', auth.requireAdmin, asyncHandler(async (req, res) => {
    if (Array.isArray(req.body)) {
      await db.setFormations(req.body);
      res.json({ success: true, message: 'Formations saved successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  }));

  // Submit contact message
  app.post('/api/contact', asyncHandler(async (req, res) => {
    const { name, email, subject, message, company, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const newMessage = await db.addMessage({ name, email, company, phone, subject, message });

    // Dynamic SMTP Notification
    const smtp = await db.getSmtpConfig();
    if (smtp.enabled && smtp.host && smtp.user && smtp.pass) {
      try {
        const transporter = createSmtpTransporter(smtp);

        const mailSubject = `[WisTech Contact] ${subject || 'Nouveau message'}`;
        const mailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="background-color: #0b1329; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; color: #d4af37; letter-spacing: 1px;">WisTechnologie CMS</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Nouveau Message de Contact</p>
            </div>
            <div style="padding: 20px; color: #1e293b;">
              <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Détails de la demande :</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #64748b;">Nom :</td>
                  <td style="padding: 8px 0; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email :</td>
                  <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Téléphone :</td>
                  <td style="padding: 8px 0; color: #0f172a;">${phone || 'Non renseigné'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Entreprise :</td>
                  <td style="padding: 8px 0; color: #0f172a;">${company || 'Non renseigné'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Sujet :</td>
                  <td style="padding: 8px 0; color: #0f172a;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 25px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #d4af37; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; font-size: 13px; color: #64748b; margin-bottom: 8px;">Message :</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Cet e-mail a été envoyé automatiquement par le système de messagerie de WisTechnologie.
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"${smtp.user}" <${smtp.user}>`,
          to: smtp.toEmail || 'samakedelamou858@gmail.com',
          subject: mailSubject,
          html: mailHtml,
          text: `Nouveau message de contact de ${name} (${email}):\nSujet: ${subject}\nMessage:\n${message}`
        });
        console.log('SMTP notification email sent successfully.');
      } catch (mailErr) {
        console.error('SMTP email dispatch error:', mailErr);
      }
    }

    res.json({ success: true, message: 'Message received successfully', data: newMessage });
  }));

  // Get messages (For the admin to view in CMS)
  app.get('/api/messages', auth.requireAdmin, asyncHandler(async (req, res) => {
    res.json(await db.getMessages());
  }));

  // --- SMTP SETTINGS ENDPOINTS (admin-only: this exposes the SMTP password) ---
  app.get('/api/settings/smtp', auth.requireAdmin, asyncHandler(async (req, res) => {
    res.json(await db.getSmtpConfig());
  }));

  app.post('/api/settings/smtp', auth.requireAdmin, asyncHandler(async (req, res) => {
    const { host, port, secure, user, pass, toEmail, enabled } = req.body;
    const current = await db.getSmtpConfig();
    const smtp = await db.setSmtpConfig({
      host: host || '',
      port: Number(port) || 587,
      secure: !!secure,
      user: user || '',
      pass: pass || '',
      toEmail: toEmail || 'samakedelamou858@gmail.com',
      enabled: enabled !== undefined ? !!enabled : current.enabled
    });
    res.json({ success: true, message: 'Configuration SMTP enregistrée avec succès', smtp });
  }));

  app.post('/api/settings/smtp/test', auth.requireAdmin, asyncHandler(async (req, res) => {
    const { host, port, secure, user, pass, toEmail } = req.body;
    const current = await db.getSmtpConfig();
    const testSmtp = {
      host: host || current.host,
      port: Number(port) || current.port,
      secure: secure !== undefined ? !!secure : current.secure,
      user: user || current.user,
      pass: pass || current.pass,
      toEmail: toEmail || current.toEmail || 'samakedelamou858@gmail.com'
    };

    if (!testSmtp.host || !testSmtp.user || !testSmtp.pass) {
      return res.status(400).json({ error: 'Le serveur, l\'utilisateur et le mot de passe SMTP sont obligatoires pour effectuer le test.' });
    }

    try {
      const transporter = createSmtpTransporter(testSmtp);

      await transporter.verify();

      await transporter.sendMail({
        from: `"${testSmtp.user}" <${testSmtp.user}>`,
        to: testSmtp.toEmail,
        subject: 'WisTechnologie - Test SMTP réussi',
        text: 'Votre configuration SMTP fonctionne parfaitement sur WisTechnologie.',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="background-color: #0b1329; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; color: #d4af37; letter-spacing: 1px;">WisTechnologie CMS</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Test de Configuration SMTP</p>
            </div>
            <div style="padding: 20px; color: #1e293b; text-align: center;">
              <p style="font-size: 18px; font-weight: bold; color: #10b981; margin-bottom: 15px;">Connexion SMTP Réussie !</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Votre serveur SMTP a été testé avec succès. Les notifications de contact seront désormais acheminées de manière fiable à l'adresse suivante :
              </p>
              <p style="font-size: 16px; font-weight: bold; color: #0b1329; background-color: #f1f5f9; padding: 10px; border-radius: 6px; display: inline-block;">
                ${testSmtp.toEmail}
              </p>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Cet e-mail de test a été généré depuis la console d'administration WisTechnologie.
            </div>
          </div>
        `
      });

      res.json({ success: true, message: 'Test SMTP réussi ! E-mail de test envoyé.' });
    } catch (err: any) {
      console.error('SMTP test direct failure:', err);
      res.status(500).json({ error: `Échec du test SMTP : ${err.message}` });
    }
  }));

  // Reset to default
  app.post('/api/reset', auth.requireAdmin, asyncHandler(async (req, res) => {
    await db.resetContentToDefaults();
    res.json({ success: true, message: 'Data reset to default values' });
  }));

  // Admin activity notifications: the CMS calls this after every successful
  // login and content action so the site owner gets an email trail of who
  // touched the admin console and what they did. Fire-and-forget from the
  // client's point of view — always responds success even if email is off
  // or fails, so a notification hiccup never blocks the admin's actual work.
  app.post('/api/admin/notify', auth.requireAdmin, asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const smtp = await db.getSmtpConfig();
    if (smtp.enabled && smtp.host && smtp.user && smtp.pass) {
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'IP inconnue';
      const userAgent = req.headers['user-agent'] || 'Navigateur inconnu';
      const timestamp = new Date().toLocaleString('fr-FR');

      try {
        const transporter = createSmtpTransporter(smtp);
        await transporter.sendMail({
          from: `"${smtp.user}" <${smtp.user}>`,
          to: smtp.toEmail || 'samakedelamou858@gmail.com',
          subject: `[WisTech CMS] ${message}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="background-color: #0b1329; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
                <h2 style="margin: 0; font-size: 20px; color: #d4af37; letter-spacing: 1px;">WisTechnologie CMS</h2>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Activité sur la console d'administration</p>
              </div>
              <div style="padding: 20px; color: #1e293b;">
                <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">${message}</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #64748b;">Date :</td>
                    <td style="padding: 8px 0; color: #0f172a;">${timestamp}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Adresse IP :</td>
                    <td style="padding: 8px 0; color: #0f172a;">${ip}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Navigateur :</td>
                    <td style="padding: 8px 0; color: #0f172a;">${userAgent}</td>
                  </tr>
                </table>
              </div>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                Notification automatique de la console d'administration WisTechnologie.
              </div>
            </div>
          `,
          text: `${message}\nDate : ${timestamp}\nIP : ${ip}\nNavigateur : ${userAgent}`
        });
        console.log(`Admin notify email sent: "${message}"`);
      } catch (err) {
        console.error('Admin notify email dispatch error:', err);
      }
    }

    res.json({ success: true });
  }));

  // Vite integration middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handler for async route failures (e.g. DB connection drops) — must
  // be registered last so it can catch errors from every route above.
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
