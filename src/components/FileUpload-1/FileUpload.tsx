import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button  } from '../ui/button'
import axios from 'axios'
import { UploadCloudIcon } from 'lucide-react'

//npm install @radix-ui/react-slot
//npx shadcn@latest add input
//npx shadcn@latest add card

const FileUploadYoutube = () => {
return (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>Upload Video</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Input
        type="file"
        className="w-full"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            // Handle file upload logic here
            console.log('Selected file:', file)
          }
        }}
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {}}     
      >
        <UploadCloudIcon className="mr-2" />
        Upload file
      </Button>
    </CardContent>
  </Card>
)
}

export default FileUploadYoutube