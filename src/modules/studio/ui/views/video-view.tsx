import { FormSection } from "../sections/form-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="px-4 pt-2.4 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  )
}