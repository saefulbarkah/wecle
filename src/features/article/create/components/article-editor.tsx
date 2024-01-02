"use client";

import React, { useEffect, useState } from "react";
import { useFindDraft } from "../../api/get-draft-article";
import { useSearchParams } from "next/navigation";
import { useIsMutating } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useAuth } from "@/stores/auth-store";
import { useArticleState } from "@/stores/article-store";

const EditorArticle = dynamic(
  () => import("./Editor/Editor").then((data) => data.Editor),
  {
    ssr: false,
  },
);

export const CreateArticle = () => {
  const session = useAuth((state) => state.session);
  const articleState = useArticleState((state) => state);
  const isPublishing = useIsMutating({ mutationKey: ["create-article"] });
  const [id, setID] = useState<string | null>(null);
  const draftID = useSearchParams().get("draftId") || null;
  const {
    data: article,
    isLoading,
    isError,
  } = useFindDraft({
    id: id,
  });

  useEffect(() => {
    if (!article) {
      articleState.setArticle({ author: session?.author_id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, article]);

  useEffect(() => {
    const bindstate = () => {
      if (article) {
        articleState.setArticle(article);
      }
    };
    bindstate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  useEffect(() => {
    if (draftID) {
      setID(draftID);
    }
  }, [draftID]);

  useEffect(() => {
    if (isError) {
      window.history.pushState("", "", "/article/new");
    }
  }, [draftID, isError]);

  return (
    <>
      <div className="relative h-[calc(100vh-60px)] overflow-y-auto">
        <div className="container max-w-5xl">
          {isLoading && (
            <>
              <div className="absolute inset-0 z-50 mt-[60px] cursor-not-allowed backdrop-blur-sm"></div>
            </>
          )}
          <EditorArticle
            article={article}
            isPublishing={Boolean(isPublishing)}
          />
        </div>
      </div>
    </>
  );
};
