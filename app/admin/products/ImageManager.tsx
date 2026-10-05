"use client";

import { useState } from "react";
import { createImageUpload } from "../actions";

// Shrinks a photo to max 1600px WebP before upload (keeps transparency), so pages stay fast.
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read image"))), "image/webp", 0.86),
  );
}

export default function ImageManager({ slug, initial }: { slug: string; initial: string[] }) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    try {
      for (const file of Array.from(files)) {
        const blob = await compress(file);
        const { signedUrl, publicUrl, apikey } = await createImageUpload(slug, "webp");
        const body = new FormData();
        body.append("cacheControl", "31536000");
        body.append("", blob);
        const res = await fetch(signedUrl, { method: "PUT", body, headers: { apikey, "x-upsert": "false" } });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        setImages((list) => [...list, publicUrl]);
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function move(i: number, d: number) {
    setImages((list) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <fieldset className="imgs">
      <legend>Images (first = main, second = shown on hover)</legend>
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <div className="imgs-grid">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="imgs-item">
            <img src={src} alt={`Image ${i + 1}`} />
            <span className="dim">{i === 0 ? "Main" : i === 1 ? "Hover" : `#${i + 1}`}</span>
            <div className="imgs-btns">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} left`}>
                ←
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                aria-label={`Move image ${i + 1} right`}
              >
                →
              </button>
              <button type="button" onClick={() => setImages((l) => l.filter((_, k) => k !== i))} aria-label={`Remove image ${i + 1}`}>
                ✕
              </button>
            </div>
          </div>
        ))}
        <label className="imgs-add">
          <input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} disabled={busy} />
          <span>{busy ? "Uploading..." : "+ Add images"}</span>
        </label>
      </div>
      {err && (
        <p className="err" role="alert">
          {err}
        </p>
      )}
      <p className="hint">Changes to images are saved when you press Save.</p>
    </fieldset>
  );
}
