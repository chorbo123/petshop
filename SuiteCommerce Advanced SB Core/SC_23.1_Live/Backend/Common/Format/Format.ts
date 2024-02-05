/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import '../../third_parties/underscore.js';
import * as Nformat from 'N/format';
import { FieldValue } from '../ActiveRecord/ActiveRecord';
import { Environment } from '../Environment/Environment';

export class Format {
    public dummyDate: Date = new Date();

    private static instance: Format;

    private constructor() {}

    public static getInstance(): Format {
        if (!this.instance) {
            this.instance = new Format();
        }
        return this.instance;
    }

    private format<T extends FieldValue>(value: string | number | Date, type: Nformat.Type): T {
        let result: T = null;
        if (value === 0 || value) {
            result = Nformat.format({
                value,
                type
            });
        }
        return result;
    }

    private toDate(value: FieldValue): Date {
        return new Date(<string>Nformat.parse({
            value: this.toValue(value),
            type: Nformat.Type.DATE
        }));
    }

    public toDateString(value: FieldValue): string {
        const date: string | Date = this.toDate(value) || this.dummyDate;
        return this.format<string>(date, Nformat.Type.DATE);
    }

    public toTimeOfDay(value: FieldValue): string {
        const date = this.toDate(value) || this.dummyDate;
        return this.format<string>(date, Nformat.Type.TIMEOFDAY);
    }

    public toCurrency(value: FieldValue): string {
        // review this

        /* return (
            Environment.getInstance()
                .getCurrentWebsite()
                .getCurrency().displaysymbol + this.toCurrencyValue(value)
        );*/
        return this.toCurrencyValue(value);
    }

    public toCurrencyValue(value: FieldValue): string {
        // TODO: test if N/format check for siteSettings format delimiters ["," - ".", "(", ")"]
        return this.format<string>(this.toValue(value) || 0, Nformat.Type.CURRENCY);
    }

    public toFloat(value: FieldValue): number {
        return parseFloat(this.toValue(value)) || 0;
    }

    public toInt(value: FieldValue): number {
        return parseInt(this.toValue(value), 10) || 0;
    }

    public sanitizeHTML(value: FieldValue): string {
        return this.toValue(value)
            .replace(/<br>/g, '\n')
            .replace(/</g, '&lt;')
            .replace(/\>/g, '&gt;');
    }

    public stripHTML(value: FieldValue): string {
        return this.toValue(value)
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<(?:.|\n)*?>/gm, '');
    }

    public toCamelCase(value: FieldValue, text?: FieldValue): string {
        return this.toValue(value)
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr): string => chr.toUpperCase());
    }

    public toValue(value: FieldValue, text?: FieldValue): string {
        return String(value || '');
    }

    public toFieldValue<F extends FieldValue>(value: FieldValue): F {
        return <F>value;
    }

    public toText(value: FieldValue, text: FieldValue): string {
        return String(text || '');
    }

    public toBoolean(value: FieldValue, text: FieldValue): boolean {
        return Boolean(value);
    }

    public toTorF(value: FieldValue, text: FieldValue): string {
        return value ? 'T' : 'F';
    }
}