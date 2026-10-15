import * as z from "zod";

export const free_form_schema = z.object({
  product: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long")
    .regex(/^[\w\s,-]+$/, "Product name contains invalid characters"),
  searchTags: z
    .string()
    .min(1, "At least one search tag is required")
    .max(255, "Search tags are too long")
    .regex(/^[\w\s,-]+$/, "Search tags contain invalid characters"),
});