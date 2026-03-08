import React from "react";
import Card from "./Card";

const MasonryGrid = ({ items }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 px-6 max-w-[1600px] mx-auto animate-premium">
      {items.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  );
};

export default MasonryGrid;
