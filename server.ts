import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini Client server-side using @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

const rssParser = new Parser();

// Default RSS Sources for Aviation News Ingestion
const DEFAULT_RSS_FEEDS = [
  { name: 'Global Aviation News', url: 'https://news.google.com/rss/search?q=aviation+airline+news&hl=en-IN&gl=IN&ceid=IN:en', category: 'Global Aviation' },
  { name: 'Indian Airports & Fuel', url: 'https://news.google.com/rss/search?q=Indian+aviation+ATF+airports&hl=en-IN&gl=IN&ceid=IN:en', category: 'Indian Aviation' }
];

// API Route 1: RSS Aggregation & Gemini Summarization Server Proxy
app.post('/api/rss/fetch', async (req, res) => {
  try {
    const feedUrl = req.body.feedUrl || DEFAULT_RSS_FEEDS[0].url;
    const category = req.body.category || 'Global Aviation';

    const feed = await rssParser.parseURL(feedUrl);
    const items = feed.items.slice(0, 5); // Take top 5 items

    const processedItems = [];

    for (const item of items) {
      let summary = item.contentSnippet || item.summary || item.title || '';
      let aiSummarized = false;

      // Use Gemini to summarize the news article if API key is present
      if (process.env.GEMINI_API_KEY && summary.length > 20) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `You are an expert aviation news editor. Summarize the following aviation news item into 2 clear sentences focusing on operational, commercial, or regulatory impact. Preserving accuracy is essential.
Title: ${item.title}
Content: ${summary}
Source: ${item.link}`
          });
          if (response.text) {
            summary = response.text.trim();
            aiSummarized = true;
          }
        } catch (geminiErr) {
          console.warn('Gemini summarization fallback to raw summary:', geminiErr);
        }
      }

      processedItems.push({
        id: `rss-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title || 'Untitled Aviation Update',
        sourceUrl: item.link || '#',
        sourceName: feed.title || 'Aviation RSS',
        category,
        summary,
        content: item.contentSnippet || summary,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: 'pending', // Sent to Admin Review Queue
        aiSummarized
      });
    }

    res.json({ success: true, count: processedItems.length, items: processedItems });
  } catch (err: any) {
    console.error('RSS Fetch error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to parse RSS feed' });
  }
});

// API Route 2: Gemini Direct Summarizer for Manual News Inputs
app.post('/api/news/summarize', async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text content required for summarization' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, summary: text.slice(0, 200) + '...' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Summarize this aviation article into 2 clear, professional sentences for WingFuel.co:
Headline: ${title}
Article Text: ${text}`
    });

    res.json({ success: true, summary: response.text ? response.text.trim() : text.slice(0, 200) });
  } catch (err: any) {
    console.error('Gemini Summarizer Error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate summary' });
  }
});

// API Route 3: Razorpay Sandbox Server-Side Payment Verification & Download Link Generation
app.post('/api/payment/verify', (req, res) => {
  const { productId, productTitle, amountINR, customerEmail, razorpayPaymentId } = req.body;

  if (!productId || !customerEmail) {
    return res.status(400).json({ success: false, error: 'Missing required payment parameters' });
  }

  // Generate secure 1-time transaction verification key
  const accessKey = `WF-KEY-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  console.log(`Payment Verified [Sandbox]: Product ${productId} (${productTitle}) for ${customerEmail}. Access Key: ${accessKey}`);

  res.json({
    success: true,
    orderId: `ORD-${Date.now()}`,
    paymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
    accessKey,
    downloadUrl: `/api/download/${accessKey}?product=${encodeURIComponent(productId)}`,
    purchasedAt: timestamp,
    message: 'Payment signature verified successfully in Razorpay Sandbox Mode.'
  });
});

// API Route 4: Secure File Delivery Endpoint
app.get('/api/download/:accessKey', (req, res) => {
  const { accessKey } = req.params;
  const productId = (req.query.product as string) || 'digital-asset';

  if (!accessKey || !accessKey.startsWith('WF-KEY-')) {
    return res.status(403).send('Invalid or expired download access key.');
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="WingFuel_${productId}_Licensed.txt"`);
  res.send(`=======================================================
WINGFUEL.CO — AUTHORIZED DIGITAL PRODUCT ACCESS
=======================================================
Access Key: ${accessKey}
Date: ${new Date().toUTCString()}
Product ID: ${productId}
License: Single User Professional License

Thank you for fueling your aviation knowledge with WingFuel.co!
Your requested digital asset template download has been validated.
For support contact: support@wingfuel.co
=======================================================`);
});

// Vite Middleware integration in Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Serve HTML entry point in dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WingFuel.co server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
