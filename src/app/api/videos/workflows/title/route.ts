import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(
  async (context) => {
    await context.run("initial-step", () => {
      console.log("Initial Step Ran");
    })
    await context.run("second-step", () => {
      console.log("Second Step Ran");
    })
  } 
)