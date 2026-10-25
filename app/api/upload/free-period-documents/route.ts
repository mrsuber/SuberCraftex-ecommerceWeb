import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";
import { MB, saveUpload, UploadError } from "@/lib/uploads";

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

    if (files.length > 10) {
      return NextResponse.json({ error: "At most 10 files at a time" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }
      // Private: only the apprentice who asked and admins can open these
      const saved = await saveUpload(file, {
        folder: ["free-periods"],
        allowed: ["image", "pdf", "docx"],
        maxBytes: 5 * MB,
        private: true,
      });
      uploadedUrls.push(saved.url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
