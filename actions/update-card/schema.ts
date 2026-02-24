import { z } from "zod";

export const UpdateCard = z.object({
    boardId: z.string(),
    description: z.string({
        // Uses the new Zod 4 error map syntax
        error: (issue) => "Invalid description format"
    })
    .min(3, { message: "Description is too short." })
    .optional(), // Moved optional to the end for cleaner chaining
    
    title: z.string({
        error: (issue) => 
            issue.input === undefined ? "Title is required" : "Invalid title format"
    }).min(3, {
        message: "Title is too short",
    }),
    id: z.string(),
});







// import { z } from "zod";

// export const UpdateCard = z.object({
//     boardId: z.string(),
//     description: z.optional(
//         z.string({
//             required_error: "Description is required",
//             invalid_type_error: "Description is required",
//         }).min(3, {
//             message: "Description is too short.",
//         }),
//     ),
//     title: z.string({
//         error: (issue) => 
//             issue.input === undefined ? "Title is required" : "Invalid title format"
//     }).min(3, {
//         message: "Title is too short",
//     }),
//     id: z.string(),
// });






