import { z } from "zod";

export const CreateCard = z.object({
    title: z.string({
        error: (issue) => 
            issue.input === undefined ? "Title is required" : "Invalid title format"
    }).min(3, {
        message: "Title is too short",
    }),
    boardId: z.string(),
    listId: z.string(),
});










