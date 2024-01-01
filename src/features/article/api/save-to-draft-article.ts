"use client";

import { articleType, useArticleState } from "@/stores/article-store";
import { ApiResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import API from "@/api";
import toast from "react-hot-toast";

type response = AxiosResponse<ApiResponse<Partial<articleType>>>;

type post = Pick<articleType, "content" | "title" | "author"> & {
  id: string | null | undefined;
};

const saveToDraft = (data: Partial<articleType>, token: string) => {
  return API.axios.post<any, response, post>(
    "/article/save/draft",
    {
      id: data._id,
      title: data.title,
      content: data.content,
      author: data.author,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
};

export const useSaveDraft = () => {
  const query = useQueryClient();
  const article = useArticleState((state) => state);
  const isSavingID = "saving-draft";

  return useMutation<
    response,
    AxiosError<ApiResponse>,
    { data: Partial<articleType>; token: string }
  >({
    mutationKey: ["save-draft"],
    mutationFn: ({ data, token }) => saveToDraft(data, token),
    onSuccess: async (res) => {
      query.invalidateQueries({ queryKey: ["draft"] });
      toast.success(res.data.message, {
        id: isSavingID,
      });
      const response = res.data;
      if (!response.data) return;
      const { _id, author, content, title, cover } = response.data;
      const url = `?draftId=${_id}`;
      window.history.replaceState(
        {
          ...window.history.state,
          as: url,
          url: url,
        },
        "",
        url,
      );
      article.setArticle({
        _id,
        author,
        content,
        title,
        cover,
      });
    },
    onError: (res) => {
      const response = res.response?.data;
      return toast.error(response?.message as string);
    },
    onMutate: () => {
      toast.loading("Saving draft....", {
        id: isSavingID,
      });
    },
  });
};
