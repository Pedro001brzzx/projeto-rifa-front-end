/**
 * Funções de máscara para inputs
 */

export const maskCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14);
};

export const maskPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
};

export const maskCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};

export const maskDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 10);
};
