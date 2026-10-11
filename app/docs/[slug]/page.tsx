import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { DOC_MODULES } from '@/lib/docs-data';
import { DocView } from '@/components/docs/DocView';
import { TableOfContents } from '@/components/layout/TableOfContents';

export async function generateStaticParams() {
  return DOC_MODULES.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = DOC_MODULES.find((m) => m.slug === slug);

  if (!mod) {
    return {
      title: 'Modul Tidak Ditemukan | PBL Engineering Guide',
    };
  }

  return {
    title: `${mod.title} | PBL Engineering Guide`,
    description: mod.subtitle,
  };
}

async function DocContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = DOC_MODULES.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  return (
    <>
      <DocView module={mod} />
      <TableOfContents />
    </>
  );
}

export default function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto py-8 animate-pulse font-sidebar">
          <div className="h-7 bg-zinc-900 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-zinc-900 rounded w-2/3 mb-8"></div>
          <div className="space-y-3">
            <div className="h-20 bg-zinc-900 rounded"></div>
            <div className="h-20 bg-zinc-900 rounded"></div>
          </div>
        </div>
      }
    >
      <DocContent params={params} />
    </Suspense>
  );
}
