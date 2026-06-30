import { z } from "zod";
export declare const offerSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    amount: z.ZodNumber;
    image: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    start_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    end_date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    branch_id: z.ZodOptional<z.ZodNumber>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
    editor_type: z.ZodOptional<z.ZodString>;
    editor_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateOfferSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    start_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    end_date: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    branch_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    editor_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    editor_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const offerItemSchema: z.ZodObject<{
    offer_id: z.ZodNumber;
    item_id: z.ZodNumber;
    branch_id: z.ZodOptional<z.ZodNumber>;
    creator_type: z.ZodOptional<z.ZodString>;
    creator_id: z.ZodOptional<z.ZodNumber>;
    editor_type: z.ZodOptional<z.ZodString>;
    editor_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateOfferItemSchema: z.ZodObject<{
    offer_id: z.ZodOptional<z.ZodNumber>;
    item_id: z.ZodOptional<z.ZodNumber>;
    branch_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    creator_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    creator_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    editor_type: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    editor_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
