'use client';

import FileUploadYoutube from "@/components/FileUpload-1/FileUpload";
import FileUpload from "@/components/FileUpload/FileUpload";
import { Card } from "@/components/ui/card";
import React from "react";
import { toast } from "sonner";



// customized style color size animation
// data dynamic progress bar
export default function Home() {
  const successHandler = (file: File, response: any) => {
    toast.success(`File ${file.name} uploaded successfully!`);}

    const errorHandler = (args: { file?: File; error: unknown }) => {
      const fileName = args.file ? args.file.name : "Unknown file";
      toast.error(`Error uploading ${fileName}: ${args.error}`);
    };
  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
  <FileUpload onError={errorHandler} variant="default" progress={true} onSuccess={successHandler} url='api/upload'>
  <p className="text-xs text-muted-foreground">
    Allowed file types: PNG, JPG, PDF, DOCX.
  </p>
</FileUpload>
 {/* <FileUploadYoutube/> */}

  </div>
  );
}
