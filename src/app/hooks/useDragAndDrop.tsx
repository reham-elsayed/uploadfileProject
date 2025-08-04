import React, {  useCallback, useState } from 'react'
import { toast } from 'sonner';
type useDragAndDropProps = {
  selectedFiles?: File[] | null;
  setSelectedFiles?: (files: File[]| null)=>void;
  onSelectFile?: (files: File[]) => void;
}
const useDragAndDrop = ({selectedFiles, setSelectedFiles, onSelectFile}:useDragAndDropProps )=> {
     const [dragActive, setDragActive] = useState(false)
  const [internalFiles, setInternalFiles] = useState<File[]>([])
const acceptedFileTypes = ["image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ]// for .docx
 
  const files = selectedFiles !== undefined ? selectedFiles : internalFiles;
    const setFiles = setSelectedFiles !== undefined ? setSelectedFiles : setInternalFiles;

          const handleDrag =useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
              setDragActive(true)
            } else if (e.type === "dragleave") {
              setDragActive(false)
            }
          },[])
   const verifyandSetFiles = (files: File[]) => {
     
 for (let file of files) {
    const fileType = file.type
    const isValidType = acceptedFileTypes?.some((type)=> fileType.includes(type))
    if (!isValidType){
      console.error(`Invalid file type: ${fileType}`)
     toast.error(`Invalid file type: ${fileType}`)
     return
    }
  }
    let existing: File[] = [];
    if (selectedFiles !== undefined) {
      existing = selectedFiles || [];
    } else {
      existing = internalFiles || [];
    }
    // filter out duplicates by name+size
    const merged: File[] = [
      ...existing,
      ...files.filter(
        (f: File) => !existing.some((e: File) => e.name === f.name && e.size === f.size)
      ),
    ];
    onSelectFile?.(merged); // notify parent / side effect
    setFiles(merged);}     
const handleDrop = useCallback(
            (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
           if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
   verifyandSetFiles(Array.from(e.dataTransfer.files));
    }
  },[setFiles,onSelectFile]);

  
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const filesInput = e.target.files
   if (!filesInput || filesInput.length === 0)return

    const fileArray = Array.from(filesInput)
    verifyandSetFiles(fileArray);

    //check file types
 }
  
  return {
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
  files,
  clear : () => {
      setFiles([]);
  }
}
}
export default useDragAndDrop