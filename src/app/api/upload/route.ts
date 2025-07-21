import { NextRequest } from "next/server"
import { Buffer } from "node:buffer" // ✅ Required in edge/modern runtime

export async function POST(req: NextRequest) {
  const reader = req.body?.getReader()
  if (!reader) {
    return new Response("No body found", { status: 400 })
  }

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      received += value.length
    }
  }

  const fileBuffer = Buffer.concat(chunks)
  const preview = fileBuffer.toString("utf8", 0, 100) // Safe for text

  return new Response(
    JSON.stringify({
        message: "File uploaded successfully",
        size: received,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
