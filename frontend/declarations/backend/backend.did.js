export const idlFactory = ({ IDL }) => {
  const ShoppingItem = IDL.Record({
    'id' : IDL.Nat,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'emoji' : IDL.Text,
  });
  const Category = IDL.Record({
    'name' : IDL.Text,
    'items' : IDL.Vec(ShoppingItem),
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'deleteItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getItems' : IDL.Func([], [IDL.Vec(ShoppingItem)], ['query']),
    'getPredefinedCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'saveCart' : IDL.Func([IDL.Vec(ShoppingItem)], [IDL.Bool], []),
    'toggleItemCompleted' : IDL.Func([IDL.Nat], [ShoppingItem], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
