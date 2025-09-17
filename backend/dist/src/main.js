"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            "https://tvs-scholarship-a1fi.vercel.app",
            process.env.FRONTEND_URL || 'http://localhost:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
            'Pragma'
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TVS Scholarship Ecosystem API')
        .setDescription(`
      Comprehensive API for the TVS Scholarship Management System.
      
      ## Features
      - Student Management
      - Scholarship Management
      - Application Processing
      - Document Management
      - Payment Processing
      - Analytics & Reporting
      
      ## Authentication
      All endpoints require JWT authentication except for public endpoints.
      Include the JWT token in the Authorization header: \`Bearer <token>\`
      
      ## Response Format
      All API responses follow a consistent format:
      \`\`\`json
      {
        "success": boolean,
        "message": string,
        "data": any,
        "errors"?: string[]
      }
      \`\`\`
      
      ## Error Handling
      - 400: Bad Request - Validation errors
      - 401: Unauthorized - Invalid or missing token
      - 403: Forbidden - Insufficient permissions
      - 404: Not Found - Resource not found
      - 409: Conflict - Resource already exists
      - 500: Internal Server Error - Server error
      
      ## Rate Limiting
      API requests are rate limited to prevent abuse:
      - 100 requests per minute per IP
      - 1000 requests per hour per authenticated user
      
      ## Pagination
      List endpoints support pagination:
      - \`page\`: Page number (default: 1)
      - \`limit\`: Items per page (default: 10, max: 100)
      
      ## Filtering & Search
      Most list endpoints support:
      - \`search\`: Text search across relevant fields
      - Status-based filtering
      - Date range filtering
      - Category-based filtering
    `)
        .setVersion('1.0.0')
        .setContact('TVS Scholarship Team', 'https://tvsscholarship.com', 'support@tvsscholarship.com')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User authentication and authorization')
        .addTag('Students', 'Student profile management')
        .addTag('Scholarships', 'Scholarship program management')
        .addTag('Applications', 'Scholarship application processing')
        .addTag('Documents', 'Document upload and verification')
        .addTag('Payments', 'Payment processing and disbursal')
        .addTag('Notifications', 'Notification management')
        .addTag('Analytics', 'Analytics and reporting')
        .addTag('Admin', 'Administrative functions')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            showRequestHeaders: true,
            showCommonExtensions: true,
            docExpansion: 'none',
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
        },
        customSiteTitle: 'TVS Scholarship API Documentation',
        customfavIcon: '/favicon.ico',
        customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #1a365d; }
    `,
    });
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
        });
    });
    app.getHttpAdapter().get('/api/status', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'TVS Scholarship API is running',
            data: {
                status: 'operational',
                version: '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                endpoints: {
                    docs: '/api/docs',
                    health: '/health',
                    students: '/api/students',
                    scholarships: '/api/scholarships',
                    applications: '/api/applications',
                    auth: '/api/auth',
                },
            },
        });
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 TVS Scholarship API is running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
    console.log(`📊 API Status: http://localhost:${port}/api/status`);
}
bootstrap().catch((error) => {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map