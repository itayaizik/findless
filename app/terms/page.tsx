import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n";
import { BUSINESS, CONTACT, UPDATED } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms" };

export default async function Terms() {
  const { lang } = await getT();
  return lang === "he" ? <He /> : <En />;
}

function En() {
  return (
    <article className="prose">
      <h1>Terms of sale</h1>
      <p>
        FINDLESS is an online clothing brand{BUSINESS ? <>, run by {BUSINESS}</> : null}. By ordering on this site you
        agree to these terms.
      </p>

      <h2>Preorder</h2>
      <p>
        Everything on the site is sold as a preorder. Your piece is made after you order and pay, so it ships later
        than a regular order. We tell you the expected timing before you pay and keep you updated.
      </p>

      <h2>Ordering and payment</h2>
      <ul>
        <li>You pick an item and a size and leave a phone or email. No payment happens on the site.</li>
        <li>We send you a payment link, Bit first, or PayBox if you prefer.</li>
        <li>Your order is confirmed only after payment. Prices are in shekels (₪).</li>
        <li>Quantities in each drop are limited. If an item runs out before you pay, we let you know and you don&apos;t pay.</li>
      </ul>

      <h2>Shipping</h2>
      <p>We ship within Israel. Shipping cost and timing are sent to you with the payment link.</p>

      <h2>Cancellations and returns</h2>
      <p>
        You can cancel according to the Israeli Consumer Protection Law, 1981: within 14 days from the day you get the
        item. The item must come back unused, unwashed and with its tags. We refund within 14 days of getting it
        back, minus a cancellation fee of 5% of the price or ₪100, whichever is lower. Return shipping is on you
        unless the item is defective.
      </p>

      <h2>Defects</h2>
      <p>If something arrives damaged or not as ordered, tell us within 14 days and we fix it, replace it or refund you.</p>

      <h2>Sizes and colors</h2>
      <p>Check the size details before you order. Colors on screen can look slightly different from the real fabric.</p>

      <h2>Privacy</h2>
      <p>
        How we handle your information is explained in the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>General</h2>
      <p>We may update these terms. The version that applies is the one on the site when you ordered. Israeli law applies.</p>

      <h2>Contact</h2>
      <p>{CONTACT ? <>Questions and cancellations: {CONTACT}.</> : <>Contact details will be added here soon.</>}</p>

      <p className="muted">Last updated: {UPDATED.en}</p>
    </article>
  );
}

function He() {
  return (
    <article className="prose">
      <h1>תקנון</h1>
      <p>
        FINDLESS הוא מותג בגדים אונליין{BUSINESS ? <> שמופעל על ידי {BUSINESS}</> : null}. הזמנה באתר היא
        הסכמה לתקנון הזה.
      </p>

      <h2>הזמנה מוקדמת (Preorder)</h2>
      <p>
        כל הפריטים באתר נמכרים בהזמנה מוקדמת. הפריט מיוצר אחרי שהזמנת ושילמת, ולכן הוא נשלח מאוחר יותר מהזמנה
        רגילה. לפני התשלום נגיד לך מתי בערך הוא יגיע, ונעדכן לאורך הדרך.
      </p>

      <h2>הזמנה ותשלום</h2>
      <ul>
        <li>בוחרים פריט ומידה ומשאירים טלפון או אימייל. אין תשלום באתר.</li>
        <li>אנחנו שולחים קישור לתשלום בביט, או בפייבוקס אם נוח לך יותר.</li>
        <li>ההזמנה מאושרת רק אחרי התשלום. המחירים בשקלים (₪).</li>
        <li>הכמויות בכל דרופ מוגבלות. אם פריט נגמר לפני שילמת, נעדכן אותך ולא תחויב.</li>
      </ul>

      <h2>משלוחים</h2>
      <p>אנחנו שולחים בתוך ישראל. עלות המשלוח והזמנים נשלחים יחד עם קישור התשלום.</p>

      <h2>ביטול והחזרות</h2>
      <p>
        אפשר לבטל עסקה לפי חוק הגנת הצרכן, התשמ״א-1981: תוך 14 יום מהיום שקיבלת את הפריט. הפריט צריך לחזור
        בלי שימוש, בלי כביסה ועם התוויות. ההחזר יינתן תוך 14 יום מקבלת הפריט, בניכוי דמי ביטול של 5% מהמחיר או
        100 ₪, הנמוך מביניהם. עלות המשלוח חזרה עליך, אלא אם הפריט פגום.
      </p>

      <h2>פגמים</h2>
      <p>אם משהו הגיע פגום או לא כמו שהוזמן, ספר לנו תוך 14 יום ונתקן, נחליף או נחזיר את הכסף.</p>

      <h2>מידות וצבעים</h2>
      <p>כדאי לבדוק את פרטי המידה לפני ההזמנה. הצבעים במסך יכולים להיראות קצת שונה מהבד האמיתי.</p>

      <h2>פרטיות</h2>
      <p>
        איך אנחנו שומרים על המידע שלך מוסבר ב<Link href="/privacy">מדיניות הפרטיות</Link>.
      </p>

      <h2>כללי</h2>
      <p>אנחנו יכולים לעדכן את התקנון. הנוסח שחל הוא זה שהיה באתר כשהזמנת. על התקנון חל הדין הישראלי.</p>

      <h2>יצירת קשר</h2>
      <p>{CONTACT ? <>שאלות וביטולים: {CONTACT}</> : <>פרטי הקשר יתעדכנו כאן בקרוב.</>}</p>

      <p className="muted">עודכן לאחרונה: {UPDATED.he}</p>
    </article>
  );
}
