import { useEffect } from "react";

function Loading({ isLoading }) {
  return (
    <div
      className="is-loading"
      style={{
        display: isLoading ? "inline-block" : "none",
      }}
    >
      <span className="loading-text">Loading!</span>
    </div>
  );
}

export default Loading;
