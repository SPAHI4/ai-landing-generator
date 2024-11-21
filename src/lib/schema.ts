import { z } from 'zod';

export const schema = z.object({
  commentary: z
    .string()
    .describe(
      `Describe what you're about to do and the steps you want to take for generating the code in great detail.`,
    ),
  title: z
    .string()
    .describe(
      'Short title of the code artifact generated. If there are changes since the last generated code, add them very briefly.',
    ),
  code: z
    .string()
    .describe(
      'Full, properly structured and valid HTML and include the necessary CDN links for CSS, JS, fonts\n  Start with <!DOCTYPE html> and end with </html>. The code should be formatted for readability.',
    ),
  followUps: z
    .array(z.string())
    .describe('Very short possible suggestions that user can ask to do next, or your suggestions for the user.'),
});

export type ArtifactSchema = z.infer<typeof schema>;
