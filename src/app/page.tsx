'use client';

import {FileUpload} from "@/components/FileUpload/FileUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
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
  
   const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
const [form, setForm] = useState({
  username: "", // You can add more fields like email, password, etc.
});
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: value,
  }));
  console.log("Form data changed:", { ...form, [name]: value });
};

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('username', form.username); // assume you collect other fields too
  selectedFiles?.forEach(file => {
    formData.append('files', file);
  });
console.log("Form data being submitted:", formData.get('username'), formData.getAll('files'));
  try {
   
    toast.success(`Form and files submitted!  Username: ${formData.get('username'), formData.getAll('files')}`);
  } catch (err) {
    toast.error("Failed to submit form");
  }
};

  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <form className="w-full max-w-2xl space-y-4" onSubmit={handleFormSubmit} >
      <label className="block text-sm font-medium text-gray-700">
        fileName
      </label>
      <Input type="text" value={form.username} onChange={handleChange} name="username"/>
  <FileUpload onError={errorHandler} variant="success" showUploadButton={false} progress={true} onSuccess={successHandler} onSelectFile={(files) => setSelectedFiles(files)} url='api/upload'>
  <p className="text-xs text-muted-foreground">
    Allowed file types: PNG, JPG, PDF, DOCX.
  </p>
</FileUpload>

 <Button

 type="submit"
  className="w-full" variant="default" size="lg">
  submit
  </Button>
</form>

  <FileUpload onError={errorHandler} variant="success" showUploadButton={true} progress={true} onSuccess={successHandler}  url='api/upload'/>

  </div>
  );
}
