import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Equal, Repository, TreeRepository } from 'typeorm';
import { UpdateRoleDto } from 'src/dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: TreeRepository<Role>,
    ) { }

    async getRoleByID(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOne({ where: { id: id }, relations: ["children"] });
        if (!role) {
            throw new NotFoundException(`Role with ${id} not found`);
        }
        return role;
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const { name, description, parent } = createRoleDto;
        await this.isUnique(name);
        const role = new Role();
        role.name = name;
        role.description = description;
        if (parent) {
            const parentRole: Role = await this.getRoleByID(parent);
            role.parent = parentRole;
        }
        await role.save();
        return role;
    }

    async isUnique(name: String): Promise<boolean> {
        const role = await this.rolesRepository.findOne({ where: { name: Equal(name.toUpperCase()) } })
        if (role) {
            throw new BadRequestException(`Role Name ${name} is Already taken`);
        }
        return true;
    }

    async deleteRole(id: number): Promise<void> {
        const parent = await this.getRoleByID(id);

        if (parent.children.length == 0) {
            const result = await this.rolesRepository.delete({ id: id });
            if (result.affected == 0) {
                throw new NotFoundException(`Role with id ${id} does not exist`);
            }

        } else {
            throw new BadRequestException(`Role with ${id} has child Roes in the hirarcy you must delete them first`);
        }
    }
    async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
        const { name, description, parent } = updateRoleDto;
        const role = await this.getRoleByID(id);
        const existing   = await this.getRoleByName(name);
        if(existing){
            throw new BadRequestException(`a role with name ${name} alkready exists`);
        }
        if (name) {
            role.name = name;
        }
        if (description) {
            role.description = description;
        }
        if (parent) {
            const parentRole = await this.getRoleByID(parent);
            role.parent = parentRole;
        }
        await role.save();
        return role;
    }
    async getCompleteHirarcy(): Promise<Role[]> {

        let Roles = await this.rolesRepository.findTrees();
        return Roles;
    }
    async getSpecificHirarcy(id: number): Promise<Role> {
        const parent = await this.getRoleByID(id);
        const children = await this.rolesRepository.findDescendantsTree(parent);
        return children;
    }
    async getRoleByName(name: string): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({ name: Equal(name) });
        return role;
    }

}
