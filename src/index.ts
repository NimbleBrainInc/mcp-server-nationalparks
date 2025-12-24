import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Request, Response } from "express";
import dotenv from "dotenv";

import { VERSION } from "./constants.js";
import {
  FindParksSchema,
  GetParkDetailsSchema,
  GetAlertsSchema,
  GetVisitorCentersSchema,
  GetCampgroundsSchema,
  GetEventsSchema,
} from "./schemas.js";
import { findParksHandler } from "./handlers/findParks.js";
import { getParkDetailsHandler } from "./handlers/getParkDetails.js";
import { getAlertsHandler } from "./handlers/getAlerts.js";
import { getVisitorCentersHandler } from "./handlers/getVisitorCenters.js";
import { getCampgroundsHandler } from "./handlers/getCampgrounds.js";
import { getEventsHandler } from "./handlers/getEvents.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

// Load environment variables
dotenv.config();

// Check for API key
if (!process.env.NPS_API_KEY) {
  console.warn(
    "Warning: NPS_API_KEY is not set in environment variables."
  );
  console.warn(
    "Get your API key at: https://www.nps.gov/subjects/developer/get-started.htm"
  );
}

// Create and configure the MCP server
function createServer(): McpServer {
  const server = new McpServer(
    {
      name: "nationalparks-mcp-server",
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools
  server.server.setRequestHandler(
    { method: "tools/list" } as any,
    async () => {
      return {
        tools: [
          {
            name: "findParks",
            description:
              "Search for national parks based on state, name, activities, or other criteria",
            inputSchema: zodToJsonSchema(FindParksSchema),
          },
          {
            name: "getParkDetails",
            description:
              "Get detailed information about a specific national park",
            inputSchema: zodToJsonSchema(GetParkDetailsSchema),
          },
          {
            name: "getAlerts",
            description:
              "Get current alerts for national parks including closures, hazards, and important information",
            inputSchema: zodToJsonSchema(GetAlertsSchema),
          },
          {
            name: "getVisitorCenters",
            description:
              "Get information about visitor centers and their operating hours",
            inputSchema: zodToJsonSchema(GetVisitorCentersSchema),
          },
          {
            name: "getCampgrounds",
            description:
              "Get information about available campgrounds and their amenities",
            inputSchema: zodToJsonSchema(GetCampgroundsSchema),
          },
          {
            name: "getEvents",
            description: "Find upcoming events at parks",
            inputSchema: zodToJsonSchema(GetEventsSchema),
          },
        ],
      };
    }
  );

  // Handle tool executions
  server.server.setRequestHandler(
    { method: "tools/call" } as any,
    async (request: any) => {
      try {
        if (!request.params.arguments) {
          throw new Error("Arguments are required");
        }

        switch (request.params.name) {
          case "findParks": {
            const args = FindParksSchema.parse(request.params.arguments);
            return await findParksHandler(args);
          }

          case "getParkDetails": {
            const args = GetParkDetailsSchema.parse(request.params.arguments);
            return await getParkDetailsHandler(args);
          }

          case "getAlerts": {
            const args = GetAlertsSchema.parse(request.params.arguments);
            return await getAlertsHandler(args);
          }

          case "getVisitorCenters": {
            const args = GetVisitorCentersSchema.parse(request.params.arguments);
            return await getVisitorCentersHandler(args);
          }

          case "getCampgrounds": {
            const args = GetCampgroundsSchema.parse(request.params.arguments);
            return await getCampgroundsHandler(args);
          }

          case "getEvents": {
            const args = GetEventsSchema.parse(request.params.arguments);
            return await getEventsHandler(args);
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: "Validation error",
                    details: error.errors,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        console.error("Error executing tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Server error",
                  message:
                    error instanceof Error ? error.message : "Unknown error",
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }
  );

  return server;
}

// Create Express app with MCP configuration
const app = createMcpExpressApp({ host: "0.0.0.0" });

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

// MCP endpoint - stateless mode
app.post("/mcp", async (req: Request, res: Response) => {
  const server = createServer();
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// Handle GET for SSE (not supported in stateless mode)
app.get("/mcp", async (_req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

// Handle DELETE (not supported in stateless mode)
app.delete("/mcp", async (_req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

const PORT = parseInt(process.env.PORT || "8000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`National Parks MCP Server listening on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit(0);
});
