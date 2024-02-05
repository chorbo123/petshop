/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.CollectionView"/>

import * as backbone_collection_view_cell_tpl from 'backbone_collection_view_cell.tpl';
import * as backbone_collection_view_row_tpl from 'backbone_collection_view_row.tpl';

import { CollectionView } from '../../Core/JavaScript/CollectionView';
import { RecordViewsView } from '../../../Advanced/RecordViews/JavaScript/RecordViews.View';
import {
    PaymentInstrumentACHView,
    PaymentInstrumentACHViewOptions
} from './PaymentInstrumentACH.View';

import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';
import { PaymentInstrumentACHCollection } from './PaymentInstrumentACH.Collection';
import { View } from '../../Core/JavaScript/View';
import { RowView } from '../../Core/JavaScript/RowView';
import { CollectionEventsDefinitionACH } from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';

export class PaymentInstrumentACHCollectionView extends CollectionView<
    PaymentInstrumentACHModel,
    {},
    CollectionEventsDefinitionACH<PaymentInstrumentACHCollection>
> {
    private readonly options: PaymentInstrumentACHViewOptions;

    protected cellTemplate = backbone_collection_view_cell_tpl;

    public constructor(
        collection: PaymentInstrumentACHModel[],
        options: PaymentInstrumentACHViewOptions
    ) {
        super(collection);
        this.options = options;
    }

    public getCellViewsPerRow(): number {
        return this.options.viewsPerRow || 1;
    }

    public getCellViewInstance(model: PaymentInstrumentACHModel): RecordViewsView {
        this.options.model = model;
        return new PaymentInstrumentACHView(this.options);
    }

    protected getRowViewInstance(index: number): View<object, object> | null {
        return new RowView({ template: backbone_collection_view_row_tpl });
    }

    public getContext(): {} {
        return {};
    }
}
