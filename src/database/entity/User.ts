import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 256,
		unique: true
	})
	email: string;

	@Column({
		type: 'varchar',
		length: 256,
		nullable: true
	})
	passwordHash: string;

	@Column({
		type: 'varchar',
		length: 128,
		nullable: true
	})
	salt: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	verifyToken: string;

	@Column({
		type: 'bool',
		nullable: true,
		default: false
	})
	isVerified: boolean;

	@Column({
		type: 'int',
		nullable: true,
		default: () => 'EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)',
	})
	updated: number;

	@Column({
		type: 'int',
		default: () => 'EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)',
	})
	created: number;

}
