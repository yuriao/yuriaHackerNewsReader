import { useParams } from "wouter";
import StoryDetail from "@/components/StoryDetail";

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const storyId = parseInt(id);

  if (isNaN(storyId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-500">Invalid Story ID</h2>
            <p className="mt-4">The story ID provided is not valid.</p>
          </div>
        </div>
      </div>
    );
  }

  return <StoryDetail storyId={storyId} />;
}
