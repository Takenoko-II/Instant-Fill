export class Time {
    /**
     * UTC時間を基に時刻データを作成します。
     * @param time 基となるUTC時間または日付の直接指定。
     */
    constructor(time: number | DateSpecification);
    /**
     * この時刻データにおける年。
     */
    year: number;
    /**
     * この時刻データにおける月。
     */
    month: number;
    /**
     * この時刻データにおける日。
     */
    date: number;
    /**
     * この時刻データにおける曜日。
     */
    day: string;
    /**
     * この時刻データにおける時間。
     */
    hour: number;
    /**
     * この時刻データにおける分。
     */
    minute: number;
    /**
     * この時刻データにおける秒。
     */
    second: number;
    /**
     * この時刻データにおけるミリ秒。
     */
    milliSecond: number;
    /**
     * 時刻データをデジタル時計の表示にした文字列を返します。
     */
    toClock(): string;
    /**
     * 時刻データを日本語文字列に変換したものを返します。
     */
    toString(): string;
    /**
     * この時刻から指定時間分巻き戻した時刻を返します。
     * @param time 巻き戻す時間。
     * @param unit 時間の単位。
     */
    past(time: number, unit: string): Time | undefined;
    /**
     * この時刻から指定時間分進めた時刻を返します。
     * @param time 進める時間。
     * @param unit 時間の単位。
     */
    future(time: number, unit: string): Time | undefined;
    /**
     * 関数の実行をこの絶対時刻に予約し、予約に成功したかどうかを真偽値で返します。
     * @param callbackFn 実行する関数。
     */
    reserve(callbackFn: (arg: ReserveData) => void): boolean;
    /**
     * @param unit 時間の単位。
     * 指定単位以下の時間を切り捨てます。
     */
    floor(unit: string): Time; 
    /**
     * 各曜日の言語別の文字列。
     */
    static readonly #days: { english: string, japanese: string }[];
    /**
     * 英文字列や数値から、特定の言語の「曜日」文字列を返します。
     * @param day 0～6の数値、もしくは「Sunday」等の英文字列。
     * @param language 「japanese」等の言語。
     */
    static getDayOfLanguage(day: string | number, language: string): string;
    /**
     * 時刻データからUTC時間を返します。
     * @param time 時刻データ。
     */
    static getUTCTime(time: DateSpecification | Time): number;
    /**
     * 1970年1月1日0時0分0秒の時刻データ。
     */
    static readonly zero: Time;
    /**
     * 現在時刻のデータを取得します。
     */
    static getNow(): Time;
    /**
     * 渡された時間の値を指定の単位に変換します。
     * @param time 変換前の値。
     * @param unitBefore 単位変換前の単位。
     * @param unitAfter 単位変換後の単位。
     */
    static convertUnit(time: number, unitBefore: string, unitAfter: string): number;
    /**
     * 2つの時刻の差を返します。
     * @param timeA 時刻データ。
     * @param timeB 時刻データ。
     */
    static getDifference(timeA: DateSpecification | Time, timeB: DateSpecification | Time): number;
    /**
     * 時間の単位変換の際の各単位におけるそれぞれへの倍率。
     */
    static readonly #unitConvertMagnifications: {
        readonly year: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly month: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly week: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly day: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly hour: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly minute: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly second: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        },
        readonly milliSecond: {
            readonly year: number,
            readonly month: number,
            readonly week: number,
            readonly day: number,
            readonly hour: number,
            readonly minute: number,
            readonly second: number,
            readonly milliSecond: number
        }
    };
    /**
     * 時間の単位。
     */
    static readonly timeUnits: {
        readonly year: string,
        readonly month: string,
        readonly week: string,
        readonly day: string,
        readonly hour: string,
        readonly minute: string,
        readonly second: string,
        readonly milliSecond: string
    };
    /**
     * 日付の単位。
     */
    static readonly dateUnits: {
        readonly date: string
    };
}

interface DateSpecification {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
    milliSecond: number;
}

interface ReserveData {
    readonly reservedTime: Time;
}