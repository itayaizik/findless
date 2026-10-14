import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-embed": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { project: string };
    }
  }
}
