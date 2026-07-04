import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

// POST /api/upload/free-period-documents - Upload documents for free period requests
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    ];

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, PDF, DOCX` },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size: 5MB` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "uploads", "free-periods");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer());
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Store public URL
      const publicUrl = `/uploads/free-periods/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    console.log(`✅ Uploaded ${uploadedUrls.length} file(s) for free period request`);

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
