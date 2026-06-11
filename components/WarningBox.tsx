import { renderInline } from "./InlineText";

type BoxProps = {
  content: string;
};

export function WarningBox({ content }: BoxProps) {
  return (
    <aside className="callout warning-box">
      <p className="callout-title">注意</p>
      <p>{renderInline(content.trim())}</p>
    </aside>
  );
}
