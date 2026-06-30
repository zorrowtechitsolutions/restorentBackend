import { z } from "zod";
export declare const createItemSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodString;
    tax: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    image: z.ZodOptional<z.ZodString>;
    itemType: z.ZodEnum<{
        Veg: "Veg";
        "Non Veg": "Non Veg";
    }>;
    isFeatured: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        Active: "Active";
        Inactive: "Inactive";
    }>>>;
    caution: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    createdBy: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateItemSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    tax: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    itemType: z.ZodOptional<z.ZodEnum<{
        Veg: "Veg";
        "Non Veg": "Non Veg";
    }>>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        Active: "Active";
        Inactive: "Inactive";
    }>>>>;
    caution: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
