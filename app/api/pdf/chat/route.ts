// app/api/pdf/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { trackApiUsage, validateApiKey } from '@/lib/validate-key';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: "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" // process.env.OPENAI_API_KEY,
});

// Define directories
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

// Extract text from PDF
async function extractTextFromPdf(pdfPath: string): Promise<string> {
  try {
    // Try to use an existing PDF text extraction library or command
    // For this example, we'll simulate it by using a simple text extraction
    // In a real implementation, you would use a proper PDF text extraction library
    
    // Example using pdftotext (if available on the server)
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execPromise = promisify(exec);
      
      const tempOutputPath = `${pdfPath}.txt`;
      await execPromise(`pdftotext "${pdfPath}" "${tempOutputPath}"`);
      
      if (existsSync(tempOutputPath)) {
        const text = await readFile(tempOutputPath, 'utf-8');
        await unlink(tempOutputPath).catch(() => {});
        return text;
      }
    } catch (error) {
      console.error('pdftotext extraction failed:', error);
    }
    
    // Fallback to using pdf-lib for basic information
    const { PDFDocument } = require('pdf-lib');
    const pdfBytes = await readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    
    return `This PDF has ${pageCount} pages. For better text extraction, please ensure pdftotext or another PDF extraction tool is installed on the server.`;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return 'Failed to extract text from PDF. Please check the file format and try again.';
  }
}

// Store chat session
async function storeChatSession(sessionId: string, pdfPath: string, pdfText: string): Promise<void> {
  const sessionFile = join(CHAT_SESSIONS_DIR, `${sessionId}.json`);
  const sessionData = {
    id: sessionId,
    pdfPath,
    createdAt: new Date().toISOString(),
    pdfText,
    messages: []
  };
  
  await writeFile(sessionFile, JSON.stringify(sessionData, null, 2));
}

// Load chat session
async function loadChatSession(sessionId: string): Promise<any> {
  const sessionFile = join(CHAT_SESSIONS_DIR, `${sessionId}.json`);
  
  if (!existsSync(sessionFile)) {
    return null;
  }
  
  const sessionData = await readFile(sessionFile, 'utf-8');
  return JSON.parse(sessionData);
}

// Update chat session with new message
async function updateChatSession(sessionId: string, userMessage: string, aiResponse: string): Promise<void> {
  const session = await loadChatSession(sessionId);
  
  if (!session) {
    throw new Error('Chat session not found');
  }
  
  session.messages.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  });
  
  session.messages.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date().toISOString()
  });
  
  const sessionFile = join(CHAT_SESSIONS_DIR, `${sessionId}.json`);
  await writeFile(sessionFile, JSON.stringify(session, null, 2));
}

// Process user message with OpenAI
async function processUserMessage(sessionId: string, userMessage: string): Promise<string> {
  const session = await loadChatSession(sessionId);
  
  if (!session) {
    throw new Error('Chat session not found');
  }
  
  // Create system message with PDF content
  const systemMessage = `You are a helpful assistant that answers questions about the following PDF document. 
Document content: ${session.pdfText.substring(0, 100000)}
  
When answering:
1. Only answer questions related to the document content
2. If the answer isn't in the document, say "I couldn't find that information in the document"
3. Be concise but comprehensive
4. You can refer to specific sections or pages if that information was included in the text extraction`;

  // Create message history
  const messageHistory = session.messages.map((msg: any) => ({
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

    // Extract text from the PDF
    const pdfText = await extractTextFromPdf(inputPath);

    // Store the chat session
    await storeChatSession(sessionId, inputPath, pdfText);

    return NextResponse.json({
      success: true,
      message: 'PDF uploaded and ready for chat',
      sessionId,
      originalName: file.name,
    });
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
    
    const session = await loadChatSession(sessionId);
    
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

// Second API endpoint to handle chat messages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;
    
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID and message are required' },
        { status: 400 }
      );
    }
    
    // Process the message with OpenAI
    const response = await processUserMessage(sessionId, message);
    
    // Update the chat session with the new messages
    await updateChatSession(sessionId, message, response);
    
    return NextResponse.json({
      success: true,
      message: response
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred processing your message',
        success: false
      },
      { status: 500 }
    );
  }
}