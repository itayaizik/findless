import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog, getIsAdmin } from "@/lib/site";
import { saveProductFull } from "../../actions";
import ImageManager from "../ImageManager";

export const metadata: Metadata = { title: "Edit product", robots: { index: false } };

export default async function EditProduct({ params }: PageProps<"/admin/products/[slug]">) {
  if (!(await getIsAdmin())) notFound();
  const { slug } = await params;
  const p = (await getCatalog(true)).find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div className="admin">
      <Link href="/admin#products-h" className="muted">
        ← Back to admin
      </Link>
      <h1>
        Edit · {p.name || "New product"} {p.color && `[${p.color}]`}
      </h1>
      <form action={saveProductFull} className="admin-row edit-form">
        <input type="hidden" name="slug" value={p.slug} />
        <div className="two">
          <label className="field">
            <span>Name</span>
            <input name="name" defaultValue={p.name} required maxLength={80} />
          </label>
          <label className="field">
            <span>Color</span>
            <input name="color" defaultValue={p.color} maxLength={80} />
          </label>
        </div>
        <div className="three">
          <label className="field">
            <span>Item no.</span>
            <input name="code" defaultValue={p.code} maxLength={20} placeholder="FL-07" />
          </label>
          <label className="field">
            <span>Price ₪ (empty = TBA)</span>
            <input name="price" type="number" min={0} step={1} defaultValue={p.price ?? ""} />
          </label>
          <label className="field">
            <span>Status</span>
            <select name="status" defaultValue={p.status}>
              <option value="available">Available</option>
              <option value="sold_out">Sold out</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Sizes (comma or space)</span>
          <input name="sizes" defaultValue={p.sizes.join(", ")} placeholder="S, M, L, XL" />
        </label>
        <label className="field">
          <span>Description (optional, shown above the details)</span>
          <textarea name="description" rows={4} defaultValue={p.description} maxLength={2000} />
        </label>
        <label className="field">
          <span>Details (one per line)</span>
          <textarea name="details" rows={6} defaultValue={p.details.join("\n")} />
        </label>
        <ImageManager slug={p.slug} initial={p.images} />
        <button className="btn">Save</button>
      </form>
    </div>
  );
}
