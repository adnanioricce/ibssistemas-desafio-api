import * as bcrypt from 'bcryptjs';
export namespace Tooling {
    // type HashPassword = (password: string) => Promise<string>
    // type VerifyPassword = (password: string,hash: string) => Promise<boolean>
    type HashResponse = { passwordHash: string, salt: string}
    export async function hashPassword(password: string,salt?:string): Promise<HashResponse> {
        if(salt){
            const hashedPassword = await bcrypt.hash(password, salt);
            return {passwordHash: hashedPassword, salt: salt}
        }
        // const saltRounds = 10;
        const generatedSalt = await genSalt()
        const hashedPassword = await bcrypt.hash(password, generatedSalt);
        return { passwordHash: hashedPassword, salt: generatedSalt};
    }
    
    export async function verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
    export async function genSalt() : Promise<string> {
        return bcrypt.genSalt()
    }
}
