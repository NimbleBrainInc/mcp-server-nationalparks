import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  mockPark,
  mockAlert,
  mockVisitorCenter,
  mockCampground,
  mockEvent,
  npsResponse,
} from "./fixtures.js";

// Mock the NPS API client before any handler imports
vi.mock("../src/utils/npsApiClient.js", () => ({
  npsApiClient: {
    getParks: vi.fn(),
    getParkByCode: vi.fn(),
    getAlerts: vi.fn(),
    getAlertsByParkCode: vi.fn(),
    getVisitorCenters: vi.fn(),
    getCampgrounds: vi.fn(),
    getEvents: vi.fn(),
  },
}));

// Import mocked module (must be after vi.mock)
import { npsApiClient } from "../src/utils/npsApiClient.js";

// Import createServer logic (registers tools on an McpServer instance).
// We replicate the tool registration from index.ts to avoid importing the
// full HTTP/stdio setup which has side effects (dotenv, express, etc.).
import {
  FindParksSchema,
  GetParkDetailsSchema,
  GetAlertsSchema,
  GetVisitorCentersSchema,
  GetCampgroundsSchema,
  GetEventsSchema,
} from "../src/schemas.js";
import { findParksHandler } from "../src/handlers/findParks.js";
import { getParkDetailsHandler } from "../src/handlers/getParkDetails.js";
import { getAlertsHandler } from "../src/handlers/getAlerts.js";
import { getVisitorCentersHandler } from "../src/handlers/getVisitorCenters.js";
import { getCampgroundsHandler } from "../src/handlers/getCampgrounds.js";
import { getEventsHandler } from "../src/handlers/getEvents.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

function createTestServer(): McpServer {
  const server = new McpServer(
    { name: "nationalparks-test", version: "0.0.0" },
    { capabilities: { tools: {} } },
  );

  server.registerTool("findParks", { description: "Search for national parks", inputSchema: FindParksSchema }, async (args): Promise<CallToolResult> => {
    const parsed = FindParksSchema.parse(args);
    return await findParksHandler(parsed);
  });

  server.registerTool("getParkDetails", { description: "Get park details", inputSchema: GetParkDetailsSchema }, async (args): Promise<CallToolResult> => {
    const parsed = GetParkDetailsSchema.parse(args);
    return await getParkDetailsHandler(parsed);
  });

  server.registerTool("getAlerts", { description: "Get alerts", inputSchema: GetAlertsSchema }, async (args): Promise<CallToolResult> => {
    const parsed = GetAlertsSchema.parse(args);
    return await getAlertsHandler(parsed);
  });

  server.registerTool("getVisitorCenters", { description: "Get visitor centers", inputSchema: GetVisitorCentersSchema }, async (args): Promise<CallToolResult> => {
    const parsed = GetVisitorCentersSchema.parse(args);
    return await getVisitorCentersHandler(parsed);
  });

  server.registerTool("getCampgrounds", { description: "Get campgrounds", inputSchema: GetCampgroundsSchema }, async (args): Promise<CallToolResult> => {
    const parsed = GetCampgroundsSchema.parse(args);
    return await getCampgroundsHandler(parsed);
  });

  server.registerTool("getEvents", { description: "Get events", inputSchema: GetEventsSchema }, async (args): Promise<CallToolResult> => {
    const parsed = GetEventsSchema.parse(args);
    return await getEventsHandler(parsed);
  });

  return server;
}

describe("nationalparks MCP server", () => {
  let client: Client;
  let server: McpServer;

  beforeAll(async () => {
    server = createTestServer();
    client = new Client({ name: "test-client", version: "0.0.0" });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  // ----- Tool registration -----

  it("lists all 6 tools with correct names and schemas", async () => {
    const { tools } = await client.listTools();

    expect(tools).toHaveLength(6);

    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "findParks",
      "getAlerts",
      "getCampgrounds",
      "getEvents",
      "getParkDetails",
      "getVisitorCenters",
    ]);

    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeTruthy();
    }
  });

  // ----- findParks -----

  it("findParks returns park data", async () => {
    vi.mocked(npsApiClient.getParks).mockResolvedValueOnce(npsResponse([mockPark]));

    const result = await client.callTool({ name: "findParks", arguments: { stateCode: "CA" } });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.parks).toHaveLength(1);
    expect(parsed.parks[0].name).toBe("Yosemite National Park");
    expect(parsed.parks[0].code).toBe("yose");
  });

  // ----- getParkDetails -----

  it("getParkDetails returns detailed park info", async () => {
    vi.mocked(npsApiClient.getParkByCode).mockResolvedValueOnce(npsResponse([mockPark]));

    const result = await client.callTool({ name: "getParkDetails", arguments: { parkCode: "yose" } });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.name).toBe("Yosemite National Park");
    expect(parsed.code).toBe("yose");
    expect(parsed.designation).toBe("National Park");
  });

  // ----- getAlerts -----

  it("getAlerts returns alert data", async () => {
    vi.mocked(npsApiClient.getAlerts).mockResolvedValueOnce(npsResponse([mockAlert]));

    const result = await client.callTool({ name: "getAlerts", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.alerts).toHaveLength(1);
    expect(parsed.alerts[0].title).toBe("Road Closure");
    expect(parsed.alerts[0].parkCode).toBe("yose");
  });

  // ----- getVisitorCenters -----

  it("getVisitorCenters returns visitor center data", async () => {
    vi.mocked(npsApiClient.getVisitorCenters).mockResolvedValueOnce(
      npsResponse([mockVisitorCenter]),
    );

    const result = await client.callTool({ name: "getVisitorCenters", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.visitorCenters).toHaveLength(1);
    expect(parsed.visitorCenters[0].name).toBe("Yosemite Valley Visitor Center");
    expect(parsed.visitorCenters[0].parkCode).toBe("yose");
  });

  // ----- getCampgrounds -----

  it("getCampgrounds returns campground data", async () => {
    vi.mocked(npsApiClient.getCampgrounds).mockResolvedValueOnce(
      npsResponse([mockCampground]),
    );

    const result = await client.callTool({ name: "getCampgrounds", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.campgrounds).toHaveLength(1);
    expect(parsed.campgrounds[0].name).toBe("Upper Pines Campground");
    expect(parsed.campgrounds[0].parkCode).toBe("yose");
  });

  // ----- getEvents -----

  it("getEvents returns event data", async () => {
    vi.mocked(npsApiClient.getEvents).mockResolvedValueOnce(npsResponse([mockEvent]));

    const result = await client.callTool({ name: "getEvents", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0].title).toBe("Ranger-Led Hike");
    expect(parsed.events[0].parkCode).toBe("yose");
  });

  // ----- Error cases -----

  it("returns error for unknown tool", async () => {
    const result = await client.callTool({ name: "nonExistentTool", arguments: {} });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toContain("nonExistentTool");
  });

  it("returns error when getParkDetails is called without parkCode", async () => {
    const result = await client.callTool({ name: "getParkDetails", arguments: {} });
    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toContain("Required");
  });
});
