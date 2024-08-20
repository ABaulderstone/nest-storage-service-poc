import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.userService.findOne(+id);
    if (!foundUser) {
      throw new NotFoundException('Could not find user with id ' + id);
    }
    return foundUser;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = this.userService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('Could not find user with id ' + id);
    }
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isDeleted = await this.userService.remove(+id);
    if (!isDeleted) {
      throw new NotFoundException('Could not find user with id ' + id);
    }
  }
}
