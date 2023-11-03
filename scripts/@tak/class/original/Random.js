import { NumberRange } from "../../../@tak/extender";

export class Random extends NumberRange {
    constructor(value1 = 0, value2 = 0) {
        super(value1, value2);
            const range = this.shallowCopy();
            this.xorshift = new Xorshift();
            this.xorshift.range = range;
    }
    generate() {
        let { min, max } = this;
        let digit = 1;
        let loopCount = 0;
        while (loopCount < 20 && (!Number.isInteger(min) || !Number.isInteger(max))) {
            min *= 10;
            max *= 10;
            digit *= 10;
            loopCount += 1;
        }
        return Math.floor(Math.random() * (max + 1 - min) + min) / digit;
    }
    static shuffle(array) {
        return array.slice(0).sort(() => Math.random() - Math.random());
    }
    static chance(chance = 0.5) {
        const number = Math.random() + chance;
        if (number >= 1) return true;
        else return false;
    }
}

export class Xorshift {
    constructor(seed = 0) {
        this.seed = seed;
    }
    #x = 123456789;
    #y = 362436069;
    #z = 521288629;
    rand() {
        let t = this.#x ^ (this.#x << 11);
        this.#x = this.#y;
        this.#y = this.#z;
        this.#z = this.seed;

        return this.seed = (this.seed ^ (this.seed >>> 19)) ^ (t ^ (t >>> 8));
    }
    restrict(range = new NumberRange()) {
        if (!this.range) this.range = range;
        let { min, max } = this.range;
        let digit = 1;

        let loopCount = 0;
        while (loopCount < 20 && (!Number.isInteger(min) || !Number.isInteger(max))) {
            min *= 10;
            max *= 10;
            digit *= 10;
            loopCount += 1;
        }

        const random = Math.abs(this.rand());
        return (random % (max + 1 - min) + min) / digit;
    }
}
