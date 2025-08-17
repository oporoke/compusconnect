
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAnalyticsQuery } from '@/ai/flows/ai-analytics-query';

export default function AIQueryPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!query) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await getAnalyticsQuery(query);
      setResult(response.result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "AI Query Failed",
        description: "Could not process the request. This is a mock interface, so all queries return a predefined result.",
      });
      // Fallback to mock data on error for demo purposes
      const mockResponse = await getAnalyticsQuery(query);
      setResult(mockResponse.result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">AI Analytics Query</h1>
        <p className="text-muted-foreground">Use natural language to ask questions about your school's data. (Mock Interface)</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> Ask a question</CardTitle>
          <CardDescription>Examples: "Who are the top 5 performing students in the last exam?", "Show me a summary of staff leave utilization."</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Show me a summary of admissions..."
              disabled={isLoading}
            />
            <Button onClick={handleQuery} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
        </CardContent>
        {result && (
            <CardFooter>
                <div className="w-full">
                    <h3 className="font-semibold mb-2">Result:</h3>
                    <pre className="p-4 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap font-code">
                        {result}
                    </pre>
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
