import type { Lesson } from "@/lib/lessons";
import { sitePath } from "@/lib/paths";

type LessonHeaderProps = {
  lesson: Lesson;
  totalLessons: number;
};

export function LessonHeader({ lesson, totalLessons }: LessonHeaderProps) {
  return (
    <header className="lesson-header">
      <a className="back-link" href={sitePath("/")}>
        レッスン一覧へ
      </a>
      <div className="lesson-kicker">
        <span>{lesson.category}</span>
        <span>
          Lesson {lesson.lesson} / {totalLessons}
        </span>
      </div>
      <h1>{lesson.title}</h1>
      <div className="progress" aria-label={`全${totalLessons}レッスン中${lesson.lesson}番目`}>
        <span style={{ width: `${(lesson.lesson / totalLessons) * 100}%` }} />
      </div>
    </header>
  );
}
