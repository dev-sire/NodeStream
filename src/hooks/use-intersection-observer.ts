import { useEffect, useRef, useState } from "react";

export const useIntersetionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options);
    
    if(targetRef.current){
      observer.observe(targetRef.current)
    }

    return () => observer.disconnect()

  }, [options])

  return { targetRef, isIntersecting };
}