"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = () => {
    const params = useParams();
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) return;

        setActive({
            organization: params.organizationId as string,
        });
    }, [setActive, params.organizationId]);


    // Error pakadne k liye likha tha
        // useEffect(() => {
        // if (!setActive) return;

        // setActive({
        //     organization: params.organizationId as string,
        // })
        // .then(() => {
        //     console.log("Organization successfully switched to:", params);
        // })
        // .catch((err) => {
        //     console.error("Failed to switch organization:", err);
        //     // Isse tumhe console mein dikh jayega ki ID valid hai ya nahi
        // });

        // }, [setActive, params.organizationId]);

    return null;
};