import { renderInline } from "./InlineText";

type DialogueBlockProps = {
  content: string;
};

export function DialogueBlock({ content }: DialogueBlockProps) {
  const messages = content
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [speakerLine, ...bodyLines] = block.split(/\r?\n/);
      const speaker = speakerLine.replace(/:\s*$/, "");
      const body = bodyLines.join("\n").replace(/^「|」$/g, "");

      return { speaker, body };
    });

  return (
    <div className="dialogue-block">
      {messages.map((message) => (
        <div className="dialogue-row" key={`${message.speaker}-${message.body}`}>
          <div className="speaker-mark" aria-hidden="true">
            {message.speaker.slice(0, 1)}
          </div>
          <div>
            <p className="speaker-name">{message.speaker}</p>
            <p>{renderInline(message.body)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
