'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { IChapter } from '@/lib/definitions';

interface ChapterHeaderProps {
  chapter: IChapter;
  manualId: string;
}

export function ChapterHeader({ chapter, manualId }: ChapterHeaderProps) {
  const router = useRouter();

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => router.push(`/admin/assessments/${manualId}`)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Manual
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-semibold text-3xl text-secondary">
            {chapter.title}
          </h1>
          <p className="text-gray-600 mt-2">
            Capítulo {chapter.order} - {chapter.manual?.title}
          </p>
        </div>
      </div>
    </div>
  );
}
