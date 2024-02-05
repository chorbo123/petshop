/**

	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.


 * @NApiVersion 2.x
 * @NModuleScope TargetAccount
 */

import * as Nrecord from 'N/record';
import { Schema } from '../Schema/Schema';
import { SchemaField } from '../Schema/SchemaField';
import { SchemaSublist } from '../Schema/SchemaSublist';
import { SchemaSublistField } from '../Schema/SchemaSublistField';

export const { Type } = Nrecord;
export type FieldValue = Nrecord.FieldValue;
export type RecordType = string | Nrecord.Type;

export interface RecordCreateOptions<T extends Schema = Schema> extends RecordOptions {
    schema: T;
}
export interface RecordLoadOptions<T extends Schema> extends RecordOptions {
    schema: T;
    recordtype: string;
    id: number;
}
export interface RecordTransformOptions<T extends Schema> {
    isDynamic?: boolean;
    schema: T;
    id: number;
    defaultValues?: T['transformDefaults'];
    fromSchema: Schema;
}

export interface RecordOptions<T extends Schema = Schema> {
    isDynamic?: boolean;
    defaultValues?: T['initializeDefaults'];
}
interface SubRecordOptions {
    record: Nrecord.Record;
    schema?: Schema;
}

export class ActiveRecord<T extends Schema = Schema> {
    private record: Nrecord.Record;
    public Schema: T;

    public constructor(recordOptions: RecordLoadOptions<T>);
    public constructor(recordOptions: RecordCreateOptions<T>);
    public constructor(recordOptions: RecordTransformOptions<T>);
    public constructor(recordOptions: SubRecordOptions);
    public constructor(
        recordOptions: RecordLoadOptions<T> &
            RecordCreateOptions<T> &
            RecordTransformOptions<T> &
            SubRecordOptions
    ) {
        recordOptions.isDynamic = recordOptions.isDynamic || true;
        recordOptions.defaultValues = recordOptions.defaultValues || {};
        this.Schema = recordOptions.schema;

        if (recordOptions.record) {
            this.record = recordOptions.record;
        } else if (recordOptions.fromSchema) {
            this.record = Nrecord.transform({
                fromType: recordOptions.fromSchema.type,
                fromId: recordOptions.id,
                toType: recordOptions.schema.type,
                isDynamic: recordOptions.isDynamic,
                defaultValues: recordOptions.defaultValues
            });
        } else if (recordOptions.id) {
            this.record = Nrecord.load({
                id: recordOptions.id,
                type: recordOptions.recordtype || recordOptions.schema.type,
                isDynamic: recordOptions.isDynamic,
                defaultValue: recordOptions.defaultValues
            });
        } else {
            this.record = Nrecord.create({
                type: recordOptions.schema.type,
                isDynamic: recordOptions.isDynamic,
                defaultValues: recordOptions.defaultValues
            });
        }
    }

    public save(
        options: {
            enablesourcing: boolean;
            ignoreMandatoryFields: boolean;
        } = { enablesourcing: true, ignoreMandatoryFields: false }
    ): number {
        return this.record.save({
            enableSourcing: options.enablesourcing,
            ignoreMandatoryFields: options.ignoreMandatoryFields
        });
    }

    private getField<T extends FieldValue>(field: SchemaField<T>): Nrecord.Field {
        return this.record.getField({ fieldId: field.fieldId });
    }

    public getId(): string
    {
       return <string>this.record.getValue({ fieldId: 'id' });
    }

    public getValue<T extends FieldValue = string>(field: SchemaField<T>): T {
        // TODO: infer return type from SchemaRecordField (T)
        return <T>this.record.getValue({ fieldId: field.fieldId });
    }

    public getText<T extends FieldValue = string>(field: SchemaField<T>): T {
        return <T>this.record.getText({ fieldId: field.fieldId });
    }

    public getFieldSelectOptions<T extends FieldValue>(
        field: SchemaField<T>
    ): { value: any; text: string }[] {
        return this.getField(field).getSelectOptions();
    }

    public getSublistText(field: SchemaSublistField, line: number): string {
        return this.record.getSublistText({
            sublistId: field.sublistId,
            fieldId: field.fieldId,
            line
        });
    }

    public getSublistValue<T extends FieldValue = string>(
        field: SchemaSublistField,
        line: number
    ): T {
        return <T>this.record.getSublistValue({
            sublistId: field.sublistId,
            fieldId: field.fieldId,
            line
        });
    }

    public getSublistSubrecord<T extends Schema>(
        sublistField: SchemaSublistField<T>,
        line: number
    ): ActiveRecord {
        return new ActiveRecord<T>({
            record: this.record.getSublistSubrecord({
                fieldId: sublistField.fieldId,
                sublistId: sublistField.sublistId,
                line
            })
        });
    }

    public createCurrentSublistSubrecord<T extends FieldValue>(
        sublistField: SchemaSublistField<T>
    ): ActiveRecord {
        return new ActiveRecord({
            record: this.record.getCurrentSublistSubrecord({
                fieldId: sublistField.fieldId,
                sublistId: sublistField.sublistId
            })
        });
    }

    public getCurrentSublistSubrecord<T extends Schema>(
        sublistField: SchemaSublistField<T>
    ): ActiveRecord {
        return new ActiveRecord<T>({
            record: this.record.getCurrentSublistSubrecord({
                fieldId: sublistField.fieldId,
                sublistId: sublistField.sublistId
            })
        });
    }

    public removeLine(sublist: SchemaSublist, line: number): void {
        this.record.removeLine({
            sublistId: sublist.sublistId,
            line
        });
    }

    public getLineCount(sublist: SchemaSublist): number {
        return this.record.getLineCount({
            sublistId: sublist.sublistId
        });
    }

    public isFieldMandatory<T extends FieldValue>(field: SchemaField<T>): boolean {
        return this.getField(field).isMandatory;
    }

    public setValue<T extends FieldValue>(field: SchemaField<T>, value: FieldValue): void {
        this.record.setValue({
            fieldId: field.fieldId,
            value
        });
    }

    public setText<T extends FieldValue>(field: SchemaField<T>, text: string): void {
        this.record.setText({
            fieldId: field.fieldId,
            text
        });
    }

    public cancelLine(sublist: SchemaSublist): void {
        this.record.cancelLine({
            sublistId: sublist.sublistId
        });
    }

    public selectLine(sublist: SchemaSublist, line: number): void {
        this.record.selectLine({
            sublistId: sublist.sublistId,
            line
        });
    }

    public insertLine(sublist: SchemaSublist, line: number, ignoreRecalc: boolean = false): void {
        this.record.insertLine({
            sublistId: sublist.sublistId,
            line,
            ignoreRecalc
        });
    }

    public selectNewLine(sublist: SchemaSublist): void {
        this.record.selectNewLine({
            sublistId: sublist.sublistId
        });
    }

    public commitLine(sublist: SchemaSublist): void {
        this.record.commitLine({
            sublistId: sublist.sublistId
        });
    }

    public setCurrentSublistText(
        subfield: SchemaSublistField,
        text: string,
        ignoreFieldChange: boolean = false
    ): void {
        this.record.setCurrentSublistText({
            sublistId: subfield.sublistId,
            fieldId: subfield.fieldId,
            text,
            ignoreFieldChange
        });
    }

    public setCurrentSublistValue(
        subfield: SchemaSublistField,
        value: FieldValue,
        ignoreFieldChange: boolean = false
    ): void {
        this.record.setCurrentSublistValue({
            sublistId: subfield.sublistId,
            fieldId: subfield.fieldId,
            value,
            ignoreFieldChange
        });
    }

    public setCurrentSublistOptionValue(
        sublist: SchemaSublist,
        fieldId: string,
        value: FieldValue,
        ignoreFieldChange: boolean = false
    ): void {
        this.record.setCurrentSublistValue({
            sublistId: sublist.sublistId,
            fieldId,
            value,
            ignoreFieldChange
        });
    }

    public setSublistValue(subfield: SchemaSublistField, line: number, value: FieldValue): void {
        this.record.setSublistValue({
            sublistId: subfield.sublistId,
            fieldId: subfield.fieldId,
            line,
            value
        });
    }

    public getCurrentSublistText(subfield: SchemaSublistField): string {
        return this.record.getCurrentSublistText({
            sublistId: subfield.sublistId,
            fieldId: subfield.fieldId
        });
    }

    public getCurrentSublistValue<T extends FieldValue = string>(subfield: SchemaSublistField): T {
        return <T>this.record.getCurrentSublistValue({
            sublistId: subfield.sublistId,
            fieldId: subfield.fieldId
        });
    }

    public getCurrentSublistOptionValue(sublist: SchemaSublist, fieldId: string): FieldValue {
        return this.record.getCurrentSublistValue({
            sublistId: sublist.sublistId,
            fieldId
        });
    }

    public getSublistOptionValue<T extends FieldValue = string>(
        sublist: SchemaSublist,
        fieldId: string,
        line: number
    ): FieldValue {
        return <T>this.record.getSublistValue({
            sublistId: sublist.sublistId,
            fieldId,
            line
        });
    }

    public getSublistOptionText(sublist: SchemaSublist, fieldId: string, line: number): string {
        return this.record.getSublistText({
            sublistId: sublist.sublistId,
            fieldId,
            line
        });
    }
    public executeMacro<T>(id: string, params?: object): T {
        return <T>this.record.executeMacro({
            id,
            params
        });
    }

    public getSubrecord<T extends FieldValue>(recordField: SchemaField<T>): ActiveRecord {
        return new ActiveRecord({
            record: this.record.getSubrecord({ fieldId: recordField.fieldId })
        });
    }

    public getSublistFields<T extends FieldValue>(field: SchemaField<T>): string[] {
        return this.record.getSublistFields({
            sublistId: field.fieldId
        });
    }
    public toJSON(): object {
        return this.record.toJSON();
    }

    public toString(): string
    {
        return this.record.toString();
    }


    public getType():string {
        return <string>this.record.type;
    }

    public static create<T extends Schema>(options: RecordCreateOptions<T>): ActiveRecord<T> {
        return new ActiveRecord<T>(options);
    }

    public static load<T extends Schema>(options: RecordLoadOptions<T>): ActiveRecord<T> {
        return new ActiveRecord<T>(options);
    }

    public static transform<T extends Schema>(options: RecordTransformOptions<T>): ActiveRecord<T> {
        return new ActiveRecord<T>(options);
    }

    public static submitField<T extends FieldValue>(
        schema: Schema,
        id: number,
        field: SchemaField<T>,
        value: FieldValue,
        options: {
            enablesourcing: boolean;
            ignoreMandatoryFields: boolean;
        } = { enablesourcing: true, ignoreMandatoryFields: false }
    ): number {
        const values = {};

        values[field.fieldId] = value;

        return Nrecord.submitFields({
            type: schema.type,
            id: id,
            values: values,
            options: {
                enableSourcing: options.enablesourcing,
                ignoreMandatoryFields: options.ignoreMandatoryFields
            }
        });
    }
}