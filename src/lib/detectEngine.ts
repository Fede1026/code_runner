export function detectEngine(code: string): "web" | "python" {
  // Safe heuristic for web detection based on typical content
  const codeLower = code.toLowerCase();
  const isWebCode = codeLower.includes("<html>") || 
                    code.includes("import React") ||
                    code.includes("document.getElementById") ||
                    codeLower.includes("<!doctype html>") ||
                    codeLower.includes("<div") ||
                    codeLower.includes("<body");
  
  if (isWebCode || code.trim().startsWith("<")) {
    return "web";
  }
  
  return "python";
}
