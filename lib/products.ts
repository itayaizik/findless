export type Product = {
  slug: string;
  code: string;
  name: string;
  color: string;
  details: string[];
  sizes: string[];
  sizeChart?: SizeChart;
};

// Measurements in cm, one value per size (same order as sizes).
export type SizeChart = { rows: { key: "length" | "chest" | "shoulder" | "sleeve"; values: number[] }[]; model?: string };

// Drop 001 zip hoodie, from the size chart in collection/fit.
const ZIP_HOODIE_CHART: SizeChart = {
  rows: [
    { key: "length", values: [65, 67, 69, 71] },
    { key: "chest", values: [61, 64, 67, 70] },
    { key: "shoulder", values: [57, 60, 63, 66] },
    { key: "sleeve", values: [56, 57, 58, 59] },
  ],
  model: "177cm · L",
};

const SIZES = ["S", "M", "L", "XL"];

export const products: Product[] = [
  {
    slug: "zip-hoodie-woodland",
    code: "FL-06C",
    name: "ZIP HOODIE",
    color: "WOODLAND CAMO",
    details: [
      "Woodland camo",
      "Sun faded wash",
      "Cracked 失 print at front",
      "FINDLESS embroidered at back",
      "Distressed details",
    ],
    sizes: SIZES,
    sizeChart: ZIP_HOODIE_CHART,
  },
  {
    slug: "zip-hoodie-baby-blue",
    code: "FL-06",
    name: "ZIP HOODIE",
    color: "BABY BLUE CAMO",
    details: [
      "Baby blue camo",
      "Faded cream 失 print at front",
      "FINDLESS embroidered at back",
      "Distressed details",
    ],
    sizes: SIZES,
    sizeChart: ZIP_HOODIE_CHART,
  },
  {
    slug: "zip-hoodie-pink",
    code: "FL-06B",
    name: "ZIP HOODIE",
    color: "PINK CAMO",
    details: [
      "Pink camo",
      "Faded cream 失 print at front",
      "FINDLESS embroidered at back",
      "Distressed details",
    ],
    sizes: SIZES,
    sizeChart: ZIP_HOODIE_CHART,
  },
  {
    slug: "crop-zip-hoodie-black",
    code: "FL-01",
    name: "CROP ZIP HOODIE",
    color: "BLACK",
    details: [
      "Cropped at the waist",
      "Drop shoulder",
      "Silver metal zip",
      "Natural cream 12mm twisted cotton rope",
      "Knotted frayed tassel ends",
    ],
    sizes: SIZES,
  },
  {
    slug: "camo-denim-woodland",
    code: "FL-02",
    name: "CAMO DENIM",
    color: "WOODLAND",
    details: [
      "Woodland camo printed on denim",
      "Dark dirty vintage wash",
      "Extra baggy straight leg, open hem",
      "Mid thigh cargo pockets",
      "5 pocket jeans back",
    ],
    sizes: SIZES,
  },
  {
    slug: "camo-denim-pink",
    code: "FL-02B",
    name: "CAMO DENIM",
    color: "DUSTY PINK",
    details: [
      "Muted vintage pink camo on denim",
      "Dirty vintage wash",
      "Extra baggy straight leg, open hem",
      "Mid thigh cargo pockets",
      "5 pocket jeans back",
    ],
    sizes: SIZES,
  },
  {
    slug: "rope-sweatpants-black",
    code: "FL-03",
    name: "ROPE SWEATPANTS",
    color: "BLACK",
    details: [
      "Heavy fleece",
      "Wide leg",
      "Cream 12mm rope drawstring, same as the crop hoodie",
      "Hand distressed rips",
      "Raw hems",
    ],
    sizes: SIZES,
  },
  {
    slug: "boxy-tee-black",
    code: "FL-04",
    name: "BOXY TEE",
    color: "STONE BLACK",
    details: [
      "Oversize boxy fit",
      "Dropped shoulders",
      "Thick rib collar",
      "Subtle stone wash",
      "Big print at front, plain back",
    ],
    sizes: SIZES,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function defaultImages(slug: string) {
  return products.some((p) => p.slug === slug) ? [`/products/${slug}-front.webp`, `/products/${slug}-back.webp`] : [];
}
