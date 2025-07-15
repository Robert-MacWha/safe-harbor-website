export function PrettyCurrency(tvl: number) {
    function stripTrailingZeros(number: string | undefined) {
        if (number === undefined) {
            return "";
        }
        return number.toString().replace(/\.0+$/, "");
    }

    if (tvl >= 1e9) {
        return stripTrailingZeros((tvl / 1e9).toFixed(1)) + "B";
    } else if (tvl >= 1e6) {
        return stripTrailingZeros((tvl / 1e6).toFixed(1)) + "M";
    } else if (tvl >= 1e3) {
        return stripTrailingZeros((tvl / 1e3).toFixed(1)) + "K";
    } else {
        return tvl.toString();
    }
}