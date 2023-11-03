import { system } from "@minecraft/server";

export class Time {
    constructor(time) {
        if (typeof time !== "number") time = Time.getUTCTime(time);
        const dateJST = new Date(time + (new Date().getTimezoneOffset() + ( 9 * 60 ) * 60 * 1000));
        this.year = dateJST.getFullYear();
        this.month = dateJST.getMonth() + 1;
        this.day = Time.getDayOfLanguage(dateJST.getDay());
        this.date = dateJST.getDate();
        this.hour = dateJST.getHours();
        this.minute = dateJST.getMinutes();
        this.second = dateJST.getSeconds();
        this.milliSecond = dateJST.getMilliseconds();
    }
    toClock() {
        const left = (this.hour < 10) ? "0"+this.hour.toString() : this.hour.toString();
        const middle = (this.minute < 10) ? "0"+this.minute.toString() : this.minute.toString();
        const right = (this.second < 10) ? "0"+this.second.toString() : this.second.toString();
        return left+":"+middle+":"+right+"."+this.milliSecond.toString();
    }
    toString() {
        return this.year.toString()+"年"+this.month.toString()+"月"+this.date.toString()+"日"+"("+Time.getDayOfLanguage(this.day, "japanese")+") "+this.hour.toString()+"時"+this.minute.toString()+"分"+this.second.toString()+"秒"+this.milliSecond.toString();
    }
    past(time, unit = "milliSecond") {
        const newTime = this;
        const units = Object.getOwnPropertyNames(newTime);
        if (units.includes(unit)) {
            newTime[unit] -= time;
            return newTime;
        }
        else return undefined;
    }
    future(time, unit = "milliSecond") {
        const newTime = this;
        const units = Object.getOwnPropertyNames(newTime);
        if (units.includes(unit)) {
            newTime[unit] += time;
            return newTime;
        }
        else return undefined;
    }
    reserve(callbackFn) {
        const tickDelay = (Time.getUTCTime(this) - Date.now()) / 1000 * 20;
        if (tickDelay < 0 || tickDelay > Number.MAX_SAFE_INTEGER) return false;
        const reservedTime = Time.getNow();
        system.runTimeout(() => callbackFn({ reservedTime }), tickDelay);
        return true;
    }
    floor(unit) {
        const result = this;
        const magnifications = Time.#unitConvertMagnifications[unit];
        if (magnifications === undefined) throw new Error("無効な時間単位です");
        for (const unitName in magnifications) {
            if(magnifications[unitName] >= 1) {
                switch (unitName) {
                    case "month":
                    case "week":
                        if (unitName === "week") break; //<Time>.weekの実装が未定のため応急処置
                        result[unitName] = 1;
                        break;
                    case "day":
                        result.date = 1;
                        break;
                    default:
                        result[unitName] = 0;
                        break;
                }
            }
        }
        result.day = Time.getDayOfLanguage(new Date(Time.getUTCTime(result)).getDay());
        return result;
    }
    static getDayOfLanguage(day, language = "english") {
        if (typeof day === "number") {
            const dayData = this.#days[day];
            if (dayData) return dayData[language];
            else throw new Error("無効な曜日番号です: "+String(day));
        }
        else if (typeof day === "string") {
            const dayData = this.#days.find(langs => langs.english === day);
            if (dayData) return dayData[language];
            else throw new Error("無効な曜日文字列です: "+day);
        }
        else throw new Error("曜日の型が無効です: "+typeof day);
    }
    static getUTCTime(time) {
        const dateUTC = new Date(time.year ?? 1970, (time.month - 1) ?? 0, time.date ?? 1, (time.hour - 9) ?? 0, time.minute ?? 0, time.second ?? 0, time.milliSecond ?? 0);
        return dateUTC.getTime();
    }
    static convertUnit(time, unitBefore, unitAfter) {
        const magnificationList = this.#unitConvertMagnifications[unitBefore];
        if (!magnificationList) throw new Error("無効な単位です: "+unitBefore);
        if (!magnificationList[unitAfter]) throw new Error("無効な単位です: "+unitAfter);
        return time * magnificationList[unitAfter];
    }
    static getDifference(timeA, timeB) {
        const UnixTimeDifference = Math.abs(this.getUTCTime(timeA) - this.getUTCTime(timeB));
        return UnixTimeDifference;
    }
    static getNow() {
        return new this(Date.now());
    }
    static get zero() {
        return new this(0);
    }
    static #days = [
        { english: "Sunday", japanese: "日" },
        { english: "Monday", japanese: "月" },
        { english: "Thuesday", japanese: "火" },
        { english: "Wednesday", japanese: "水" },
        { english: "Thursday", japanese: "木" },
        { english: "Friday", japanese: "金" },
        { english: "Saturday", japanese: "土" }
    ];
    static #unitConvertMagnifications = {
        year: {
            year: 1,
            month: 12,
            week: 12 * 4.34524,
            day: 12 * 4.34524 * 7,
            hour: 12 * 4.34524 * 7 * 24,
            minute: 12 * 4.34524 * 7 * 24 * 60,
            second: 12 * 4.34524 * 7 * 24 * 60 * 60,
            milliSecond: 12 * 4.34524 * 7 * 24 * 60 * 60 * 1000
        },
        month: {
            year: 1 / 12,
            month: 1,
            week: 4.34524,
            day: 4.34524 * 7,
            hour: 4.34524 * 7 * 24,
            minute: 4.34524 * 7 * 24 * 60,
            second: 4.34524 * 7 * 24 * 60 * 60,
            milliSecond: 4.34524 * 7 * 24 * 60 * 60 * 1000
        },
        week: {
            year: 1 / 4.34524 / 12,
            month: 1 / 4.34524,
            week: 1,
            day: 7,
            hour: 7 * 24,
            minute: 7 * 24 * 60,
            second: 7 * 24 * 60 * 60,
            milliSecond: 7 * 24 * 60 * 60 * 1000
        },
        day: {
            year: 1 / 4.34524 / 12 / 7,
            month: 1 / 4.34524 / 7,
            week: 1 / 7,
            day: 1,
            hour: 24,
            minute: 24 * 60,
            second: 24 * 60 * 60,
            milliSecond: 24 * 60 * 60 * 1000
        },
        hour: {
            year: 1 / 4.34524 / 12 / 7 / 24,
            month: 1 / 4.34524 / 7 / 24,
            week: 1 / 7 / 24,
            day: 1 / 24,
            hour: 1,
            minute: 60,
            second: 60 * 60,
            milliSecond: 60 * 60 * 1000
        },
        minute: {
            year: 1 / 4.34524 / 12 / 7 / 24 / 60,
            month: 1 / 4.34524 / 7 / 24 / 60,
            week: 1 / 7 / 24 / 60,
            day: 1 / 24 / 60,
            hour: 1 / 60,
            minute: 1,
            second: 60,
            milliSecond: 60 * 1000
        },
        second: {
            year: 1 / 4.34524 / 12 / 7 / 24 / 60 / 60,
            month: 1 / 4.34524 / 7 / 24 / 60 / 60,
            week: 1 / 7 / 24 / 60 / 60,
            day: 1 / 24 / 60 / 60,
            hour: 1 / 60 / 60,
            minute: 1 / 60,
            second: 1,
            milliSecond: 1000
        },
        milliSecond: {
            year: 1 / 4.34524 / 12 / 7 / 24 / 60 / 60 / 1000,
            month: 1 / 4.34524 / 7 / 24 / 60 / 60 / 1000,
            week: 1 / 7 / 24 / 60 / 60 / 1000,
            day: 1 / 24 / 60 / 60 / 1000,
            hour: 1 / 60 / 60 / 1000,
            minute: 1 / 60 / 1000,
            second: 1 / 1000,
            milliSecond: 1
        }
    };
    static timeUnits = {
        year: "year",
        month: "month",
        week: "week",
        day: "day",
        hour: "hour",
        minute: "minute",
        second: "second",
        milliSecond: "milliSecond"
    };
    static dateUnits = {
        date: "date"
    };
}
