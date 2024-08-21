import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ServiceValidationError } from '../shared/exceptions/errors/ServiceValidation.error';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createProjectDto);
    console.log(file);
    try {
      return await this.projectService.create(createProjectDto, file);
    } catch (e) {
      if (e instanceof ServiceValidationError) {
        throw new BadRequestException(e);
      }
      console.log(e);
      throw new InternalServerErrorException('Oops something went wrong');
    }
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
