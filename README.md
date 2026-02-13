# National Parks MCP Server

[![mpak](https://img.shields.io/badge/mpak-registry-blue)](https://mpak.dev/packages/@nimblebraininc/nationalparks?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)
[![NimbleBrain](https://img.shields.io/badge/NimbleBrain-nimblebrain.ai-purple)](https://nimblebrain.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)
[![Discord](https://img.shields.io/badge/Discord-community-5865F2)](https://nimblebrain.ai/discord?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for the National Park Service API. Search parks, get details, check alerts, find campgrounds, browse events, and locate visitor centers across all U.S. national parks.

**[View on mpak registry](https://mpak.dev/packages/@nimblebraininc/nationalparks?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)** | **Built by [NimbleBrain](https://nimblebrain.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)**

## Install

Install with [mpak](https://mpak.dev?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks):

```bash
mpak install @nimblebraininc/nationalparks
```

### Configuration

This server requires a free API key from the [National Park Service Developer Portal](https://www.nps.gov/subjects/developer/get-started.htm).

```bash
mpak config set @nimblebraininc/nationalparks api_key YOUR_NPS_API_KEY
```

### Claude Code

```bash
claude mcp add nationalparks -- mpak run @nimblebraininc/nationalparks
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nationalparks": {
      "command": "mpak",
      "args": ["run", "@nimblebraininc/nationalparks"]
    }
  }
}
```

See the [mpak registry page](https://mpak.dev/packages/@nimblebraininc/nationalparks?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks) for full install options.

## Tools

### findParks

Search for national parks based on state, name, activities, or other criteria.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stateCode` | `string` | No | State code, e.g. `"CA"` or `"CA,OR,WA"` |
| `q` | `string` | No | Search term for name or description |
| `limit` | `number` | No | Max results (default: 10, max: 50) |
| `start` | `number` | No | Start position for pagination |
| `activities` | `string` | No | Filter by activities, e.g. `"hiking,camping"` |

### getParkDetails

Get detailed information about a specific national park including descriptions, hours, fees, contacts, and activities.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parkCode` | `string` | Yes | Park code, e.g. `"yose"` for Yosemite |

### getAlerts

Get current alerts for national parks including closures, hazards, and important information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parkCode` | `string` | No | Park code(s), e.g. `"yose"` or `"yose,grca"` |
| `limit` | `number` | No | Max results (default: 10, max: 50) |
| `start` | `number` | No | Start position for pagination |
| `q` | `string` | No | Search term for title or description |

### getVisitorCenters

Get information about visitor centers and their operating hours.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parkCode` | `string` | No | Park code(s), e.g. `"yose"` or `"yose,grca"` |
| `limit` | `number` | No | Max results (default: 10, max: 50) |
| `start` | `number` | No | Start position for pagination |
| `q` | `string` | No | Search term for name or description |

### getCampgrounds

Get information about available campgrounds and their amenities.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parkCode` | `string` | No | Park code(s), e.g. `"yose"` or `"yose,grca"` |
| `limit` | `number` | No | Max results (default: 10, max: 50) |
| `start` | `number` | No | Start position for pagination |
| `q` | `string` | No | Search term for name or description |

### getEvents

Find upcoming events at parks.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parkCode` | `string` | No | Park code(s), e.g. `"yose"` or `"yose,grca"` |
| `limit` | `number` | No | Max results (default: 10, max: 50) |
| `start` | `number` | No | Start position for pagination |
| `dateStart` | `string` | No | Start date filter (`YYYY-MM-DD`) |
| `dateEnd` | `string` | No | End date filter (`YYYY-MM-DD`) |
| `q` | `string` | No | Search term for title or description |

## Example Prompts

```
Tell me about national parks in Colorado.
```

```
What's the entrance fee for Yellowstone National Park?
```

```
Are there any closures or alerts at Yosemite right now?
```

```
Which national parks in Utah have good hiking trails?
```

## Park Codes

| Park | Code | Park | Code |
|------|------|------|------|
| Yosemite | `yose` | Great Smoky Mountains | `grsm` |
| Grand Canyon | `grca` | Acadia | `acad` |
| Yellowstone | `yell` | Olympic | `olym` |
| Zion | `zion` | Rocky Mountain | `romo` |
| Joshua Tree | `jotr` | Sequoia & Kings Canyon | `seki` |

For a complete list, visit the [NPS website](https://www.nps.gov/findapark/index.htm).

## Quick Start

### Local Development

```bash
git clone https://github.com/NimbleBrainInc/mcp-server-nationalparks.git
cd mcp-server-nationalparks

# Install dependencies
npm install

# Build
npm run build

# Run (stdio mode for Claude Desktop / mpak)
node build/index.js --stdio

# Run (HTTP mode for cloud deployment)
node build/index.js
```

The server supports HTTP transport with:
- Health check: `GET /health`
- MCP endpoint: `POST /mcp`

### Development

```bash
# Build TypeScript
make build

# Build MCPB bundle locally
make bundle

# Bump version across all files
make bump VERSION=0.3.0
```

## About

National Parks MCP Server is published on the [mpak registry](https://mpak.dev?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks) and built by [NimbleBrain](https://nimblebrain.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks). mpak is an open registry for [Model Context Protocol](https://modelcontextprotocol.io) servers.

- [mpak registry](https://mpak.dev?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)
- [NimbleBrain](https://nimblebrain.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)
- [MCP specification](https://modelcontextprotocol.io)
- [Discord community](https://nimblebrain.ai/discord?utm_source=github&utm_medium=readme&utm_campaign=mcp-nationalparks)

## License

MIT
