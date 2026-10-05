import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility statement" };

// Fill in who handles accessibility requests (name + phone or email).
const CONTACT: string | null = null;
const UPDATED = "October 5, 2026";

export default function AccessibilityStatement() {
  return (
    <article className="prose">
      <h1>Accessibility statement</h1>
      <p>
        We want everyone to be able to use FINDLESS, including people with disabilities. This site is built to meet
        the Israeli Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013,
        and Israeli Standard IS 5568, which is based on WCAG 2.0 level AA.
      </p>

      <h2>What we did</h2>
      <ul>
        <li>An accessibility menu, opened from the button at the edge of the screen, the link in the footer, or Ctrl+U.</li>
        <li>High contrast, light mode, inverted colors and saturation control.</li>
        <li>Bigger text, text spacing, line height and text alignment.</li>
        <li>A dyslexia friendly font, a big cursor, highlighted links and headings.</li>
        <li>Stop animations and hide images.</li>
        <li>Full keyboard navigation, a visible focus outline and a &quot;skip to content&quot; link.</li>
        <li>Alt text for images and labels for form fields.</li>
        <li>Works on every screen size, including mobile.</li>
        <li>Respects the &quot;reduce motion&quot; setting of your device.</li>
      </ul>
      <p>Your accessibility settings are saved only in your browser.</p>

      <h2>Known limits</h2>
      <p>
        The site is new and we keep improving it. Some parts may not be fully accessible yet. If you run into a
        problem, tell us and we&apos;ll fix it.
      </p>

      <h2>Contact</h2>
      <p>
        {CONTACT ? <>Accessibility requests: {CONTACT}.</> : <>Contact details for accessibility requests will be added here soon.</>}{" "}
        Please tell us what the problem is, on which page, and which browser you used.
      </p>

      <p className="muted">Last updated: {UPDATED}</p>
    </article>
  );
}
