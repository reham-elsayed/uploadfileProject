
import React from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useState, useRef, ReactNode } from 'react'
import { DroneIcon, UploadCloudIcon } from 'lucide-react'
import axios from 'axios'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from '../ui/progress'
import { toast } from 'sonner'
import useDragAndDrop from '@/app/hooks/useDragAndDrop'
import { on } from 'events'
import { dropzoneVariants, fileUploadVariants, FileUploadVariants } from '../ui/file-upload'

interface FileUploadProps extends FileUploadVariants {
  /** Optional children to render inside the component */
   children?: ReactNode
  /** Additional CSS classes */
   className?: string;
  /** Show progress bar under each file */
  progress?: boolean;
  /** MIME types or file extensions to accept */
  accept?: string;
  /** Called when files are selected (before upload) */
  onSelectFile?: (files: File[]) => void;
  /** Override default upload logic */
  onUpload?: (
    file: File[],
    onProgress: (percent: number) => void
  ) => Promise<any>;
  /** Called per file on success, receives server response */
  onSuccess?: (file: File, response: any) => void;
  /** Called on any upload or network error */
  onError?: (args: { file?: File; error: unknown }) => void;
  /** Label for the dropzone */
  label?: string;
  /** Tooltip text or disabled if undefined */
  tooltip?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** URL to upload files to */
  url: string;
  /** Show upload button */
  showUploadButton?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "muted" | "dark" | "success" | "danger";
}

const FileUpload = ({progress=true,className, size, variant, onUpload,onSuccess,onError, tooltip, label, url, showUploadButton=true, children}:FileUploadProps) => {
    
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadProgressMap, setUploadProgressMap] = useState<{}>({})
const acceptedFileTypes = ["image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ]// for .docx
 


  const onSelectFile = (selectedFiles: File[]) => {
  console.log("Files selected:", selectedFiles)
  if (onUpload) {
    onUpload(selectedFiles, (percent: number) => {
      setUploadProgressMap(prev => ({
        ...prev,
        [selectedFiles[0].name]: percent,
      }));
    });
  }}
 
  const {files, dragActive, handleDrag, handleDrop , clear, handleFileChange} = useDragAndDrop({onSelectFile: onSelectFile})

  const genericUpload = async (file: File) => {
  try{
     const formData = new FormData();
    formData.append("file", file);

  const res = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total; // Avoid division by zero
      console.log(total)
      const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
    setUploadProgressMap(prev => ({
        ...prev,
        [file.name]: percent,
      }));
    },
  });

  console.log("Sending file:", files);
  
  if (res.status !== 200) {
    throw new Error(`Upload failed with status ${res.status}: ${res.data}`);
  }
  const result = res.data;
  return result
  }catch(err){
    throw new Error(`Upload failed for ${file.name}: ${err}`);
  }
 
}
  const handleUpload = async () => {   
    try {
 if (!url) {
     throw new Error("Upload URL is required");
    }
    if (!files || files.length === 0) {
      throw new Error("No files selected for upload");
    }
      if (onUpload){
        await Promise.all(
          files.map(file =>
            onUpload?.([file], (percent: number) => {
              setUploadProgressMap(prev => ({
                ...prev,
                [file.name]: percent,
              }));
            })
          )
        );
      }
   else{const uploadPromises = files.map(async (file) => {
    try {
     const res= await genericUpload(file);
      onSuccess?.(file, res);
    } catch (err) {

      onError?.({file, error: err});
    }
  });

  await Promise.all(uploadPromises);
   }
   await new Promise((resolve) => setTimeout(resolve, 500)); // 👈 add this

      clear() // Clear the internal files state
      setUploadProgressMap({}) // Reset progress
    } catch (err) {
      onError?.({error: err})
      toast("❌ Network error:", err);
    }
  }
  return (
<Card className={cn(fileUploadVariants({variant, size}), className)}>
    <CardHeader>
       {label && (
  <div className="text-lg font-semibold mb-4 text-center">
    {label}
  </div>
)}
    </CardHeader>
    <CardContent className='flex flex-col items-center m-5 space-y-4 hover:bg-gray-100 border border-gray-200 border-dashed rounded-md p-6'>
       <TooltipComponent 
        text="Drag & drop your file here or click to select" >
        <div
         role="button"
  tabIndex={0}
  aria-label="Upload file"
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      inputRef.current?.click()
    }
  }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(dropzoneVariants({dragActive: dragActive}))}
          onClick={() => inputRef.current?.click()}
        > 
  
          <UploadCloudIcon className="mx-auto mb-2 h-16 w-16 text-gray-500" />
  
          <p className="text-gray-500">
            {dragActive ? "Drop the file here..." : "Drag & drop a file here or click to browse"} </p>
        </div>
     </TooltipComponent>
<Input 
 type="file"
ref={inputRef}
multiple
 onChange={handleFileChange}
accept={acceptedFileTypes?.join(", ")|| ""}
className="border border-gray-300 rounded-md p-2 w-full hidden"/> 
 {children && (
    <div className="mt-2 text-sm text-muted-foreground">
      {children}
    </div>
  )}
        <div className="text-gray-500">
            {files && files.length > 0
              ?(<>
            { files?.map((file,i)=>(<div key={i}>
            <p >{file.name}</p>
              {progress && (
              <div  role="status" aria-live="polite"  className="mt-4">
                <Progress value={uploadProgressMap[file.name] || 0}/>
              </div>)}
            </div> 
            ))}    
             </>)
              : <p>No file selected</p>}
          </div>
 
            <CardAction className="flex self-center items-center justify-center mt-4 space-y-2">

 
       <TooltipComponent text="upload Selected file">
{showUploadButton && (<Button
disabled={!files || files.length === 0}
      aria-label="Upload file"
  
  onClick={async () => {
    handleUpload()
   }}
  className="mt-4 cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
>
  Upload File
</Button>)}
</TooltipComponent>
            </CardAction>
          
    </CardContent>
</Card>
  )
}
type TooltipComponentProps = {
  text: string;
  children: ReactNode;
};
const TooltipComponent= ({ text, children }:TooltipComponentProps)=>{
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
export default FileUpload