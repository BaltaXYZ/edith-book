import type { ReactNode } from "react";

type ProseProps = {
  children: ReactNode;
};

export function Prose({ children }: ProseProps) {
  return <div className="prose">{children}</div>;
}
