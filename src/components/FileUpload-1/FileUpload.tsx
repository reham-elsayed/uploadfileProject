import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'

const FileUpload = () => {
const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
const file = useRef<HTMLInputElement>(null);
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setSelectedFile(event.target.files[0]);
  } else {
    setSelectedFile(null);
  }}
  const handleUpload = async() => {
    // Handle file upload logic here
    const response = await axios.post('/api/upload', selectedFile, {
      headers: {
        'Content-Type': selectedFile.type,
        'Content-Length': selectedFile.size,
      },
      })
      setSelectedFile(null);
      file.current!.value = ''; // Clear the file input
      alert(`File uploaded successfully: ${response.data.message}, Size: ${response.data.size} bytes`);
  };
  return (
  <Card >
    <CardHeader>
      <CardTitle>File Upload</CardTitle>
    </CardHeader>
    <CardContent>
      <Input 
      onChange={handleFileChange}
      ref={file}
      type="file" />
      <Button 
      onClick={handleUpload}
      className="mt-4" variant="default">
        Upload</Button>
    </CardContent>

  </Card>
  )
}

export default FileUpload