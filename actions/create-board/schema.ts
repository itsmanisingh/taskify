import { z } from "zod";

export const CreateBoard = z.object({
  title: z.string() // Remove the object inside here
    .min(1, {
      message: "Title is required", // Checks for empty string
    })
    .min(3, {
      message: "Title is too short", // Checks for length < 3
    }),
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