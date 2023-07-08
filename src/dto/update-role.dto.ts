import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
export class UpdateRoleDto {
@IsOptional()
@IsNotEmpty()
name: string;
@IsOptional()
@IsNotEmpty()
description:string;
@IsOptional()
@IsNotEmpty()
@IsNumber()
parent:number;
}