import { IdeaDetailPage } from '@/features/idea-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <IdeaDetailPage id={id} />;
}
