import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'name' : string, 'items' : Array<ShoppingItem> }
export interface ShoppingItem {
  'id' : bigint,
  'completed' : boolean,
  'description' : string,
  'emoji' : string,
}
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string], bigint>,
  'deleteItem' : ActorMethod<[bigint], boolean>,
  'getItems' : ActorMethod<[], Array<ShoppingItem>>,
  'getPredefinedCategories' : ActorMethod<[], Array<Category>>,
  'toggleCompleted' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
