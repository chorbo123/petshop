import { CollectionEventsDefinition } from '../../../Commons/Core/JavaScript/Collection';

export interface PaymentInstrumentACH {
    id?: number;
    type?: string | object;
    internalid?: number | string;
    mask?: string;
    paymentinstrumenttype?: string;
    bankname?: string;
    routingnumber?: string;
    ownername?: string;
    accounttype?: string | object;
    account?: string;
    default?: string;
    achaccounttype?: string;
    customerconsent?: string;
    limit?: string;
    paymentmethod?:
        | any
        | {
              id?: number;
              internalid?: number;
              imagesrc?: string[];
              name?: string;
              ACH?: any;
          };
    paymentmethods?;
    ACH?: any;
    consent?: boolean;
}

export interface CollectionEventsDefinitionACH<TCollection>
    extends CollectionEventsDefinition<TCollection, {}> {
    add: (collection: TCollection) => void;
    remove: (collection: TCollection) => void;
    change: (collection: TCollection) => void;
    destroy: (collection: TCollection) => void;
    noconsent: (collection: TCollection) => void;
}
