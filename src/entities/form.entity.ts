import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SubmitFormDTO } from '../users/dto/submitForm.dto';

@Entity('form')
export class FormEntity {
	constructor(obj: SubmitFormDTO, user_id: number) {
		if (obj) {
			const { form, attorney_id } = obj;
			this.user_id = user_id;
			this.attorney_id = attorney_id;

			this.resident = form.resident;
			this.marriage_certificate = form.marriage_certificate;
			this.copy_public_deed = form.copy_public_deed;
			this.children_agreement = form.children_agreement;
			this.economic_needs_agreement = form.economic_needs_agreement;
			this.profits = form.profits;
			this.assets_and_debts = form.assets_and_debts;
			this.emplazamiento = form.emplazamiento;
			this.divorceType();

			if (!this.d1 && !this.d2 && !this.d3) {
				// 6 = Missing information
				this.form_status = 6;
			} else {
				this.form_status = 1;
			}
		}
	}

	@PrimaryColumn() id: number;

	@Column() user_id: number;

	@Column() attorney_id: number;

	@Column() added_on: Date;

	@Column() resident: boolean;

	@Column() marriage_certificate: boolean;

	@Column() copy_public_deed: boolean;

	@Column() children_agreement: boolean;

	@Column() economic_needs_agreement: boolean;

	@Column() profits: boolean;

	@Column() assets_and_debts: boolean;

	@Column() emplazamiento: boolean;

	@Column() form_status: number;

	@Column() d1: boolean;

	@Column() d2: boolean;

	@Column() d3: boolean;

	private divorceType(): void {
		if (!this.resident || !this.marriage_certificate || !this.copy_public_deed) {
			return;
		}

		if (this.children_agreement) {
			if (this.assets_and_debts) {
				this.d2 = true;
			}
			if (this.economic_needs_agreement && this.profits) {
				this.d1 = true;
			}
		}

		if (this.emplazamiento) {
			this.d3 = true;
		}
	}
}
