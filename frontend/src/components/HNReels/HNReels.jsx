import React, { useRef, useMemo } from "react";
import { useStoryData, useArrowKeySnap } from "./hooks";
import StoryCard from "./StoryCard";
import Header from "./Header";

const HNReels = () => {
  const { items, loading } = useStoryData();
  const containerRef = useRef(null);
  const cardRefs = useMemo(
    () => items.map(() => React.createRef()),
    [items]
  );

  useArrowKeySnap(containerRef, cardRefs);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        Loading stories...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      <Header />
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {items.map((item, i) => (
          <StoryCard ref={cardRefs[i]} key={item.id} item={item} />
        ))}
        <div className="h-[12vh]" />
      </div>
    </div>
  );
};

export default HNReels;