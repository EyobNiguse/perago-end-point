import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { Role } from 'src/entities/role.entity';
import { UpdateRoleDto } from 'src/dto/update-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }
    @Post()
    @UsePipes(ValidationPipe)
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return await this.rolesService.createRole(createRoleDto);
    }
    @Get("/role/:ID")
    async getRole(@Param("ID", ParseIntPipe) id: number): Promise<Role> {
        return this.rolesService.getRoleByID(id);
    }
    @Delete("/role/:ID")
    async deleteRole(@Param("ID", ParseIntPipe) id: number):Promise<void> {
        return this.rolesService.deleteRole(id);
    }

    @Patch("/role/:ID")
    @UsePipes(ValidationPipe)
    updateRole(
        @Param("ID", ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto):Promise<Role> {
        return this.rolesService.updateRole(id, updateRoleDto);
    }
    @Get("/hirarcy")
    getCompleteHirarcy():Promise<Role[]>{
        return this.rolesService.getCompleteHirarcy();
    }
    @Get("/hirarcy/:ID")
    getSpecificHirarcy(
        @Param("ID", ParseIntPipe) id: number
    ):Promise<Role>{
        return this.rolesService.getSpecificHirarcy(id);
    }

}
