import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import {
  SERVICES_DATA,
  PROJECTS_DATA,
  TESTIMONIALS_DATA,
  TEAM_DATA,
  BENEFITS_DATA,
  FORMATIONS_DATA
} from './src/data';
import { Service, Project, Testimonial, TeamMember, Benefit, Formation } from './src/types';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  toEmail: string;
  enabled: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
}

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'wistech',
        user: process.env.DB_USER || 'wistech',
        password: process.env.DB_PASSWORD || 'wistech'
      }
);

pool.on('error', (err) => {
  console.error('Erreur inattendue du pool PostgreSQL', err);
});

// Waits for the container to accept connections (it can still be starting up,
// especially on first boot while it runs db/init.sql).
export async function waitForDb(retries = 20, delayMs = 1500): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (attempt === retries) {
        throw new Error(
          `Impossible de se connecter à PostgreSQL après ${retries} tentatives. ` +
          `Vérifiez que le conteneur tourne ("npm run db:up"). Détail : ${(err as Error).message}`
        );
      }
      console.log(`En attente de PostgreSQL... (tentative ${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function replaceAll(table: string, columns: string[], rows: any[][]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM ${table}`);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    for (const row of rows) {
      await client.query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`, row);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// --- SERVICES ---
export async function getServices(): Promise<Service[]> {
  const { rows } = await pool.query('SELECT id, title, short_desc, long_desc, icon_name, features FROM services ORDER BY position ASC');
  return rows.map(r => ({ id: r.id, title: r.title, shortDesc: r.short_desc, longDesc: r.long_desc, iconName: r.icon_name, features: r.features }));
}

export async function setServices(services: Service[]): Promise<void> {
  await replaceAll(
    'services',
    ['id', 'title', 'short_desc', 'long_desc', 'icon_name', 'features', 'position'],
    services.map((s, i) => [s.id, s.title, s.shortDesc, s.longDesc, s.iconName, s.features, i])
  );
}

// --- PROJECTS ---
export async function getProjects(): Promise<Project[]> {
  const { rows } = await pool.query(
    'SELECT id, title, category, client, description, results, metric_value, metric_label, image_keyword FROM projects ORDER BY position ASC'
  );
  return rows.map(r => ({
    id: r.id, title: r.title, category: r.category, client: r.client, description: r.description,
    results: r.results, metricValue: r.metric_value, metricLabel: r.metric_label, imageKeyword: r.image_keyword
  }));
}

export async function setProjects(projects: Project[]): Promise<void> {
  await replaceAll(
    'projects',
    ['id', 'title', 'category', 'client', 'description', 'results', 'metric_value', 'metric_label', 'image_keyword', 'position'],
    projects.map((p, i) => [p.id, p.title, p.category, p.client, p.description, p.results, p.metricValue, p.metricLabel, p.imageKeyword, i])
  );
}

// --- TESTIMONIALS ---
export async function getTestimonials(): Promise<Testimonial[]> {
  const { rows } = await pool.query('SELECT id, name, role, company, content, rating FROM testimonials ORDER BY position ASC');
  return rows.map(r => ({ id: r.id, name: r.name, role: r.role, company: r.company, content: r.content, rating: r.rating }));
}

export async function setTestimonials(testimonials: Testimonial[]): Promise<void> {
  await replaceAll(
    'testimonials',
    ['id', 'name', 'role', 'company', 'content', 'rating', 'position'],
    testimonials.map((t, i) => [t.id, t.name, t.role, t.company, t.content, t.rating, i])
  );
}

// --- TEAM ---
export async function getTeam(): Promise<TeamMember[]> {
  const { rows } = await pool.query('SELECT id, name, role, bio, specialty FROM team_members ORDER BY position ASC');
  return rows.map(r => ({ id: r.id, name: r.name, role: r.role, bio: r.bio, specialty: r.specialty }));
}

export async function setTeam(team: TeamMember[]): Promise<void> {
  await replaceAll(
    'team_members',
    ['id', 'name', 'role', 'bio', 'specialty', 'position'],
    team.map((t, i) => [t.id, t.name, t.role, t.bio, t.specialty, i])
  );
}

// --- BENEFITS (no client-facing id) ---
export async function getBenefits(): Promise<Benefit[]> {
  const { rows } = await pool.query('SELECT title, description, icon FROM benefits ORDER BY position ASC');
  return rows.map(r => ({ title: r.title, desc: r.description, icon: r.icon }));
}

export async function setBenefits(benefits: Benefit[]): Promise<void> {
  await replaceAll(
    'benefits',
    ['title', 'description', 'icon', 'position'],
    benefits.map((b, i) => [b.title, b.desc, b.icon, i])
  );
}

// --- FORMATIONS ---
export async function getFormations(): Promise<Formation[]> {
  const { rows } = await pool.query(
    'SELECT id, title, description, duration, price, level, syllabus, instructor, image_keyword FROM formations ORDER BY position ASC'
  );
  return rows.map(r => ({
    id: r.id, title: r.title, description: r.description, duration: r.duration, price: r.price,
    level: r.level, syllabus: r.syllabus, instructor: r.instructor, imageKeyword: r.image_keyword
  }));
}

export async function setFormations(formations: Formation[]): Promise<void> {
  await replaceAll(
    'formations',
    ['id', 'title', 'description', 'duration', 'price', 'level', 'syllabus', 'instructor', 'image_keyword', 'position'],
    formations.map((f, i) => [f.id, f.title, f.description, f.duration, f.price, f.level, f.syllabus, f.instructor, f.imageKeyword, i])
  );
}

// --- CONTACT MESSAGES (append-only) ---
function mapMessageRow(r: any): ContactMessage {
  return {
    id: r.id, name: r.name, email: r.email, company: r.company, phone: r.phone,
    subject: r.subject, message: r.message, timestamp: new Date(r.created_at).toISOString()
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { rows } = await pool.query(
    'SELECT id, name, email, company, phone, subject, message, created_at FROM contact_messages ORDER BY created_at ASC'
  );
  return rows.map(mapMessageRow);
}

export async function addMessage(input: {
  name: string; email: string; company?: string; phone?: string; subject?: string; message: string;
}): Promise<ContactMessage> {
  const id = 'msg_' + Date.now();
  const { rows } = await pool.query(
    `INSERT INTO contact_messages (id, name, email, company, phone, subject, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, company, phone, subject, message, created_at`,
    [id, input.name, input.email, input.company || '', input.phone || '', input.subject || 'Sans Sujet', input.message]
  );
  return mapMessageRow(rows[0]);
}

// --- SMTP SETTINGS (singleton row) ---
export async function getSmtpConfig(): Promise<SmtpConfig> {
  const { rows } = await pool.query('SELECT host, port, secure, smtp_user, smtp_pass, to_email, enabled FROM smtp_settings LIMIT 1');
  const r = rows[0];
  return { host: r.host, port: r.port, secure: r.secure, user: r.smtp_user, pass: r.smtp_pass, toEmail: r.to_email, enabled: r.enabled };
}

export async function setSmtpConfig(config: SmtpConfig): Promise<SmtpConfig> {
  await pool.query(
    `INSERT INTO smtp_settings (id, host, port, secure, smtp_user, smtp_pass, to_email, enabled)
     VALUES (TRUE, $1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       host = EXCLUDED.host, port = EXCLUDED.port, secure = EXCLUDED.secure,
       smtp_user = EXCLUDED.smtp_user, smtp_pass = EXCLUDED.smtp_pass,
       to_email = EXCLUDED.to_email, enabled = EXCLUDED.enabled`,
    [config.host, config.port, config.secure, config.user, config.pass, config.toEmail, config.enabled]
  );
  return getSmtpConfig();
}

// --- RESET TO FACTORY CONTENT ---
export async function resetContentToDefaults(): Promise<void> {
  await setServices(SERVICES_DATA);
  await setProjects(PROJECTS_DATA);
  await setTestimonials(TESTIMONIALS_DATA);
  await setTeam(TEAM_DATA);
  await setBenefits(BENEFITS_DATA);
  await setFormations(FORMATIONS_DATA);
}

// --- ONE-TIME SEEDING ---
// On an empty database: import the legacy data-store.json file if this project
// was previously run with the flat-file store, otherwise fall back to the
// built-in defaults from src/data.ts. Runs once, at startup, only when tables
// are empty — never overwrites content that already lives in Postgres.
const LEGACY_STORE_PATH = path.join(process.cwd(), 'data-store.json');

function readLegacyStore(): any | null {
  if (!fs.existsSync(LEGACY_STORE_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(LEGACY_STORE_PATH, 'utf-8'));
  } catch (err) {
    console.error('Impossible de lire data-store.json (legacy), utilisation des valeurs par défaut', err);
    return null;
  }
}

export async function ensureSeeded(): Promise<void> {
  const legacy = readLegacyStore();

  const { rows: [{ count }] } = await pool.query('SELECT count(*)::int AS count FROM services');
  if (count === 0) {
    await setServices(legacy?.services ?? SERVICES_DATA);
    await setProjects(legacy?.projects ?? PROJECTS_DATA);
    await setTestimonials(legacy?.testimonials ?? TESTIMONIALS_DATA);
    await setTeam(legacy?.team ?? TEAM_DATA);
    await setBenefits(legacy?.benefits ?? BENEFITS_DATA);
    await setFormations(legacy?.formations ?? FORMATIONS_DATA);
    console.log(legacy ? 'Contenu importé depuis data-store.json (legacy).' : 'Contenu par défaut inséré dans PostgreSQL.');
  }

  const { rows: smtpRows } = await pool.query('SELECT 1 FROM smtp_settings LIMIT 1');
  if (smtpRows.length === 0) {
    await setSmtpConfig(legacy?.smtp ?? {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      toEmail: process.env.SMTP_TO || '',
      enabled: process.env.SMTP_ENABLED === 'true'
    });
  }
}
