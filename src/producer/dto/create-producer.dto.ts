import { IsNotEmpty, IsString } from "class-validator";

export class CreateProducerDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	taxId: string;
}
