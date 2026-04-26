
import { supabase } from "@/integrations/supabase/client";
import * as pdfjs from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Use a reliable CDN-independent worker path.
// For pdfjs-dist v3, we point at a well-known major.minor that is always on cdnjs.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const uploadDocument = async (userId: string, file: File): Promise<string> => {
  if (!userId) {
    throw new Error("User ID is required for document uploads");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

  console.log("Starting file upload to documents bucket");

  // 1. Upload the file to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (storageError) {
    console.error("Storage error during upload:", storageError);
    throw new Error(storageError.message || "Failed to upload file to storage");
  }

  console.log("Upload successful, generating signed URL");

  // 2. Create a signed URL (works for PRIVATE buckets; valid for 1 hour)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('documents')
    .createSignedUrl(fileName, 3600);

  if (signedError || !signedData?.signedUrl) {
    console.error("Failed to create signed URL:", signedError);
    throw new Error("File uploaded but could not generate a download link. Please try again.");
  }

  return signedData.signedUrl;
};

// Extract text from a document at the given URL
export const extractTextFromDocument = async (fileUrl: string, fileType: string): Promise<string> => {
  console.log(`Extracting text from document: type=${fileType}`);

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch document (${response.status} ${response.statusText}). The link may have expired — please re-upload the file.`);
    }

    let extractedText = '';

    if (fileType === 'txt') {
      extractedText = await response.text();
    } else if (fileType === 'pdf') {
      console.log("Processing PDF file");
      const arrayBuffer = await response.arrayBuffer();
      extractedText = await extractTextFromPdf(arrayBuffer);
    } else if (fileType === 'docx') {
      console.log("Processing DOCX file");
      const arrayBuffer = await response.arrayBuffer();
      extractedText = await extractTextFromDocx(arrayBuffer);
    } else {
      return `File type '${fileType}' is not supported. Please upload a .txt, .pdf, or .docx file.`;
    }

    console.log(`Extracted ${extractedText.length} characters`);
    return extractedText.trim() || "No text content could be extracted from this document.";
  } catch (error: any) {
    console.error("Error extracting text from document:", error);
    return `Error extracting text: ${error.message}`;
  }
};

// ── PDF extraction via PDF.js ────────────────────────────────────────────────
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log("Loading PDF document with PDF.js");
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded with ${pdf.numPages} pages`);

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText
      .replace(/\s{2,}/g, ' ')
      .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n\n')
      .trim();
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    return "Error extracting PDF content. The file may be corrupted, image-based, or password-protected.";
  }
}

// ── DOCX extraction via mammoth ──────────────────────────────────────────────
async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log("Converting DOCX to HTML with mammoth.js");
    const result = await mammoth.convertToHtml({ arrayBuffer });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result.value;
    let plainText = tempDiv.textContent || '';

    return plainText
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (error: any) {
    console.error("Error extracting text from DOCX:", error);
    return "Error extracting DOCX content. The file may be corrupted or in an unsupported format.";
  }
}
