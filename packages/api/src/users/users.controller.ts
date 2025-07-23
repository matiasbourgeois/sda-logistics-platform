import {
  Controller,
  Get,
  Post,
  Body,
  Patch, 
  Param, 
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id') 
  update(
    @Param('id') id: string, 
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto, // 
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') // Define la ruta como DELETE /users/un-id-especifico
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}