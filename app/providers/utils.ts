

// not efficient but sufficient and clear
export function num2str(num: number, nDecimals: number) {
    let floorNum: number = Math.floor(num),
        frac: number = num - floorNum,
        pow10: number = Math.pow(10, nDecimals),
        wholeFrac: number = Math.round(frac * pow10),
        fracLen: number = wholeFrac.toString().length,
        leadingZeros: string = Array(nDecimals - fracLen + 1).join('0');
    return floorNum.toString() + '.' + leadingZeros + wholeFrac.toString();
}

const addZero = (n: number) => { return (n < 10) ? '0' : ''; }

// not efficient but sufficient and clear
export function msec2time(msec: number) {
    let totalSec: number = Math.floor(msec / 1000),
        totalMin: number = Math.floor(totalSec / 60),
        hr: number = Math.floor(totalMin / 60),
        min: number = totalMin - hr * 60,
        sec: number = totalSec - totalMin * 60,
        secFrac: number = Math.floor((msec - totalSec * 1000) / 10);
    return [addZero(hr), hr, ':', addZero(min), min, ':',
        addZero(sec), sec, '.', secFrac, addZero(secFrac)].join('');
}

/*
export function copyObject(object1: any, object2: any) {
    for (var key in object1) {
        if (object1.hasOwnProperty(key)) {
            object2[key] = object1[key];
        }
    }
}
*/