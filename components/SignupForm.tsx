"use client";

import { useState } from "react";

type State = { kind: "idle" | "sending" | "done" | "error"; msg?: string };

export default function SignupForm({
  source = "home",
  cta = "Notify me",
}: {
  source?: string;
  cta?: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          website: form.get("website"),
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState({
        kind: "done",
        msg: data.already ? "You're already on the list." : "You're on the list. First drop soon.",
      });
    } catch (err) {
      setState({ kind: "error", msg: (err as Error).message });
    }
  }

  return (
    <div className="signup">
      {state.kind === "done" ? (
        <p className="msg">{state.msg}</p>
      ) : (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              aria-label="Email"
              autoComplete="email"
            />
            <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="submit" disabled={state.kind === "sending"}>
              {state.kind === "sending" ? "..." : cta}
            </button>
          </form>
          <p className={`msg${state.kind === "error" ? " err" : ""}`}>
            {state.kind === "error" ? state.msg : "Join the list. Only drops, no spam."}
          </p>
        </>
      )}
    </div>
  );
}
