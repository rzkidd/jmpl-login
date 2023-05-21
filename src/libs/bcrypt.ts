import * as bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
    const hash = await bcrypt.hash(plainPassword, 10);
    return hash;
}

export const comparePasswords = async (plainPassword: string, hash: string) => {
    const result = await bcrypt.compare(plainPassword, hash);
    return result;
}