
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

interface FileUploadProps {
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
  url: string;
}

const FileUpload = ({progress=true, onUpload,onSuccess,onError, tooltip, label, url}:FileUploadProps) => {
    
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({})

const acceptedFileTypes = ["image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ]// for .docx
const { dragActive, handleDrag, handleDrop } = useDragAndDrop({ selectedFiles, setSelectedFiles })
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const files = e.target.files
   if (!files && files.length === 0)return

    const fileArray = Array.from(files)
    setSelectedFiles(fileArray)
    console.log("Files selected:", fileArray)
    if (inputRef.current) {
      inputRef.current.value = "" // Clear the input after selection
    }
  for (let file of fileArray) {
    const fileType = file.type
    const isValidType = acceptedFileTypes?.some((type)=> fileType.includes(type))
    if (!isValidType){
      console.error(`Invalid file type: ${fileType}`)
      alert(`Invalid file type: ${fileType}`)
      continue;
    }
  }}
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

  console.log("Sending file:", selectedFiles);
  
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
    if (!selectedFiles || selectedFiles.length === 0) {
      throw new Error("No files selected for upload");
    }
      if (onUpload){
        await Promise.all(
          selectedFiles.map(file =>
            onUpload?.([file], (percent: number) => {
              setUploadProgressMap(prev => ({
                ...prev,
                [file.name]: percent,
              }));
            })
          )
        );
      }
   else{const uploadPromises = selectedFiles.map(async (file) => {
    try {
     const res= await genericUpload(file);
      onSuccess?.(file, res);
    } catch (err) {

      onError?.({file, error: err});
    }
  });

  await Promise.all(uploadPromises);
   }
  
      
     setSelectedFiles(null) // Clear the selected file after upload
      setUploadProgressMap(null) // Reset progress
    } catch (err) {
      onError?.({error: err})
      toast("❌ Network error:", err);
    
    }
  
  }
  return (
<Card className='max-w-md mx-auto my-10 w-5xl'>
    <CardHeader>
        <CardTitle>Upload File Here</CardTitle>
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
          className={cn(
            " text-center transition-all cursor-pointer ",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          )}
          onClick={() => inputRef.current?.click()}
        > 
  
          <UploadCloudIcon className="mx-auto mb-2 h-16 w-16 text-gray-500" />
  
          <p className="text-gray-500">
            {dragActive ? "Drop the file here..." : "Drag & drop a file here or click to browse"} </p>
        </div>
     </TooltipComponent>
<Input  type="file"
ref={inputRef}
multiple
 onChange={handleFileChange}
            accept={acceptedFileTypes?.join(", ")|| ""}
        className="border border-gray-300 rounded-md p-2 w-full hidden"/> 
        <div className="text-gray-500">
            {selectedFiles && selectedFiles.length > 0
              ?(<>
            { selectedFiles.map((file,i)=>(<>
            <p key={i}>{file.name}</p>
              {progress && (
              <div className="mt-4">
                <Progress value={uploadProgressMap[file.name] || 0}/>
              </div>)}
            </> 
            ))}    
             </>)
              : <p>No file selected</p>}
          </div>
 
            <CardAction className="flex self-center items-center justify-center mt-4 space-y-2">

 
       <TooltipComponent text="upload Selected file">
<Button
disabled={!selectedFiles || selectedFiles.length === 0}
      aria-label="Upload file"
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      inputRef.current?.click()
    }
  }}
  onClick={async () => {
    handleUpload()
   }}
  className="mt-4 cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
>
  Upload File
</Button>
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