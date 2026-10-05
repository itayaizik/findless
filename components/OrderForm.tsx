"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { placeOrder, type OrderState } from "@/app/actions";
import { fill } from "@/lib/dict";
import { useT } from "./I18n";

function PreorderNote() {
  const { t } = useT();
  return (
    <div className="preorder">
      <b>{t.preorder}</b>
      <p>{t.preorderNote}</p>
    </div>
  );
}

export default function OrderForm({
  slug,
  sizes,
  email,
}: {
  slug: string;
  sizes: string[];
  email?: string;
}) {
  const { t } = useT();
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, { ok: false });
  const [size, setSize] = useState("");

  if (state.ok) {
    return (
      <div className="order-done" role="status">
        <b>{fill(t.orderDone, { id: state.id })}</b>
        <p>{fill(t.orderDoneBit, { contact: state.contact })}</p>
        <p>{t.orderDoneMade}</p>
      </div>
    );
  }

  return (
    <form action={action} className="order">
      <PreorderNote />
      <input type="hidden" name="slug" value={slug} />
      <fieldset>
        <legend>{t.size}</legend>
        <div className="size-row" dir="ltr">
          {sizes.map((s) => (
            <label key={s} className={`size${size === s ? " on" : ""}`}>
              <input type="radio" name="size" value={s} required checked={size === s} onChange={() => setSize(s)} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        <span>{t.name}</span>
        <input name="name" autoComplete="name" maxLength={80} />
      </label>
      <label className="field">
        <span>{t.phone}</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} />
      </label>
      <label className="field">
        <span>{t.email}</span>
        <input name="email" type="email" autoComplete="email" defaultValue={email} maxLength={254} />
      </label>
      <p className="hint">{t.oneEnough}</p>
      <label className="field">
        <span>{t.note}</span>
        <input name="note" maxLength={500} />
      </label>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? t.sending : t.preorder}
      </button>
      <p className="hint">{t.noPayHere}</p>
      <p className="hint">
        {t.agreeTerms}
        <Link href="/terms">{t.termsLink}</Link>
        {t.andPrivacy}
        <Link href="/privacy">{t.privacyLink}</Link>.
      </p>
      {state.error && (
        <p className="err" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
