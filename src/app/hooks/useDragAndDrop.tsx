import React, {  useCallback, useState } from 'react'
type useDragAndDropProps = {
  selectedFiles?: File[] | null;
  setSelectedFiles?: (files: File[]| null)=>void;
  onSelectFile?: (files: File[]) => void;
}
const useDragAndDrop = ({selectedFiles, setSelectedFiles, onSelectFile}:useDragAndDropProps )=> {
     const [dragActive, setDragActive] = useState(false)
  const [internalFiles, setInternalFiles] = useState<File[]>([])

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
        
          const handleDrop = useCallback(
            (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
           if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);

    let existing: File[] = [];
    if (selectedFiles !== undefined) {
      existing = selectedFiles || [];
    } else {
      existing = internalFiles || [];
    }
    // filter out duplicates by name+size
    const merged: File[] = [
      ...existing,
      ...dropped.filter(
        (f: File) => !existing.some((e: File) => e.name === f.name && e.size === f.size)
      ),
    ];
    onSelectFile?.(merged); // notify parent / side effect
    setFiles(merged);
    }
  },[setFiles,onSelectFile]);
  
  return {
    dragActive,
    handleDrag,
    handleDrop,
  files,
  clear : () => {
      setFiles([]);
  }
}
}
export default useDragAndDrop