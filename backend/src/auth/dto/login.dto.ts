import { IsString } from 'class-validator';
export class LoginDto {
    @IsString()
    usuario!: string;

    @IsString()
    clave!: string;

}