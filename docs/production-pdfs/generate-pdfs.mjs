import fs from "node:fs/promises";
import path from "node:path";
import pdfLib from "file:///C:/tmp/smartcode-pdf-build/node_modules/pdf-lib/cjs/index.js";

const { PDFDocument, StandardFonts, rgb } = pdfLib;

const outDir = "E:/devs/smartcode/docs/production-pdfs";
const A4 = [595.28, 841.89];
const palette = {
  ink: rgb(0.08, 0.13, 0.24),
  muted: rgb(0.31, 0.36, 0.46),
  line: rgb(0.85, 0.89, 0.93),
  accent: rgb(0.97, 0.5, 0.0),
  soft: rgb(1.0, 0.95, 0.89),
  panel: rgb(0.97, 0.98, 0.99),
  success: rgb(0.12, 0.48, 0.36),
  danger: rgb(0.71, 0.14, 0.09),
};

function wrapText(text, font, size, width) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= width) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class DocWriter {
  constructor(pdf, title) {
    this.pdf = pdf;
    this.title = title;
    this.page = null;
    this.regular = null;
    this.bold = null;
    this.y = 0;
    this.margin = 42;
    this.width = A4[0] - this.margin * 2;
  }

  async init() {
    this.regular = await this.pdf.embedFont(StandardFonts.Helvetica);
    this.bold = await this.pdf.embedFont(StandardFonts.HelveticaBold);
    this.newPage();
  }

  newPage() {
    this.page = this.pdf.addPage(A4);
    this.y = A4[1] - this.margin;
  }

  ensureSpace(height) {
    if (this.y - height < this.margin) {
      this.newPage();
    }
  }

  drawHeader(eyebrow, subtitle) {
    this.page.drawRectangle({
      x: this.margin,
      y: this.y - 16,
      width: 120,
      height: 20,
      color: palette.soft,
      borderColor: palette.accent,
      borderWidth: 0.5,
    });
    this.page.drawText(eyebrow.toUpperCase(), {
      x: this.margin + 10,
      y: this.y - 10,
      size: 10,
      font: this.bold,
      color: palette.accent,
    });
    this.y -= 38;
    this.page.drawText(this.title, {
      x: this.margin,
      y: this.y,
      size: 24,
      font: this.bold,
      color: palette.ink,
    });
    this.y -= 26;
    this.paragraph(subtitle, 11.5, palette.muted, 16);
    this.y -= 6;
  }

  section(title) {
    this.ensureSpace(48);
    this.page.drawText(title, {
      x: this.margin,
      y: this.y,
      size: 16,
      font: this.bold,
      color: palette.ink,
    });
    this.y -= 10;
    this.page.drawLine({
      start: { x: this.margin, y: this.y },
      end: { x: this.margin + this.width, y: this.y },
      thickness: 1,
      color: palette.line,
    });
    this.y -= 18;
  }

  paragraph(text, size = 11.5, color = palette.ink, leading = 15) {
    const lines = wrapText(text, this.regular, size, this.width);
    this.ensureSpace(lines.length * leading + 6);
    for (const line of lines) {
      this.page.drawText(line, {
        x: this.margin,
        y: this.y,
        size,
        font: this.regular,
        color,
      });
      this.y -= leading;
    }
    this.y -= 4;
  }

  bullets(items, indent = 16) {
    for (const item of items) {
      const lines = wrapText(item, this.regular, 11.5, this.width - indent - 10);
      this.ensureSpace(lines.length * 15 + 6);
      this.page.drawText("•", {
        x: this.margin + 2,
        y: this.y,
        size: 13,
        font: this.bold,
        color: palette.accent,
      });
      let lineY = this.y;
      for (const line of lines) {
        this.page.drawText(line, {
          x: this.margin + indent,
          y: lineY,
          size: 11.5,
          font: this.regular,
          color: palette.ink,
        });
        lineY -= 15;
      }
      this.y = lineY - 2;
    }
  }

  infoCards(cards, columns = 2) {
    const gap = 14;
    const cardWidth = (this.width - gap * (columns - 1)) / columns;
    const heights = [];
    for (const card of cards) {
      const titleLines = wrapText(card.title, this.bold, 12.5, cardWidth - 20).length;
      const bodyLines = wrapText(card.body, this.regular, 10.5, cardWidth - 20).length;
      heights.push(22 + titleLines * 16 + bodyLines * 13 + 18);
    }
    const rowHeight = Math.max(...heights);
    this.ensureSpace(rowHeight + 10);
    cards.forEach((card, index) => {
      const col = index % columns;
      const x = this.margin + col * (cardWidth + gap);
      const y = this.y - rowHeight;
      this.page.drawRectangle({
        x,
        y,
        width: cardWidth,
        height: rowHeight,
        color: palette.panel,
        borderColor: palette.line,
        borderWidth: 1,
        borderRadius: 10,
      });
      let cursor = this.y - 18;
      const titleLines = wrapText(card.title, this.bold, 12.5, cardWidth - 20);
      titleLines.forEach((line) => {
        this.page.drawText(line, {
          x: x + 10,
          y: cursor,
          size: 12.5,
          font: this.bold,
          color: palette.ink,
        });
        cursor -= 16;
      });
      const bodyLines = wrapText(card.body, this.regular, 10.5, cardWidth - 20);
      bodyLines.forEach((line) => {
        this.page.drawText(line, {
          x: x + 10,
          y: cursor,
          size: 10.5,
          font: this.regular,
          color: palette.muted,
        });
        cursor -= 13;
      });
    });
    this.y -= rowHeight + 16;
  }

  table(headers, rows, colWidths) {
    const tableWidth = colWidths.reduce((sum, n) => sum + n, 0);
    let required = 32;
    const rowHeights = rows.map((row) => {
      const height =
        Math.max(
          ...row.map((cell, idx) => wrapText(cell, this.regular, 10, colWidths[idx] - 12).length * 12)
        ) + 12;
      required += height;
      return height;
    });
    this.ensureSpace(required + 16);
    let x = this.margin;
    let y = this.y;
    headers.forEach((header, idx) => {
      this.page.drawRectangle({
        x,
        y: y - 24,
        width: colWidths[idx],
        height: 24,
        color: rgb(0.93, 0.96, 0.98),
        borderColor: palette.line,
        borderWidth: 1,
      });
      this.page.drawText(header, {
        x: x + 6,
        y: y - 16,
        size: 10.5,
        font: this.bold,
        color: palette.ink,
      });
      x += colWidths[idx];
    });
    y -= 24;
    rows.forEach((row, rowIndex) => {
      x = this.margin;
      const h = rowHeights[rowIndex];
      row.forEach((cell, idx) => {
        this.page.drawRectangle({
          x,
          y: y - h,
          width: colWidths[idx],
          height: h,
          color: rgb(1, 1, 1),
          borderColor: palette.line,
          borderWidth: 1,
        });
        const lines = wrapText(cell, this.regular, 10, colWidths[idx] - 12);
        let textY = y - 14;
        lines.forEach((line) => {
          this.page.drawText(line, {
            x: x + 6,
            y: textY,
            size: 10,
            font: this.regular,
            color: palette.ink,
          });
          textY -= 12;
        });
        x += colWidths[idx];
      });
      y -= h;
    });
    this.y = y - 14;
  }

  flowBox(x, y, w, h, title, subtitle = "", fill = palette.panel) {
    this.page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: fill,
      borderColor: palette.line,
      borderWidth: 1.2,
      borderRadius: 12,
    });
    this.page.drawText(title, {
      x: x + 10,
      y: y + h - 24,
      size: 13,
      font: this.bold,
      color: palette.ink,
    });
    if (subtitle) {
      const lines = wrapText(subtitle, this.regular, 10, w - 20);
      let textY = y + h - 42;
      lines.forEach((line) => {
        this.page.drawText(line, {
          x: x + 10,
          y: textY,
          size: 10,
          font: this.regular,
          color: palette.muted,
        });
        textY -= 12;
      });
    }
  }

  arrow(x1, y1, x2, y2) {
    this.page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 2,
      color: palette.accent,
    });
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size = 8;
    this.page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 - size * Math.cos(angle - Math.PI / 6), y: y2 - size * Math.sin(angle - Math.PI / 6) },
      thickness: 2,
      color: palette.accent,
    });
    this.page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 - size * Math.cos(angle + Math.PI / 6), y: y2 - size * Math.sin(angle + Math.PI / 6) },
      thickness: 2,
      color: palette.accent,
    });
  }

  footer(text) {
    this.page.drawText(text, {
      x: this.margin,
      y: 18,
      size: 9,
      font: this.regular,
      color: palette.muted,
    });
  }
}

async function save(pdf, filename) {
  const bytes = await pdf.save();
  await fs.writeFile(path.join(outDir, filename), bytes);
}

async function createOwnerHandbook() {
  const pdf = await PDFDocument.create();
  const doc = new DocWriter(pdf, "SmartCode Production Owner Handbook");
  await doc.init();
  doc.drawHeader("Owner Handbook", "Practical operating guide for running, debugging, and improving SmartCode in production. Current live website: https://smartcode-three.vercel.app");
  doc.infoCards([
    { title: "User-facing website", body: "https://smartcode-three.vercel.app. This is the link you should give to users." },
    { title: "Backend API", body: "https://smartcode-backend.onrender.com. This should stay operationally private." },
    { title: "Hosting stack", body: "Frontend on Vercel, backend on Render, persistent data in MongoDB Atlas." },
    { title: "Core priority", body: "Keep signup, login, problem listing, run, submit, and leaderboard stable first." },
  ]);
  doc.section("Daily operating routine");
  doc.bullets([
    "Open the live site and test homepage, login, and one problem route every morning.",
    "After each deploy, manually test signup, login, problem run, and problem submit.",
    "Review Render logs once daily for repeated crashes, startup errors, or route failures.",
    "Review Vercel deployment status after every push to main.",
  ]);
  doc.section("Weekly operating routine");
  doc.bullets([
    "Check MongoDB Atlas metrics for connections, storage growth, and query health.",
    "Review bug reports and classify them as frontend, backend, or data issues.",
    "Export or snapshot important data before any structural or schema change.",
    "Verify production environment variables still match the live domains and current database credentials.",
  ]);
  doc.section("Launch and post-deploy checklist");
  doc.table(
    ["Step", "Action", "Success signal"],
    [
      ["1", "Push code and confirm GitHub has the intended commit.", "Correct branch and commit message visible."],
      ["2", "Let Render redeploy the backend.", "No crash in Render logs."],
      ["3", "Let Vercel redeploy the frontend.", "Deployment completes successfully."],
      ["4", "Smoke-test the live site.", "Auth and coding flow work end to end."],
      ["5", "Check browser console and network tab.", "No CORS or failed API calls."],
    ],
    [36, 270, 170]
  );
  doc.footer("SmartCode owner handbook • Public user URL: https://smartcode-three.vercel.app");

  doc.newPage();
  doc.section("Where to debug first");
  doc.table(
    ["Symptom", "Check first", "Likely cause"],
    [
      ["Frontend loads but actions fail", "Browser network tab", "Bad API base URL, CORS issue, backend route error"],
      ["Login or signup fails", "Render logs and Atlas connection", "Database auth failure or server-side validation issue"],
      ["Slow first request", "Render service behavior", "Cold start on lower backend tier"],
      ["Problem run or submit fails", "Backend logs around judge routes", "Judge dependency, route error, or bad payload"],
    ],
    [150, 150, 237]
  );
  doc.section("Incident runbooks");
  doc.bullets([
    "If login stops working: inspect the request in browser devtools, then open Render logs and verify MongoDB Atlas connectivity.",
    "If CORS errors appear: confirm Render CORS_ORIGIN exactly matches the Vercel domain including protocol.",
    "If backend deploy fails: read the first stack trace in Render logs, then confirm root directory, dependencies, and environment variables.",
    "If the whole site feels slow: compare browser timing, Render logs, and Atlas metrics to isolate frontend, backend, or database latency.",
  ]);
  doc.section("Data and change safety");
  doc.infoCards([
    { title: "User data", body: "Users, passwords, submissions, battle results, and profile updates must be treated as production data." },
    { title: "Product data", body: "Problems, study plans, tags, and seeded defaults should be versioned carefully." },
    { title: "Before risky changes", body: "Take a backup or export, test on a safe dataset, then deploy small changes." },
    { title: "Known risk to fix next", body: "Passwords are currently plain text. Move to bcrypt before broader public growth." },
  ]);
  doc.section("Core tools");
  doc.bullets([
    "Vercel dashboard for frontend builds and environment variables.",
    "Render dashboard for backend logs, deploy history, and runtime settings.",
    "MongoDB Atlas for data metrics, database users, backups, and credential rotation.",
    "GitHub for change history, rollback, and release traceability.",
  ]);
  doc.footer("SmartCode owner handbook • Keep secrets in dashboards, not in git");
  await save(pdf, "smartcode-owner-handbook.pdf");
}

async function createWorkflowDiagrams() {
  const pdf = await PDFDocument.create();
  const doc = new DocWriter(pdf, "SmartCode Workflow and Operations Diagrams");
  await doc.init();
  doc.drawHeader("Workflow Diagrams", "Diagrammatic view of how SmartCode traffic, deploys, bugs, and data move through the current production setup.");
  doc.section("User request flow");
  const p = doc.page;
  const baseY = 540;
  doc.flowBox(55, baseY, 120, 70, "User Browser", "homepage, login, solve", palette.soft);
  doc.flowBox(225, baseY, 140, 80, "Vercel Frontend", "Next.js pages and client fetches");
  doc.flowBox(415, baseY, 140, 80, "Render Backend", "auth, problems, battles, judge");
  doc.flowBox(405, 395, 150, 70, "MongoDB Atlas", "users, problems, submissions");
  doc.flowBox(225, 395, 140, 70, "OpenAI API", "optional coach replies");
  doc.arrow(175, baseY + 35, 225, baseY + 35);
  doc.arrow(365, baseY + 35, 415, baseY + 35);
  doc.arrow(485, baseY, 485, 465);
  doc.arrow(365, 430, 415, 430);
  doc.arrow(365, 450, 415, 520);
  doc.y = 360;
  doc.paragraph("Flow summary: users interact with the Vercel frontend, which calls the Render backend. The backend persists state in MongoDB Atlas and optionally calls OpenAI only for the coach feature.");
  doc.section("Deploy workflow");
  doc.flowBox(45, 210, 95, 60, "Edit code", "local repo", palette.soft);
  doc.flowBox(155, 210, 95, 60, "Push GitHub", "main branch");
  doc.flowBox(265, 210, 95, 60, "Render", "backend deploy");
  doc.flowBox(375, 210, 95, 60, "Vercel", "frontend deploy");
  doc.flowBox(485, 210, 70, 60, "Test", "smoke test");
  doc.arrow(140, 240, 155, 240);
  doc.arrow(250, 240, 265, 240);
  doc.arrow(360, 240, 375, 240);
  doc.arrow(470, 240, 485, 240);
  doc.footer("SmartCode workflows • public website: https://smartcode-three.vercel.app");

  doc.newPage();
  doc.section("Bug triage workflow");
  doc.flowBox(185, 690, 220, 54, "Bug or user complaint", "", palette.soft);
  doc.flowBox(170, 605, 250, 64, "Reproduce in browser", "collect exact steps, console errors, and failed API requests");
  doc.flowBox(35, 470, 150, 72, "Frontend path", "UI logic, bad API base URL, state bug");
  doc.flowBox(215, 470, 150, 72, "Backend path", "Render logs, route logic, runtime errors");
  doc.flowBox(395, 470, 150, 72, "Data path", "Atlas metrics, records, query correctness");
  doc.flowBox(170, 325, 250, 64, "Fix, redeploy, re-test", "verify the exact same user journey after the fix");
  doc.arrow(295, 690, 295, 669);
  doc.arrow(295, 605, 110, 542);
  doc.arrow(295, 605, 290, 542);
  doc.arrow(295, 605, 470, 542);
  doc.arrow(110, 470, 220, 389);
  doc.arrow(290, 470, 295, 389);
  doc.arrow(470, 470, 370, 389);
  doc.y = 286;
  doc.paragraph("Always begin with browser reproduction. It is the fastest way to separate frontend, backend, and data bugs before you spend time on the wrong layer.");
  doc.section("Data lifecycle");
  doc.infoCards([
    { title: "Creation", body: "Users sign up, submissions are stored, battles are created, and problem/study-plan data is seeded." },
    { title: "Persistence", body: "MongoDB Atlas stores the main application state accessed through Mongoose models." },
    { title: "Read path", body: "Frontend requests dashboard or problem routes; backend responds with JSON from MongoDB-backed logic." },
    { title: "Recovery", body: "Use Atlas backups plus a known-good GitHub commit when code and data both need recovery." },
  ]);
  doc.footer("SmartCode workflows • deploy, debug, and data movement");
  await save(pdf, "smartcode-workflow-diagrams.pdf");
}

async function createSystemDesign() {
  const pdf = await PDFDocument.create();
  const doc = new DocWriter(pdf, "SmartCode System Design Document");
  await doc.init();
  doc.drawHeader("System Design", "Production-oriented design for the current SmartCode architecture, including present constraints and recommended next improvements.");
  doc.section("System objective");
  doc.paragraph("SmartCode is a coding-practice platform where users can sign up, log in, browse coding problems, run and submit solutions, track progress, compete in battle mode, and optionally receive AI coaching. The current system is optimized for fast product iteration and launch speed.");
  doc.section("Current architecture");
  doc.flowBox(40, 520, 120, 72, "Users", "web browsers", palette.soft);
  doc.flowBox(200, 520, 145, 80, "Next.js Frontend", "Vercel-hosted pages, components, fetch clients");
  doc.flowBox(385, 520, 145, 80, "Express Backend", "Render-hosted auth, problem, battle, judge routes");
  doc.flowBox(390, 390, 140, 70, "MongoDB Atlas", "persistent user and product data");
  doc.flowBox(200, 390, 145, 70, "OpenAI API", "optional coach integration");
  doc.arrow(160, 556, 200, 556);
  doc.arrow(345, 556, 385, 556);
  doc.arrow(457, 520, 457, 460);
  doc.arrow(345, 425, 385, 425);
  doc.arrow(345, 430, 390, 520);
  doc.y = 350;
  doc.paragraph("This separation is good for early production because frontend and backend deploy independently, while Atlas provides managed persistence.");
  doc.section("Major functional modules");
  doc.table(
    ["Module", "Responsibility", "Current note"],
    [
      ["Auth", "Signup, login, profile updates, password changes, presence", "Needs stronger password security"],
      ["Problems", "List, details, favorites, run, submit, study plans", "Most important user-value path"],
      ["Judge", "Evaluate JavaScript, TypeScript, and Java solutions", "High reliability requirement"],
      ["Battle", "Queue, match, score, and persist contest outcomes", "Monitor carefully for edge cases"],
      ["Coach", "Fallback hints or OpenAI-based hints", "Should not block core product if unavailable"],
    ],
    [85, 255, 175]
  );
  doc.footer("SmartCode system design • current architecture overview");

  doc.newPage();
  doc.section("Data model overview");
  doc.infoCards([
    { title: "Primary collections", body: "Users, Problems, Submissions, Battles, and StudyPlans." },
    { title: "Key relationships", body: "Users own submissions and solved problems; battles connect challenger, opponent, winner, and problem." },
    { title: "Important product state", body: "Progress, rankings, favorites, recent activity, and problem metadata all live in MongoDB Atlas." },
    { title: "Recovery principle", body: "Back up data before migrations or dangerous bulk edits, and keep GitHub as code truth." },
  ]);
  doc.section("Scalability and reliability");
  doc.bullets([
    "Current strengths: simple service boundaries, managed infrastructure, and fast independent deploys.",
    "Current constraints: Render cold starts, no automated regression tests, and limited structured observability.",
    "Near-term improvements: add request validation, health checks, route smoke tests, and structured logs with request identifiers.",
    "Scale-up path: move to an always-on backend tier, add rate limiting, and separate the judging workload if submission traffic grows significantly.",
  ]);
  doc.section("Security priorities");
  doc.bullets([
    "Hash passwords with bcrypt before broader public growth.",
    "Rotate exposed MongoDB credentials and keep secrets only in hosting dashboards.",
    "Restrict CORS to exact trusted frontend domains.",
    "Consider token-based or session-based auth hardening over time.",
  ]);
  doc.section("Observability and debugging strategy");
  doc.table(
    ["Area", "Current tool", "Recommended next step"],
    [
      ["Frontend failures", "Browser console and Vercel deploy logs", "Add client-side error reporting"],
      ["Backend failures", "Render logs", "Add structured route-level logging"],
      ["Database health", "MongoDB Atlas metrics", "Track slow queries and usage growth weekly"],
      ["AI dependency", "Fallback behavior", "Log coach mode to know when OpenAI is or is not active"],
    ],
    [120, 180, 215]
  );
  doc.footer("SmartCode system design • next 30-day architecture direction");
  await save(pdf, "smartcode-system-design.pdf");
}

await fs.mkdir(outDir, { recursive: true });
await createOwnerHandbook();
await createWorkflowDiagrams();
await createSystemDesign();
console.log("PDFs generated in", outDir);
