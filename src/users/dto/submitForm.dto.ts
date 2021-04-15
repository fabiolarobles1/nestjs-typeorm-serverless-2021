class Form {
	resident: boolean;

	marriage_certificate: boolean;

	copy_public_deed: boolean;

	children_agreement: boolean;

	economic_needs_agreement: boolean;

	profits: boolean;

	assets_and_debts: boolean;

	emplazamiento: boolean;
}

export class SubmitFormDTO {
	form: Form;
	attorney_id: number;
}
