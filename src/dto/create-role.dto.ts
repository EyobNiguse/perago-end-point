import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
export class CreateRoleDto{
 @IsNotEmpty()
 name:String;
 @IsNotEmpty()
 description:String;
 @IsOptional()
 @IsNotEmpty()
 @IsNumber()
 parent:number;
}