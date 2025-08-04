import { cva, type VariantProps } from "class-variance-authority";

export const fileUploadVariants = cva(
    "max-w-md mx-auto my-10 w-5xl",
{
    variants: {
        variant: {
             default: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
        ghost: "bg-transparent border border-dashed border-gray-300",
        muted: "bg-gray-50 border border-gray-100",
        dark: "bg-gray-900 text-white border border-gray-800",
        success: "bg-green-50 border border-green-200",
        danger: "bg-red-50 border border-red-200",
        },
        size: {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-lg", 
        }
    },
    defaultVariants:{
        variant: "default",
        size: "md",
    },
})
export type FileUploadVariants = VariantProps<typeof fileUploadVariants>
export const dropzoneVariants = cva(
    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
    {
        variants:{
            dragActive: {
                true: "border-blue-500 bg-blue-50",
                false: "border-gray-300 bg-white",
            },
        },
    })