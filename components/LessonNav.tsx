import type { Lesson } from "@/lib/lessons";
import { sitePath } from "@/lib/paths";

type LessonNavProps = {
  previous?: Lesson;
  next?: Lesson;
};

export function LessonNav({ previous, next }: LessonNavProps) {
  return (
    <nav className="lesson-nav" aria-label="前後のレッスン">
      {previous ? (
        <a className="nav-card" href={sitePath(`/lessons/${previous.slug}/`)}>
          <span>前へ</span>
          {previous.title}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className="nav-card nav-card-next" href={sitePath(`/lessons/${next.slug}/`)}>
          <span>次へ</span>
          {next.title}
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
