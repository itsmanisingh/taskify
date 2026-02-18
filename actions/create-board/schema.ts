import { z } from "zod";

export const CreateBoard = z.object({
  title: z.string() // Remove the object inside here
    .min(1, {
      message: "Title is required", // Checks for empty string
    })
    .min(3, {
      message: "Title is too short", // Checks for length < 3
    }),
    image: z.string({
    // Handles both missing and incorrect type issues time:5:38:18
    error: (issue) => 
      issue.input === undefined ? "Image is required" : "Invalid image format"
  }).min(1, "Image is required"),
});








// bacause of version issue required_error Property isn't working
// import { z } from "zod";

// export const CreateBoard = z.object({
//     title: z.string({
//         required_error: "Title is required",
//         invalid_type_error: "Title is required",
//     }).min(3, {
//         message: "Title is too short."
//     }),
// });