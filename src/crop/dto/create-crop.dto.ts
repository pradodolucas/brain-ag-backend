import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @IsInt()
  @IsNotEmpty({ message: 'O ano é obrigatório.' })
  year: number;

  @IsString()
  @IsNotEmpty({ message: 'O cultivo é obrigatório.' })
  food: string;

  @IsInt()
  @IsNotEmpty({ message: 'O farm_id é obrigatório.' })
  farmId: number;
}
