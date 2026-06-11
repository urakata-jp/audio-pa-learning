import { slugify, parseQuiz } from "@/lib/markdown";
import { DiagramBlock } from "./DiagramBlock";
import { DialogueBlock } from "./DialogueBlock";
import { renderInline } from "./InlineText";
import { PointBox } from "./PointBox";
import { QuizBlock } from "./QuizBlock";
import { WarningBox } from "./WarningBox";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split(/\r?\n/);
  const nodes = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const special = line.match(/^:::(dialogue|point|warning|quiz)\s*$/);
    if (special) {
      const blockLines = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        blockLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      const blockContent = blockLines.join("\n").trim();
      nodes.push(renderSpecialBlock(special[1], blockContent, nodes.length));
      continue;
    }

    const diagram = line.match(/^\[diagram:\s*([a-z0-9-]+)\]$/);
    if (diagram) {
      nodes.push(<DiagramBlock id={diagram[1]} key={`diagram-${diagram[1]}-${nodes.length}`} />);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = slugify(text);

      if (level === 1) {
        nodes.push(<h1 key={id}>{renderInline(text)}</h1>);
      } else if (level === 2) {
        nodes.push(
          <h2 id={id} key={id}>
            {renderInline(text)}
          </h2>
        );
      } else {
        nodes.push(
          <h3 id={id} key={id}>
            {renderInline(text)}
          </h3>
        );
      }

      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      nodes.push(
        <pre key={`code-${nodes.length}`}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];

      while (index < lines.length && lines[index].startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }

      nodes.push(renderTable(tableLines, nodes.length));
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const listLines = [];
      const ordered = /^\s*\d+\.\s+/.test(line);

      while (
        index < lines.length &&
        (ordered ? /^\s*\d+\.\s+/.test(lines[index]) : /^\s*[-*]\s+/.test(lines[index]))
      ) {
        listLines.push(lines[index]);
        index += 1;
      }

      nodes.push(renderList(listLines, ordered, nodes.length));
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStarter(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    nodes.push(<p key={`p-${nodes.length}`}>{renderInline(paragraphLines.join(" "))}</p>);
  }

  return <div className="markdown-body">{nodes}</div>;
}

function renderSpecialBlock(type: string, content: string, key: number) {
  if (type === "dialogue") {
    return <DialogueBlock content={content} key={`dialogue-${key}`} />;
  }

  if (type === "point") {
    return <PointBox content={content} key={`point-${key}`} />;
  }

  if (type === "warning") {
    return <WarningBox content={content} key={`warning-${key}`} />;
  }

  const quiz = parseQuiz(content);
  return <QuizBlock {...quiz} key={`quiz-${key}`} />;
}

function renderList(lines: string[], ordered: boolean, key: number) {
  const items = lines.map((line) => {
    const text = line.replace(/^\s*(?:[-*]|\d+\.)\s+/, "");
    const checklist = text.match(/^\[( |x)\]\s+(.+)$/i);

    if (checklist) {
      return {
        checked: checklist[1].toLowerCase() === "x",
        text: checklist[2]
      };
    }

    return { text };
  });

  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag className={items.some((item) => "checked" in item) ? "check-list" : undefined} key={`list-${key}`}>
      {items.map((item) => (
        <li key={item.text}>
          {"checked" in item ? <span className="check-mark" aria-hidden="true" /> : null}
          {renderInline(item.text)}
        </li>
      ))}
    </ListTag>
  );
}

function renderTable(lines: string[], key: number) {
  const rows = lines
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
    );

  const [head, ...body] = rows;

  return (
    <div className="table-wrap" key={`table-${key}`}>
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={`${row.join("-")}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function isBlockStarter(line: string) {
  return (
    /^:::(dialogue|point|warning|quiz)\s*$/.test(line) ||
    /^\[diagram:\s*([a-z0-9-]+)\]$/.test(line) ||
    /^(#{1,3})\s+/.test(line) ||
    line.startsWith("```") ||
    line.startsWith("|") ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line)
  );
}
