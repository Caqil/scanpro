// app/api/pdf/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';
import OpenAI from 'openai';
import { PDFExtractionService } from '@/lib/pdf-extraction-service';
import { ChatSessionsService } from '@/lib/chat-sessions-service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const CHAT_SESSIONS_DIR = join(process.cwd(), 'chatsessions');

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [UPLOAD_DIR, CHAT_SESSIONS_DIR];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

// Process user message with OpenAI
async function processUserMessage(sessionId: string, userMessage: string): Promise<string> {
  const session = await ChatSessionsService.getSession(sessionId);
  
  if (!session) {
    throw new Error('Chat session not found');
  }
  
  // Create system message with PDF content (truncate to avoid token limits)
  const truncatedContent = session.pdfText.substring(0, 100000);
  const systemMessage = `You are a helpful assistant that answers questions about the following PDF document. 
Document content: ${truncatedContent}
  
When answering:
1. Only answer questions related to the document content
2. If the answer isn't in the document, say "I couldn't find that information in the document"
3. Be concise but comprehensive
4. You can refer to specific sections or pages if that information was included in the text extraction
5. Format your responses using Markdown for better readability when appropriate`;

  // Create message history
  const messageHistory = session.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Add current message
  const messages = [
    { role: "system", content: systemMessage },
    ...messageHistory,
    { role: "user", content: userMessage }
  ];
  
  // Call OpenAI API
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Use appropriate model
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 1000,
    });
    
    return response.choices[0].message.content || "I couldn't process your question. Please try again.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I encountered an error processing your question. Please try again later.";
  }
}

// POST handler for uploading a PDF and creating a new chat session
export async function POST(request: NextRequest) {
  try {
    console.log('Starting PDF chat session...');

    // Get API key either from header or query parameter
    const headers = request.headers;
    const url = new URL(request.url);
    const apiKey = headers.get('x-api-key') || url.searchParams.get('api_key');

    // If this is a programmatic API call (not from web UI), validate the API key
    if (apiKey) {
      console.log('Validating API key for chat operation');
      const validation = await validateApiKey(apiKey, 'chat');

      if (!validation.valid) {
        console.error('API key validation failed:', validation.error);
        return NextResponse.json(
          { error: validation.error || 'Invalid API key' },
          { status: 401 }
        );
      }

      // Track usage (non-blocking)
      if (validation.userId) {
        trackApiUsage(validation.userId, 'chat');
      }
    }

    await ensureDirectories();

    try {
      // Check if this is a form data request (file upload) or JSON request (chat message)
      const contentType = request.headers.get('content-type') || '';

      // Handle file upload with FormData
      if (contentType.includes('multipart/form-data')) {
        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          return NextResponse.json(
            { error: 'No PDF file provided' },
            { status: 400 }
          );
        }

        // Verify it's a PDF
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          return NextResponse.json(
            { error: 'Only PDF files can be processed' },
            { status: 400 }
          );
        }

        // Create unique session ID and file paths
        const sessionId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${sessionId}-chat.pdf`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Extract text from the PDF using the service
        let pdfText;
        try {
          pdfText = await PDFExtractionService.extractText(inputPath);
        } catch (error) {
          console.error('PDF text extraction error:', error);
          pdfText = `[Failed to extract text from this PDF]\nThe document might be encrypted, scanned without OCR, or contain only images.`;
        }

        // Store the chat session
        await ChatSessionsService.createSession(sessionId, inputPath, pdfText);

        // Create welcome message
        const welcomeMessage = "I've processed your PDF document. Ask me any questions about its contents, and I'll do my best to answer based on the information in the document.";
        await ChatSessionsService.addMessage(sessionId, welcomeMessage, 'assistant');

        return NextResponse.json({
          success: true,
          message: welcomeMessage,
          sessionId,
          originalName: file.name,
        });
      } 
      // Handle chat message with JSON
      else if (contentType.includes('application/json')) {
        const body = await request.json();
        const { sessionId, message } = body;
        
        if (!sessionId || !message) {
          return NextResponse.json(
            { error: 'Session ID and message are required' },
            { status: 400 }
          );
        }
        
        // Check if session exists
        const session = await ChatSessionsService.getSession(sessionId);
        if (!session) {
          return NextResponse.json(
            { error: 'Chat session not found or expired' },
            { status: 404 }
          );
        }
        
        // Add user message to the session
        await ChatSessionsService.addMessage(sessionId, message, 'user');
        
        // Process the message with OpenAI
        const response = await processUserMessage(sessionId, message);
        
        // Update the chat session with the AI response
        await ChatSessionsService.addMessage(sessionId, response, 'assistant');
        
        return NextResponse.json({
          success: true,
          message: response
        });
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type. Expected multipart/form-data for file uploads or application/json for messages.' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json(
        { error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('PDF chat session error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred during PDF processing',
        success: false
      },
      { status: 500 }
    );
  }
}

// GET handler for retrieving chat history
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session ID provided' },
        { status: 400 }
      );
    }
    
    const session = await ChatSessionsService.getSession(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }
    
    // Return only messages, not the full PDF text
    return NextResponse.json({
      success: true,
      sessionId,
      messages: session.messages,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Error retrieving chat session:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred retrieving the chat session',
        success: false
      },
      { status: 500 }
    );
  }
}