// file-upload.stories.tsx

import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload"; // adjust path
import { toast } from "sonner";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  args: {
    label: "Upload a document",
    url: "/api/upload", // mock URL
    variant: "default",
    size: "md",
    progress: true,
    showUploadButton: true,
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    onSuccess: (file, response) => {
      toast.success(`${file.name} uploaded successfully`);
    },
    onError: ({ file, error }) => {
      toast.error(`Failed to upload ${file?.name}: ${error}`);
    },
  },
};

export const DarkVariant: Story = {
  args: {
    variant: "dark",
    label: "Dark Variant Upload",
  },
};

export const WithChildren: Story = {
  args: {
    children: <p className="text-xs text-muted-foreground">Only PNG, JPG, PDF, and DOCX allowed</p>,
  },
};
