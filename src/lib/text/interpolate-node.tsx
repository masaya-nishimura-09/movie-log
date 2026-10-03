import { createElement, Fragment, type ReactNode } from "react";

export function interpolateNode(
  template: string,
  values: Record<string, ReactNode>,
): ReactNode {
  const parts = template.split(/(\{\w+\})/).map((part) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return key !== undefined && key in values ? values[key] : part;
  });
  return createElement(Fragment, null, ...parts);
}
