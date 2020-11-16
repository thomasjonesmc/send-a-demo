import React from "react";

export default function DemosLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <div className="text-center py-20">
        <p className="text-2xl">Fetching demos... 🎸 </p>
      </div>
    );
  };
}
