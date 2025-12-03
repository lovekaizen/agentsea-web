import Link from 'next/link';
import PageContainer from '../../components/PageContainer';
import {
  PageHeader,
  Section,
  CodeBlock,
  AlertBox,
  Divider,
} from '../../components/Section';

export default function NestJSPage() {
  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="NestJS Integration"
        titleGradient="warm"
        description="Seamlessly integrate AgentSea with NestJS using decorators, modules, and dependency injection for building enterprise-grade agentic applications."
      />

      <div className="prose max-w-none">
        <h2>Installation</h2>
        <p>Install both core and NestJS packages:</p>

        <CodeBlock language="bash">
          {`# Install packages
pnpm add @lov3kaizen/agentsea-core @lov3kaizen/agentsea-nestjs

# Install NestJS dependencies
pnpm add @nestjs/common @nestjs/core reflect-metadata rxjs`}
        </CodeBlock>

        <h2>Module Setup</h2>
        <p>Configure the AgentSea module in your NestJS application:</p>

        <CodeBlock language="typescript">
          {`// app.module.ts
import { Module } from '@nestjs/common';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';
import { AnthropicProvider } from '@lov3kaizen/agentsea-core';

@Module({
  imports: [
    AgenticModule.forRoot({
      provider: new AnthropicProvider(process.env.ANTHROPIC_API_KEY),
      defaultConfig: {
        model: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        temperature: 0.7,
        maxTokens: 2048,
      },
    }),
  ],
})
export class AppModule {}`}
        </CodeBlock>

        <h3>Async Configuration</h3>
        <p>Use async configuration for dynamic setup:</p>

        <CodeBlock language="typescript">
          {`// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgenticModule } from '@lov3kaizen/agentsea-nestjs';
import { AnthropicProvider } from '@lov3kaizen/agentsea-core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AgenticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        provider: new AnthropicProvider(config.get('ANTHROPIC_API_KEY')),
        defaultConfig: {
          model: config.get('AGENT_MODEL', 'claude-sonnet-4-20250514'),
          provider: 'anthropic',
          temperature: Number(config.get('AGENT_TEMPERATURE', 0.7)),
        },
      }),
    }),
  ],
})
export class AppModule {}`}
        </CodeBlock>

        <h2>Agent Service</h2>
        <p>Create an agent service using dependency injection:</p>

        <CodeBlock language="typescript">
          {`// chat.service.ts
import { Injectable } from '@nestjs/common';
import { Agent, ToolRegistry, BufferMemory } from '@lov3kaizen/agentsea-core';
import { InjectAgent } from '@lov3kaizen/agentsea-nestjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectAgent() private readonly agent: Agent,
    private readonly toolRegistry: ToolRegistry,
    private readonly memory: BufferMemory,
  ) {}

  async chat(userId: string, message: string) {
    const response = await this.agent.execute(message, {
      conversationId: userId,
      sessionData: { userId },
      history: await this.memory.load(userId),
    });

    await this.memory.save(userId, [
      ...await this.memory.load(userId),
      { role: 'user', content: message },
      { role: 'assistant', content: response.content },
    ]);

    return response;
  }
}`}
        </CodeBlock>

        <h2>Agent Controller</h2>
        <p>Create REST endpoints for your agents:</p>

        <CodeBlock language="typescript">
          {`// chat.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':userId')
  async chat(
    @Param('userId') userId: string,
    @Body('message') message: string,
  ) {
    const response = await this.chatService.chat(userId, message);

    return {
      content: response.content,
      toolCalls: response.toolCalls,
      metadata: response.metadata,
    };
  }

  @Post(':userId/stream')
  async stream(
    @Param('userId') userId: string,
    @Body('message') message: string,
  ) {
    // Implement streaming response
    // Use SSE or WebSocket for streaming
  }
}`}
        </CodeBlock>

        <h2>Custom Decorators</h2>
        <p>AgentSea provides decorators for common patterns:</p>

        <h3>@Agent Decorator</h3>

        <CodeBlock language="typescript">
          {`import { Injectable } from '@nestjs/common';
import { AgentDecorator } from '@lov3kaizen/agentsea-nestjs';

@Injectable()
export class SupportService {
  @AgentDecorator({
    name: 'support-agent',
    systemPrompt: 'You are a helpful customer support agent.',
  })
  async handleSupport(message: string, userId: string) {
    // Method will be automatically wrapped with agent execution
    return message;
  }
}`}
        </CodeBlock>

        <h3>@Tool Decorator</h3>

        <CodeBlock language="typescript">
          {`import { Injectable } from '@nestjs/common';
import { ToolDecorator } from '@lov3kaizen/agentsea-nestjs';
import { z } from 'zod';

@Injectable()
export class DatabaseService {
  @ToolDecorator({
    name: 'query_users',
    description: 'Query users from the database',
    inputSchema: z.object({
      limit: z.number().default(10),
    }),
  })
  async queryUsers(input: { limit: number }) {
    const users = await this.db.users.findMany({
      take: input.limit,
    });

    return {
      success: true,
      data: users,
      count: users.length,
    };
  }
}`}
        </CodeBlock>

        <h2>Guards and Interceptors</h2>

        <h3>Rate Limiting</h3>

        <CodeBlock language="typescript">
          {`import { Controller, Post, UseGuards } from '@nestjs/common';
import { RateLimitGuard, RateLimit } from '@lov3kaizen/agentsea-nestjs';

@Controller('chat')
@UseGuards(RateLimitGuard)
export class ChatController {
  @Post()
  @RateLimit({ maxRequests: 10, windowMs: 60000 }) // 10 requests per minute
  async chat(@Body('message') message: string) {
    return this.chatService.chat(message);
  }
}`}
        </CodeBlock>

        <h3>Logging Interceptor</h3>

        <CodeBlock language="typescript">
          {`// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@lov3kaizen/agentsea-core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.info('Request completed', {
          path: request.url,
          method: request.method,
          duration,
        });
      }),
    );
  }
}

// app.module.ts
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}`}
        </CodeBlock>

        <h2>WebSocket Integration</h2>
        <p>Stream agent responses using WebSockets:</p>

        <CodeBlock language="typescript">
          {`// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Agent } from '@lov3kaizen/agentsea-core';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly agent: Agent) {}

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: { userId: string; message: string },
  ) {
    const stream = await this.agent.stream(data.message, {
      conversationId: data.userId,
      sessionData: { userId: data.userId },
      history: [],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content') {
        this.server.emit(\`chat:\${data.userId}\`, {
          type: 'content',
          content: chunk.content,
        });
      } else if (chunk.type === 'tool_call') {
        this.server.emit(\`chat:\${data.userId}\`, {
          type: 'tool_call',
          toolName: chunk.toolName,
        });
      }
    }

    this.server.emit(\`chat:\${data.userId}\`, { type: 'done' });
  }
}`}
        </CodeBlock>

        <h2>Testing</h2>

        <h3>Unit Tests</h3>

        <CodeBlock language="typescript">
          {`// chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { Agent, ToolRegistry, BufferMemory } from '@lov3kaizen/agentsea-core';

describe('ChatService', () => {
  let service: ChatService;
  let mockAgent: jest.Mocked<Agent>;

  beforeEach(async () => {
    mockAgent = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: Agent,
          useValue: mockAgent,
        },
        {
          provide: ToolRegistry,
          useValue: new ToolRegistry(),
        },
        {
          provide: BufferMemory,
          useValue: new BufferMemory(50),
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should handle chat messages', async () => {
    mockAgent.execute.mockResolvedValue({
      content: 'Hello!',
      toolCalls: [],
      metadata: {},
    });

    const result = await service.chat('user-123', 'Hi');

    expect(result.content).toBe('Hello!');
    expect(mockAgent.execute).toHaveBeenCalled();
  });
});`}
        </CodeBlock>

        <h3>E2E Tests</h3>

        <CodeBlock language="typescript">
          {`// chat.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ChatController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/chat/:userId (POST)', () => {
    return request(app.getHttpServer())
      .post('/chat/user-123')
      .send({ message: 'Hello' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('content');
        expect(res.body).toHaveProperty('metadata');
      });
  });
});`}
        </CodeBlock>

        <h2>Production Deployment</h2>

        <h3>Health Checks</h3>

        <CodeBlock language="typescript">
          {`// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MCPRegistry } from '@lov3kaizen/agentsea-core';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mcpRegistry: MCPRegistry,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        const clients = this.mcpRegistry.getClients();
        const connected = clients.every(c => c.isConnected());

        return {
          mcp: {
            status: connected ? 'up' : 'down',
            servers: clients.length,
          },
        };
      },
    ]);
  }
}`}
        </CodeBlock>

        <h3>Graceful Shutdown</h3>

        <CodeBlock language="typescript">
          {`// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MCPRegistry } from '@lov3kaizen/agentsea-core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Cleanup on shutdown
  app.get(MCPRegistry).on('beforeShutdown', async () => {
    const mcpRegistry = app.get(MCPRegistry);
    await mcpRegistry.disconnectAll();
  });

  await app.listen(3000);
}

bootstrap();`}
        </CodeBlock>

        <h2>Best Practices</h2>

        <ul>
          <li>
            <strong>Dependency Injection</strong>: Use NestJS DI for all
            AgentSea components
          </li>
          <li>
            <strong>Configuration</strong>: Use ConfigModule for
            environment-specific settings
          </li>
          <li>
            <strong>Error Handling</strong>: Implement global exception filters
          </li>
          <li>
            <strong>Validation</strong>: Use class-validator for DTO validation
          </li>
          <li>
            <strong>Guards</strong>: Implement authentication and authorization
            guards
          </li>
          <li>
            <strong>Testing</strong>: Write comprehensive unit and e2e tests
          </li>
          <li>
            <strong>Monitoring</strong>: Integrate with monitoring services
          </li>
          <li>
            <strong>Documentation</strong>: Use Swagger/OpenAPI for API
            documentation
          </li>
        </ul>

        <h2>Next Steps</h2>
        <ul>
          <li>
            <Link href="/docs/agents">Learn about Agents</Link>
          </li>
          <li>
            <Link href="/docs/observability">Add Monitoring</Link>
          </li>
          <li>
            <Link href="/examples">View NestJS Examples</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}
