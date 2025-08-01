import React, {  useEffect, useState } from 'react'

const useDragAndDrop = ({selectedFiles, setSelectedFiles}) => {
     const [dragActive, setDragActive] = useState(false)
  
          const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
              setDragActive(true)
            } else if (e.type === "dragleave") {
              setDragActive(false)
            }
          }
        
          const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0]
              setSelectedFiles([...selectedFiles || [], file])
            }
          }
  
  return {
    dragActive,
    handleDrag,
    handleDrop}
  
  
}

export default useDragAndDrop