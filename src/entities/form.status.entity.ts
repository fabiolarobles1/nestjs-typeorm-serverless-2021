import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('form_status')
export class FormStatusEntity {
	@PrimaryGeneratedColumn() id: number;

	@Column() status: string;
}
