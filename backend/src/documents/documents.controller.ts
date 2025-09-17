import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.documentsService.uploadDocument(file, body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for user' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getUserDocuments(@Req() req: any) {
    return this.documentsService.getUserDocuments(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  async getDocument(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.getDocument(id, req.user.id);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify a document' })
  @ApiResponse({ status: 200, description: 'Document verified successfully' })
  async verifyDocument(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @Req() req: any,
  ) {
    return this.documentsService.verifyDocument(id, body.status, body.notes, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async deleteDocument(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.deleteDocument(id, req.user.id);
  }
}
