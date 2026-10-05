import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CONTACT, UPDATED } from "@/lib/legal";

export const metadata: Metadata = { title: "Accessibility" };

export default async function AccessibilityStatement() {
  const { lang } = await getT();
  return lang === "he" ? <He /> : <En />;
}

function En() {
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

      <p className="muted">Last updated: {UPDATED.en}</p>
    </article>
  );
}
function He() {
  return (
    <article className="prose">
      <h1>הצהרת נגישות</h1>
      <p>
        אנחנו ב-FINDLESS רוצים שכל אחד יוכל להשתמש באתר בנוחות, כולל אנשים עם מוגבלות. האתר נבנה בהתאם
        לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ולתקן הישראלי ת״י 5568
        המבוסס על הנחיות WCAG 2.0 ברמה AA.
      </p>

      <h2>מה עשינו באתר</h2>
      <ul>
        <li>תפריט נגישות שנפתח מהכפתור בצד המסך, מהקישור בתחתית האתר או בקיצור המקלדת Ctrl+U.</li>
        <li>ניגודיות גבוהה, רקע בהיר וצבעים הפוכים, ושליטה ברוויית הצבעים.</li>
        <li>הגדלת טקסט, ריווח טקסט, גובה שורה ויישור טקסט.</li>
        <li>גופן ידידותי לדיסלקציה, סמן עכבר גדול, הדגשת קישורים וכותרות.</li>
        <li>עצירת הנפשות והסתרת תמונות.</li>
        <li>ניווט מלא במקלדת, סימון ברור של הרכיב שבפוקוס וקישור &quot;דלג לתוכן&quot;.</li>
        <li>טקסט חלופי לתמונות ותוויות לשדות בטפסים.</li>
        <li>התאמה למסכים בכל הגדלים ולמובייל.</li>
        <li>האתר מכבד את הגדרת &quot;הפחתת תנועה&quot; של מערכת ההפעלה.</li>
      </ul>
      <p>ההגדרות בתפריט הנגישות נשמרות בדפדפן שלך בלבד.</p>

      <h2>מגבלות ידועות</h2>
      <p>
        האתר חדש ואנחנו ממשיכים לשפר אותו. ייתכן שחלקים מסוימים עדיין לא נגישים באופן מלא. אם נתקלת בבעיה,
        נשמח לשמוע ולתקן.
      </p>

      <h2>פניות בנושא נגישות</h2>
      <p>
        {CONTACT ? (
          <>אפשר לפנות אלינו: {CONTACT}</>
        ) : (
          <>פרטי הקשר לפניות בנושא נגישות יתעדכנו כאן בקרוב.</>
        )}{" "}
        נשמח לקבל תיאור של הבעיה, העמוד שבו נתקלת בה והדפדפן שבו השתמשת.
      </p>

      <p className="muted">עודכן לאחרונה: {UPDATED.he}</p>
    </article>
  );
}