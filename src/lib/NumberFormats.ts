export const CRCFormatter = (number: number) => {
    const options: Intl.NumberFormatOptions = { style: "currency", currency: "CRC" };
    const formatter = new Intl.NumberFormat("es-CR", options);
    return formatter.format(number);
};