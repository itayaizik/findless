"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions";
import { useT } from "./I18n";

export default function AuthForms() {
  const { t } = useT();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [inState, inAction, inPending] = useActionState<AuthState, FormData>(signIn, {});
  const [upState, upAction, upPending] = useActionState<AuthState, FormData>(signUp, {});
  const state = tab === "in" ? inState : upState;
  const pending = tab === "in" ? inPending : upPending;

  return (
    <div className="auth">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "in"} onClick={() => setTab("in")}>
          {t.navLogin}
        </button>
        <button role="tab" aria-selected={tab === "up"} onClick={() => setTab("up")}>
          {t.createAccount}
        </button>
      </div>
      <form action={tab === "in" ? inAction : upAction} className="order" key={tab}>
        <label className="field">
          <span>{t.email}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span>{t.password}</span>
          <input
            name="password"
            type="password"
            required
            minLength={tab === "up" ? 8 : undefined}
            autoComplete={tab === "in" ? "current-password" : "new-password"}
          />
        </label>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "..." : tab === "in" ? t.navLogin : t.createAccount}
        </button>
        {state.error && (
          <p className="err" role="alert">
            {state.error}
          </p>
        )}
        {state.message && <p role="status">{state.message}</p>}
      </form>
    </div>
  );
}
