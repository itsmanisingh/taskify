"use server";
 
import { z } from "zod";

import { db } from "@/lib/db";

const CreateBoard = z.object({
    title: z.string(),
});

export async function create(formData: FormData) {
    // const title = formData.get("title") as string;   zod will make sure that it will string
    const { title } = CreateBoard.parse({
        title: formData.get("title"),
    });

        await db.board.create({
            data: {
                title,
            }
        });
}