import { z } from 'zod';

const articleSchema = z
  .object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
    author: z.string({ required_error: 'Author is required' }),
    slug: z.string({ required_error: 'Slug is required' }).optional(),
  })
  .required({
    author: true,
    body: true,
    title: true,
  });

type articleType = z.infer<typeof articleSchema>;

export { articleType, articleSchema };
