"use server"

import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { exec } from "child_process"
import { promisify } from "util"
import { copyFile } from "fs/promises"

const execPromise = promisify(exec)

const UPLOAD_DIR = join(process.cwd(), "uploads")
const EDITED_DIR = join(process.cwd(), "public", "edited")

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
    if (!existsSync(EDITED_DIR)) {
        await mkdir(EDITED_DIR, { recursive: true })
    }
}

export async function uploadPdfForEditing(formData: FormData) {
    try {
        await ensureDirectories()

        const file = formData.get("pdf") as File

        if (!file) {
            throw new Error("No PDF file provided")
        }

        // Create file paths
        const uniqueId = uuidv4()
        const inputPath = join(UPLOAD_DIR, `${uniqueId}.pdf`)

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(inputPath, buffer)

        return {
            success: true,
            message: "PDF uploaded successfully",
            filePath: inputPath,
            uniqueId,
        }
    } catch (error) {
        console.error("Upload error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred during upload",
        }
    }
}

export async function openPdfInLibreOffice(filePath: string) {
    try {
        // Command to open the PDF in LibreOffice Draw
        const command = `libreoffice --draw "${filePath}"`

        console.log(`Executing: ${command}`)

        // Execute the command
        const { stdout, stderr } = await execPromise(command)

        console.log("LibreOffice stdout:", stdout)
        if (stderr) console.error("LibreOffice stderr:", stderr)

        return {
            success: true,
            message: "PDF opened in LibreOffice Draw",
        }
    } catch (error) {
        console.error("LibreOffice error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred opening LibreOffice",
        }
    }
}

export async function savePdfAfterEditing(uniqueId: string) {
    try {
        // In a real implementation, we would need to handle the edited file
        // This is a simplified version that assumes the file has been edited and saved
        const inputPath = join(UPLOAD_DIR, `${uniqueId}.pdf`)
        const outputPath = join(EDITED_DIR, `${uniqueId}_edited.pdf`)

        // In a real implementation, we would need to find the edited file
        // For now, we'll just copy the original as a placeholder
        await copyFile(inputPath, outputPath)

        const fileUrl = `/edited/${uniqueId}_edited.pdf`

        return {
            success: true,
            message: "PDF saved successfully",
            fileUrl,
        }
    } catch (error) {
        console.error("Save error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred saving the PDF",
        }
    }
}

