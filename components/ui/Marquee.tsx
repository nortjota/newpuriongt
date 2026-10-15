import type { ReactNode } from "react";

export default function Marquee<T>({
  items,
  renderItem,
  duration = "38s",
  reverse = false,
  className,
  itemClassName,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  duration?: string;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-10 ${className ?? ""}`}
        style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className={`flex gap-10 ${itemClassName ?? ""}`}>
            {items.map((item, i) => renderItem(item, i))}
          </div>
        ))}
      </div>
    </div>
  );
}
