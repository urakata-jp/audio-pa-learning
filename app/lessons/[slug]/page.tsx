import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonHeader } from "@/components/LessonHeader";
import { LessonNav } from "@/components/LessonNav";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { RelatedLinks } from "@/components/RelatedLinks";
import { TableOfContents } from "@/components/TableOfContents";
import { getLessonBySlug, getLessonNeighbors, getLessons, getSourceLinks } from "@/lib/lessons";

type LessonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons().map((lesson) => ({
    slug: lesson.slug
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return {};
  }

  return {
    title: lesson.title,
    description: `${lesson.category} Lesson ${lesson.lesson}: ${lesson.title}`
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const lessons = getLessons();
  const neighbors = getLessonNeighbors(lesson.slug);
  const sourceLinks = getSourceLinks(lesson.sources);

  return (
    <main className="site-shell">
      <article className="lesson-article">
        <LessonHeader lesson={lesson} totalLessons={lessons.length} />
        <TableOfContents headings={lesson.headings} />
        <MarkdownRenderer content={lesson.body} />
        <RelatedLinks links={sourceLinks} />
      </article>
      <LessonNav previous={neighbors.previous} next={neighbors.next} />
    </main>
  );
}
