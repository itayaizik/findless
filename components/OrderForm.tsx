"use client";

import { useActionState, useState } from "react";
import { placeOrder, type OrderState } from "@/app/actions";

export default function OrderForm({
  slug,
  sizes,
  email,
}: {
  slug: string;
  sizes: string[];
  email?: string;
}) {
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, { ok: false });
  const [size, setSize] = useState("");

  if (state.ok) {
    return (
      <div className="order-done" role="status">
        <b>Order #{state.id} received.</b>
        <p>We&apos;ll send a Bit payment link to {state.contact} soon. Payment confirms your order.</p>
      </div>
    );
  }

  return (
    <form action={action} className="order">
      <input type="hidden" name="slug" value={slug} />
      <fieldset>
        <legend>Size</legend>
        <div className="size-row">
          {sizes.map((s) => (
            <label key={s} className={`size${size === s ? " on" : ""}`}>
              <input type="radio" name="size" value={s} required checked={size === s} onChange={() => setSize(s)} />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        <span>Name</span>
        <input name="name" autoComplete="name" maxLength={80} />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" defaultValue={email} maxLength={254} />
      </label>
      <p className="hint">Phone or email, one is enough.</p>
      <label className="field">
        <span>Note (optional)</span>
        <input name="note" maxLength={500} />
      </label>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Sending..." : "Order"}
      </button>
      <p className="hint">No payment here. We contact you with a Bit link to pay.</p>
      {state.error && (
        <p className="err" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
