import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { CONTACT, UPDATED } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function Privacy() {
  const { lang } = await getT();
  return lang === "he" ? <He /> : <En />;
}

function En() {
  return (
    <article className="prose">
      <h1>Privacy policy</h1>
      <p>This policy explains what information FINDLESS collects on this site, why, and what you can do about it.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Waitlist: your email, if you sign up for drop updates.</li>
        <li>Orders: the item and size, and the name, phone and/or email you leave so we can reach you.</li>
        <li>Account: your email and password (the password is stored encrypted, we never see it).</li>
        <li>Technical: cookies needed to keep you logged in and remember your language.</li>
      </ul>
      <p>We don&apos;t collect payment details. Payment happens in Bit or PayBox, under their own privacy policies.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To handle your order: send you a payment link, update you on production and shipping.</li>
        <li>To send drop updates, only if you signed up for them.</li>
        <li>To run your account and show your orders.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We don&apos;t sell or rent your information. We only use service providers that run the site for us: Vercel
        (hosting), Supabase (database, servers in the EU) and Resend (emails). A courier gets your name, phone and
        address when we ship to you.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        We use only the cookies the site needs: login session and language. Accessibility settings are saved in your
        browser only. No ad trackers.
      </p>

      <h2>How long we keep it</h2>
      <p>Order details are kept as long as needed for the order and as required by law. Waitlist emails are kept until you unsubscribe.</p>

      <h2>Your rights</h2>
      <p>
        Under the Israeli Privacy Protection Law, 1981, you can ask to see the information we hold about you, fix it,
        or delete it. You can leave the waitlist at any time.
      </p>

      <h2>Contact</h2>
      <p>{CONTACT ? <>Privacy requests: {CONTACT}.</> : <>Contact details will be added here soon.</>}</p>

      <p className="muted">Last updated: {UPDATED.en}</p>
    </article>
  );
}

function He() {
  return (
    <article className="prose">
      <h1>מדיניות פרטיות</h1>
      <p>המדיניות הזו מסבירה איזה מידע FINDLESS אוסף באתר, למה, ומה הזכויות שלך.</p>

      <h2>איזה מידע אנחנו אוספים</h2>
      <ul>
        <li>רשימת המתנה: האימייל שלך, אם נרשמת לעדכונים על דרופים.</li>
        <li>הזמנות: הפריט והמידה, והשם, הטלפון ו/או האימייל שהשארת כדי שנחזור אליך.</li>
        <li>חשבון: אימייל וסיסמה (הסיסמה נשמרת מוצפנת ואנחנו לא רואים אותה).</li>
        <li>מידע טכני: עוגיות שצריך כדי להשאיר אותך מחובר ולזכור את השפה.</li>
      </ul>
      <p>אנחנו לא אוספים פרטי תשלום. התשלום נעשה בביט או בפייבוקס, לפי מדיניות הפרטיות שלהם.</p>

      <h2>למה אנחנו משתמשים במידע</h2>
      <ul>
        <li>כדי לטפל בהזמנה: לשלוח קישור לתשלום ולעדכן על הייצור והמשלוח.</li>
        <li>כדי לשלוח עדכונים על דרופים, רק אם נרשמת לזה.</li>
        <li>כדי לנהל את החשבון שלך ולהציג את ההזמנות שלך.</li>
      </ul>

      <h2>עם מי המידע משותף</h2>
      <p>
        אנחנו לא מוכרים ולא משכירים את המידע שלך. אנחנו משתמשים רק בספקים שמפעילים את האתר בשבילנו: Vercel
        (אחסון), Supabase (מסד נתונים, שרתים באירופה) ו־Resend (אימיילים). חברת השליחויות מקבלת שם, טלפון
        וכתובת כשאנחנו שולחים אליך.
      </p>

      <h2>עוגיות ואחסון בדפדפן</h2>
      <p>אנחנו משתמשים רק בעוגיות שהאתר צריך: התחברות ושפה. הגדרות הנגישות נשמרות בדפדפן שלך בלבד. אין מעקב פרסומי.</p>

      <h2>כמה זמן נשמר המידע</h2>
      <p>פרטי הזמנה נשמרים כל עוד צריך לטיפול בהזמנה ולפי מה שהחוק מחייב. אימיילים ברשימת ההמתנה נשמרים עד שתבקש להסיר.</p>

      <h2>הזכויות שלך</h2>
      <p>לפי חוק הגנת הפרטיות, התשמ״א-1981, אפשר לבקש לעיין במידע שלך, לתקן אותו או למחוק אותו. אפשר לצאת מרשימת ההמתנה בכל רגע.</p>

      <h2>יצירת קשר</h2>
      <p>{CONTACT ? <>פניות בנושא פרטיות: {CONTACT}</> : <>פרטי הקשר יתעדכנו כאן בקרוב.</>}</p>

      <p className="muted">עודכן לאחרונה: {UPDATED.he}</p>
    </article>
  );
}
