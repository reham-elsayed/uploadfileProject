import { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";
import { toast } from "sonner";

// ✅ Default export — required by Storybook
const meta: Meta<typeof FileUpload> = {
  title: "Upload/FileUpload",
  component: FileUpload,
};
export default meta;

// ✅ Handlers
const successHandler = (file: File, response: any) => {
  toast.success(`✅ File ${file.name} uploaded successfully!`);
};

const errorHandler = (args: { file?: File; error: unknown }) => {
  const fileName = args.file ? args.file.name : "Unknown file";
  toast.error(`❌ Error uploading ${fileName}: ${String(args.error)}`);
};

// ✅ Mock upload that simulates progress and success
const mockUpload = async (files: File[], onProgress: (percent: number) => void) => {
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise((r) => setTimeout(r, 50));
  }

  // Fake server response
  return { status: "ok", fileName: files[0].name };
};

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    url: "/api/upload", // Not used if onUpload is defined
    label: "Upload a file",
    tooltip: "Only image/pdf/docx allowed",
    showUploadButton: true,
    progress: true,
    onUpload: mockUpload,         // ✅ mocked upload logic
    onSuccess: successHandler,
    onError: errorHandler,
  },
};
