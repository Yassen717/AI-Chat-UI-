import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateApiKey } from "../utils/validation";

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface StreamingResponse {
  success: boolean;
  content?: string;
  error?: string;
  isComplete?: boolean;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    try {
      const apiKeyValidation = validateApiKey();
      if (!apiKeyValidation.isValid) {
        throw new Error(apiKeyValidation.error);
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  async generateResponse(message: string): Promise<AIResponse> {
    try {
      if (!this.model) {
        return {
          success: false,
          error: "AI service not initialized. Please check your API key configuration."
        };
      }

      const result = await this.model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        content: text
      };
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          return {
            success: false,
            error: "Invalid API key. Please check your configuration."
          };
        }
        if (error.message.includes('QUOTA')) {
          return {
            success: false,
            error: "API quota exceeded. Please try again later."
          };
        }
      }

      return {
        success: false,
        error: "Failed to generate response. Please try again."
      };
    }
  }

  async *generateStreamingResponse(message: string): AsyncGenerator<StreamingResponse> {
    try {
      if (!this.model) {
        yield {
          success: false,
          error: "AI service not initialized. Please check your API key configuration."
        };
        return;
      }

      const result = await this.model.generateContentStream(message);
      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        yield {
          success: true,
          content: chunkText,
          isComplete: false
        };
      }

      yield {
        success: true,
        content: fullText,
        isComplete: true
      };
    } catch (error) {
      console.error('AI Streaming Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          yield {
            success: false,
            error: "Invalid API key. Please check your configuration."
          };
        } else if (error.message.includes('QUOTA')) {
          yield {
            success: false,
            error: "API quota exceeded. Please try again later."
          };
        } else {
          yield {
            success: false,
            error: "Failed to generate response. Please try again."
          };
        }
      }
    }
  }

  // Method to reinitialize if needed
  reinitialize() {
    this.initializeAI();
  }
}

// Export singleton instance
export const aiService = new AIService(); 