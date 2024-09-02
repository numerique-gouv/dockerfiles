function convertBase(str, fromBase, toBase) {
    const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

    const add = (x, y, base) => {
        let z = [];
        const n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            const xi = i < x.length ? x[i] : 0;
            const yi = i < y.length ? y[i] : 0;
            const zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    const multiplyByNumber = (num, x, base) => {
        if (num < 0) return null;
        if (num == 0) return [];

        let result = [];
        let power = x;
        while (true) {
            num & 1 && (result = add(result, power, base));
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }

    const parseToDigitsArray = (str, base) => {
        const digits = str.split('');
        let arr = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            const n = DIGITS.indexOf(digits[i])
            if (n == -1) return null;
            arr.push(n);
        }
        return arr;
    }

    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
        out += DIGITS[outArray[i]];

    return out;
}

function base36ofRandCofUUIDv4(uuid) {
    hex1 = uuid.replace(/-/gi, '').slice(-16, -8);
    hex2 = uuid.replace(/-/gi, '').slice(-8);
    console.log(hex1);
    console.log(hex2);
    console.log(convertBase(hex1, 16, 36));
    console.log(convertBase(hex2, 16, 36));
    return convertBase(hex1, 16, 36) + convertBase(hex2, 16, 36)
}



try {
    const profile = await keycloak.loadUserProfile();
    console.log('Retrieved user profile:', profile);
} catch (error) {
    console.error('Failed to load user profile:', error);
}



exports = base36ofRandCofUUIDv4(profile.uuid)
