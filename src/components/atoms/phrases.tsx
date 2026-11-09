import { jaModel, Parser } from "budoux";
import { Fragment, type ReactNode } from "react";

const parser = new Parser(jaModel);

const japanese = /[぀-ヿ㐀-鿿]/;

export function phrases(text: string): ReactNode {
  if (!japanese.test(text)) return text;
  const parts = parser.parse(text);
  if (parts.length < 2) return text;
  return (
    <span className="wrap-anywhere break-keep">
      {parts.map((part, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the parts of a fixed text never reorder
        <Fragment key={index}>
          {index > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </span>
  );
}

export function Phrases({ children }: { children: string }) {
  return phrases(children);
}
