'use client';

import {
  CommentServices,
  likeCommentType,
} from '@/services/comment/comment-service';
import { findCommentType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDislikeCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, likeCommentType & { token: string }>({
    mutationFn: (data) =>
      CommentServices.dislikeComment(
        { id: data.id, userId: data.userId },
        data.token
      ),
    onMutate: async (mutateData) => {
      const data = queryClient.getQueryData([
        'comment-article',
      ]) as findCommentType[];

      const commentIndex = data.findIndex((item) => item._id === mutateData.id);

      if (commentIndex !== -1) {
        // Update the likes array directly
        data[commentIndex].likes = data[commentIndex].likes.filter(
          (item) => item._id !== mutateData.userId
        );

        // Update the array of comments in the cache with the modified comment
        queryClient.setQueryData(['comment-article'], data);
      }
    },
    // onSettled: async () => {
    //   await queryClient.invalidateQueries({ queryKey: ['comment-article'] });
    // },
  });
};
