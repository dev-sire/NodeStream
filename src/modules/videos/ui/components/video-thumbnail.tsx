import Image from "next/image"

interface VideoThumbnailProps {
  imageUrl?: string | null;
}

export const VideoThumbnail = ({ imageUrl }: VideoThumbnailProps) => {
  return (
    <div className="relatuve">
      {/* Thumbnail Wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image src={imageUrl ?? '/placeholder.svg'} alt="Thumnail" fill className="size-full object-cover" />
      </div>
      {/* Video Duration Box */}
      {/* TODO: add video duration box */}
    </div>
  )
}