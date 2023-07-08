import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
@Entity()
@Tree('closure-table')
export class Role extends BaseEntity{
@PrimaryGeneratedColumn()
id:number;
@Column()
name:String;
@Column()
description:String;
@TreeParent()
parent: Role
@TreeChildren()
children: Role[]
}