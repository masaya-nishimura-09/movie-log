"use client";

import { useId } from "react";
import type { markShapes } from "@/components/atoms/logo-shapes";

type BrandShapeProps = {
  shapes: typeof markShapes;
  ringClassName: string;
  glyphClassName: string;
  label?: string;
  className?: string;
};

export function BrandShape({
  shapes,
  ringClassName,
  glyphClassName,
  label,
  className,
}: BrandShapeProps) {
  const maskId = useId();
  const [x, y, width, height] = shapes.maskBox;

  return (
    <svg
      viewBox={shapes.viewBox}
      className={className}
      role="img"
      aria-label={label}
      aria-hidden={label === undefined}
    >
      <g transform={shapes.transform}>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={x}
          y={y}
          width={width}
          height={height}
        >
          <rect x={x} y={y} width={width} height={height} fill="#fff" />
          {shapes.maskPolygons.map(([points, fill]) => (
            <polygon key={points} points={points} fill={fill} />
          ))}
        </mask>
        <path
          mask={`url(#${maskId})`}
          fillRule="evenodd"
          d={shapes.ring}
          className={ringClassName}
        />
        <ellipse
          cx={shapes.dot.cx}
          cy={shapes.dot.cy}
          rx={shapes.dot.rx}
          ry={shapes.dot.ry}
          transform={shapes.dot.transform}
          className={ringClassName}
        />
      </g>
      <path d={shapes.glyph} className={glyphClassName} />
    </svg>
  );
}
