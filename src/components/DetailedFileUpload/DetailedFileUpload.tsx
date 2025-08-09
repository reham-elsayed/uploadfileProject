import React from 'react'
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Input } from '../ui/input';
import {  Delete, UploadCloudIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function DetailedFileUpload({files, onValueChange,className, ...props}){
    const {getRootProps, getInputProps, isDragActive}= useDropzone({
        onDrop: (acceptedFiles) => {
            onValueChange([...files,...acceptedFiles])}, ...props} as DropzoneOptions);
  return (
    <div {...getRootProps()} className={cn("rounded-lg border border-dashed p-4 transition-colors w-full",className)}>
        
        <UploadCloudIcon className="mx-auto mb-2 h-16 w-16 text-gray-500" />
    <Input {...getInputProps()} />
        <p className="text-center">
            {isDragActive ? "Drop the files here..." : "Drag & drop some files here, or click to select files"}
        </p>

        {files && files.length > 0 && (
            <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="truncate text-black text-sm">{file.name}</span>
                        <Button
                        variant={"destructive"}
                         type="button" onClick={(e) =>{
                              e.stopPropagation()
                             onValueChange(files.filter((f: File) => f !== file))}}>
                           <Delete className="h-4 w-4" />
                        </Button>
                        </div>))}
                        </div>)}
    </div>
  )
}
 

