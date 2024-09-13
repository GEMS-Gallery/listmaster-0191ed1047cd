import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  public type ShoppingItem = {
    id: Nat;
    description: Text;
    completed: Bool;
    emoji: Text;
  };

  public type Category = {
    name: Text;
    items: [ShoppingItem];
  };

  stable var shoppingItems : [ShoppingItem] = [];
  stable var nextId : Nat = 0;

  let predefinedCategories : [Category] = [
    {
      name = "Produce";
      items = [
        { id = 0; description = "Carrots"; completed = false; emoji = "🥕" },
        { id = 1; description = "Tomatoes"; completed = false; emoji = "🍅" },
        { id = 2; description = "Lettuce"; completed = false; emoji = "🥬" },
        { id = 3; description = "Apples"; completed = false; emoji = "🍎" },
        { id = 4; description = "Bananas"; completed = false; emoji = "🍌" },
      ];
    },
    {
      name = "Bakery";
      items = [
        { id = 5; description = "Bread"; completed = false; emoji = "🍞" },
        { id = 6; description = "Croissant"; completed = false; emoji = "🥐" },
        { id = 7; description = "Bagel"; completed = false; emoji = "🥯" },
        { id = 8; description = "Cake"; completed = false; emoji = "🍰" },
      ];
    },
    {
      name = "Dairy";
      items = [
        { id = 9; description = "Milk"; completed = false; emoji = "🥛" },
        { id = 10; description = "Cheese"; completed = false; emoji = "🧀" },
        { id = 11; description = "Yogurt"; completed = false; emoji = "🥣" },
        { id = 12; description = "Butter"; completed = false; emoji = "🧈" },
      ];
    },
    {
      name = "Meat";
      items = [
        { id = 13; description = "Chicken"; completed = false; emoji = "🍗" },
        { id = 14; description = "Beef"; completed = false; emoji = "🥩" },
        { id = 15; description = "Fish"; completed = false; emoji = "🐟" },
      ];
    },
  ];

  public func addItem(description : Text, emoji : Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem : ShoppingItem = {
      id = id;
      description = description;
      completed = false;
      emoji = emoji;
    };
    shoppingItems := Array.append(shoppingItems, [newItem]);
    id
  };

  public query func getItems() : async [ShoppingItem] {
    shoppingItems
  };

  public query func getPredefinedCategories() : async [Category] {
    predefinedCategories
  };

  public func toggleCompleted(id : Nat) : async Bool {
    let index = Array.indexOf<ShoppingItem>({ id = id; description = ""; completed = false; emoji = "" }, shoppingItems, func(a, b) { a.id == b.id });
    switch (index) {
      case null { false };
      case (?i) {
        let item = shoppingItems[i];
        let updatedItem = {
          id = item.id;
          description = item.description;
          completed = not item.completed;
          emoji = item.emoji;
        };
        shoppingItems := Array.tabulate(shoppingItems.size(), func (j : Nat) : ShoppingItem {
          if (j == i) { updatedItem } else { shoppingItems[j] }
        });
        true
      };
    }
  };

  public func deleteItem(id : Nat) : async Bool {
    let newItems = Array.filter(shoppingItems, func (item : ShoppingItem) : Bool { item.id != id });
    if (newItems.size() < shoppingItems.size()) {
      shoppingItems := newItems;
      true
    } else {
      false
    }
  };
}