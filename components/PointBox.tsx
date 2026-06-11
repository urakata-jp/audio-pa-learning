import { renderInline } from "./InlineText";

type BoxProps = {
  content: string;
};

export function PointBox({ content }: BoxProps) {
  return (
    <aside className="callout point-box">
      <p className="callout-title">POINT</p>
      <p>{renderInline(content.trim())}</p>
    </aside>
  );
}
