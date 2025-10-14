import React, { useRef, useMemo, useEffect } from "react";
import { useStoryData, useArrowKeySnap } from "./hooks";
import StoryCard from "./StoryCard";
import Header from "./Header";

const HNReels = () => {
  const { items, loading, loadingMore, hasMore, loadMore } = useStoryData();
  const containerRef = useRef(null);
  const cardRefs = useMemo(
    () => items.map(() => React.createRef()),
    [items]
  );

  useArrowKeySnap(containerRef, cardRefs);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < 200 && !loadingMore && hasMore) {
        loadMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loadingMore, hasMore, loadMore]);

  if (loading && items.length === 0) {
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

        {loadingMore && (
          <div className="h-screen snap-start flex items-center justify-center">
            <div className="text-white text-lg">Loading more stories...</div>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className="h-screen snap-start flex items-center justify-center">
            <div className="text-gray-500 text-lg">No more stories to load</div>
          </div>
        )}

        <div className="h-[12vh]" />
      </div>
    </div>
  );
};

export default HNReels;