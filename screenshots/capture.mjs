import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'http://localhost:3000';
const OUT = __dirname;

async function capture() {
  const browser = await chromium.launch({ headless: true });

  // Desktop 1440x900
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(2000); // let animations settle
  await desktopPage.screenshot({ path: `${OUT}/desktop.png`, fullPage: false });
  console.log('Desktop screenshot saved');

  // Also capture full-page desktop
  await desktopPage.screenshot({ path: `${OUT}/desktop_full.png`, fullPage: true });
  console.log('Desktop full-page screenshot saved');
  await desktopCtx.close();

  // Mobile 375x812
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: `${OUT}/mobile.png`, fullPage: false });
  console.log('Mobile screenshot saved');
  await mobileCtx.close();

  // Accessibility / DOM snapshot for hero
  const auditCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const auditPage = await auditCtx.newPage();
  await auditPage.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await auditPage.waitForTimeout(1000);

  // Extract above-the-fold info
  const foldData = await auditPage.evaluate(() => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    function inViewport(el) {
      const r = el.getBoundingClientRect();
      return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
    }

    // H1
    const h1 = document.querySelector('h1');
    const h1Rect = h1 ? h1.getBoundingClientRect() : null;

    // Nav / dock
    const nav = document.querySelector('nav, [role="navigation"], .dock');
    const navRect = nav ? nav.getBoundingClientRect() : null;

    // Theme toggle
    const toggle = document.querySelector('[data-testid="theme-toggle"], button[aria-label*="theme" i], button[aria-label*="dark" i]');
    const toggleRect = toggle ? toggle.getBoundingClientRect() : null;

    // CTAs
    const ctaLinks = [...document.querySelectorAll('a, button')].filter(el => {
      const txt = el.textContent.trim().toLowerCase();
      return txt.includes('contact') || txt.includes('resume') || txt.includes('hire') || txt.includes('work') || txt.includes('scroll');
    });

    // All headings
    const headings = [...document.querySelectorAll('h1, h2, h3')].slice(0, 8).map(h => ({
      tag: h.tagName,
      text: h.textContent.trim().substring(0, 80),
      inViewport: inViewport(h),
      rect: {
        top: Math.round(h.getBoundingClientRect().top),
        bottom: Math.round(h.getBoundingClientRect().bottom),
      },
    }));

    // All buttons/links visible above fold
    const aboveFoldInteractive = [...document.querySelectorAll('a, button')]
      .filter(el => inViewport(el))
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 40),
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          ariaLabel: el.getAttribute('aria-label') || '',
        };
      });

    return {
      viewport: { width: vw, height: vh },
      h1: h1 ? {
        text: h1.textContent.trim(),
        inViewport: inViewport(h1),
        rect: h1Rect ? { top: Math.round(h1Rect.top), bottom: Math.round(h1Rect.bottom) } : null,
      } : null,
      headings,
      ctaLinks: ctaLinks.slice(0, 5).map(el => ({
        text: el.textContent.trim().substring(0, 40),
        inViewport: inViewport(el),
        rect: (() => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) }; })(),
      })),
      nav: nav ? { inViewport: inViewport(nav), rect: navRect ? { top: Math.round(navRect.top), bottom: Math.round(navRect.bottom), left: Math.round(navRect.left), right: Math.round(navRect.right) } : null } : null,
      aboveFoldInteractive,
    };
  });

  console.log('\n=== DESKTOP FOLD DATA ===');
  console.log(JSON.stringify(foldData, null, 2));

  // Mobile fold audit
  await auditCtx.close();
  const mobileAuditCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
  });
  const mobileAuditPage = await mobileAuditCtx.newPage();
  await mobileAuditPage.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await mobileAuditPage.waitForTimeout(1000);

  const mobileFoldData = await mobileAuditPage.evaluate(() => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    function inViewport(el) {
      const r = el.getBoundingClientRect();
      return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
    }
    const h1 = document.querySelector('h1');
    const h1Rect = h1 ? h1.getBoundingClientRect() : null;
    const interactiveAboveFold = [...document.querySelectorAll('a, button')]
      .filter(el => inViewport(el))
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 40),
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          ariaLabel: el.getAttribute('aria-label') || '',
        };
      });

    const headings = [...document.querySelectorAll('h1, h2, h3')].slice(0, 6).map(h => ({
      tag: h.tagName,
      text: h.textContent.trim().substring(0, 80),
      inViewport: inViewport(h),
      rect: { top: Math.round(h.getBoundingClientRect().top), bottom: Math.round(h.getBoundingClientRect().bottom) },
    }));

    return {
      viewport: { width: vw, height: vh },
      h1: h1 ? {
        text: h1.textContent.trim(),
        inViewport: inViewport(h1),
        rect: h1Rect ? { top: Math.round(h1Rect.top), bottom: Math.round(h1Rect.bottom) } : null,
      } : null,
      headings,
      interactiveAboveFold,
    };
  });

  console.log('\n=== MOBILE FOLD DATA ===');
  console.log(JSON.stringify(mobileFoldData, null, 2));

  await mobileAuditCtx.close();
  await browser.close();
}

capture().catch(err => { console.error(err); process.exit(1); });
