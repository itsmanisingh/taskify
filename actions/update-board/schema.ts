import { z } from "zod";

export const UpdateBoard = z.object({
    title: z.string({
        // Standardizes both missing (undefined) and wrong-type inputs
        error: (issue) => 
            issue.input === undefined ? "Title is required" : "Invalid title format"
    }).min(3, {
        message: "Title is too short",
    }),
    id: z.string(),
});











// import { z } from "zod";

// export const UpdateBoard = z.object({
//     title: z.string({
//         required_error: "Title is required",
//         invalid_type_error: "Title is required",
//     }).min(3, {
//         message: "Title is too short",
//     }),
//     id: z.string(),
// });