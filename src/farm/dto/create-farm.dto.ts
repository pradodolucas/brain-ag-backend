import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da fazenda é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  city: string;

  @IsNumber()
  @IsPositive({ message: 'A área total deve ser um número positivo.' })
  totalArea: number;

  @IsNumber()
  @Min(0, { message: 'A área cultivável não pode ser negativa.' })
  cultivableArea: number;

  @IsNumber()
  @Min(0, { message: 'A área de vegetação não pode ser negativa.' })
  vegetationArea: number;

  @IsInt()
  @IsPositive({ message: 'O ID do produtor deve ser um número inteiro positivo.' })
  producerId: number;
}
