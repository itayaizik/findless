import type { Dict } from "@/lib/dict";
import { fill } from "@/lib/dict";
import type { SizeChart as Chart } from "@/lib/products";

const LABEL = { length: "szLength", chest: "szChest", shoulder: "szShoulder", sleeve: "szSleeve" } as const;

export default function SizeChart({ chart, sizes, t }: { chart: Chart; sizes: string[]; t: Dict }) {
  return (
    <details className="size-chart">
      <summary>{t.sizeChart}</summary>
      <table dir="ltr">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">cm</span>
            </th>
            {sizes.map((s) => (
              <th key={s} scope="col">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r.key}>
              <th scope="row">{t[LABEL[r.key]]}</th>
              {r.values.slice(0, sizes.length).map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">
        {t.szNote}
        {chart.model && <> {fill(t.szModel, { m: chart.model })}</>}
      </p>
    </details>
  );
}
