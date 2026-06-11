import { getLessons } from "@/lib/lessons";
import { sitePath } from "@/lib/paths";

export default function Home() {
  const lessons = getLessons();
  const categories = Array.from(new Set(lessons.map((lesson) => lesson.category)));

  return (
    <main className="site-shell">
      <section className="home-hero">
        <p className="section-label">スマホで学ぶPA基礎</p>
        <h1>イベント音響の教科書</h1>
        <p>
          講演会、出し物、屋外イベント、同時通訳、録音、別室送りまで。現場で迷わないための音響教材です。
        </p>
      </section>

      <section className="lesson-overview" aria-label="教材の章">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </section>

      <section className="lesson-list" aria-label="レッスン一覧">
        {lessons.map((lesson) => (
          <a className="lesson-card" href={sitePath(`/lessons/${lesson.slug}/`)} key={lesson.slug}>
            <span className="lesson-number">Lesson {lesson.lesson}</span>
            <h2>{lesson.title}</h2>
            <p>{lesson.category}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
