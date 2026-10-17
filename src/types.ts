import { z } from 'zod';

export type ZoomType = 'zoom-in' | 'punch-in' | 'pan-down' | 'zoom-out' | 'static';

export const sceneSchema = z.object({
  id: z.union([z.string(), z.number()]),
  mediaUrl: z.string(),
  durationInFrames: z.number(),
  zoomType: z.enum(['zoom-in', 'punch-in', 'pan-down', 'zoom-out', 'static']),
  text: z.string(),
  highlightWords: z.array(z.string()),
  videoStartFrame: z.number().optional(),
});

export const mainCompositionSchema = z.object({
  scenes: z.array(sceneSchema),
  showWatermark: z.boolean().optional(),
  watermarkText: z.string().optional(),
  outroDurationInFrames: z.number().optional(),
  outroRating: z.string().optional(),
  outroTitle: z.string().optional(),
  outroCoverImage: z.string().optional(),
});

export type Scene = z.infer<typeof sceneSchema>;
export type MainCompositionProps = z.infer<typeof mainCompositionSchema>;
