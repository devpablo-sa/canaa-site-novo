"use client";

import { useEffect } from "react";

export function PostViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    fetch(`/api/posts/${postId}/view`, { method: "POST" }).catch(() => {});
  }, [postId]);
  return null;
}
