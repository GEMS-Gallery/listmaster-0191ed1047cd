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
        { id = 5; description = "Broccoli"; completed = false; emoji = "🥦" },
        { id = 6; description = "Grapes"; completed = false; emoji = "🍇" },
        { id = 7; description = "Strawberries"; completed = false; emoji = "🍓" },
      ];
    },
    {
      name = "Bakery";
      items = [
        { id = 8; description = "Bread"; completed = false; emoji = "🍞" },
        { id = 9; description = "Croissant"; completed = false; emoji = "🥐" },
        { id = 10; description = "Bagel"; completed = false; emoji = "🥯" },
        { id = 11; description = "Cake"; completed = false; emoji = "🍰" },
        { id = 12; description = "Muffin"; completed = false; emoji = "🧁" },
        { id = 13; description = "Donut"; completed = false; emoji = "🍩" },
      ];
    },
    {
      name = "Dairy";
      items = [
        { id = 14; description = "Milk"; completed = false; emoji = "🥛" },
        { id = 15; description = "Cheese"; completed = false; emoji = "🧀" },
        { id = 16; description = "Yogurt"; completed = false; emoji = "🥣" },
        { id = 17; description = "Butter"; completed = false; emoji = "🧈" },
        { id = 18; description = "Eggs"; completed = false; emoji = "🥚" },
      ];
    },
    {
      name = "Meat";
      items = [
        { id = 19; description = "Chicken"; completed = false; emoji = "🍗" },
        { id = 20; description = "Beef"; completed = false; emoji = "🥩" },
        { id = 21; description = "Fish"; completed = false; emoji = "🐟" },
        { id = 22; description = "Pork"; completed = false; emoji = "🥓" },
        { id = 23; description = "Turkey"; completed = false; emoji = "🦃" },
      ];
    },
    {
      name = "Beverages";
      items = [
        { id = 24; description = "Water"; completed = false; emoji = "💧" },
        { id = 25; description = "Coffee"; completed = false; emoji = "☕" },
        { id = 26; description = "Tea"; completed = false; emoji = "🍵" },
        { id = 27; description = "Juice"; completed = false; emoji = "🧃" },
        { id = 28; description = "Soda"; completed = false; emoji = "🥤" },
      ];
    },
    {
      name = "Snacks";
      items = [
        { id = 29; description = "Chips"; completed = false; emoji = "🥔" },
        { id = 30; description = "Cookies"; completed = false; emoji = "🍪" },
        { id = 31; description = "Popcorn"; completed = false; emoji = "🍿" },
        { id = 32; description = "Nuts"; completed = false; emoji = "🥜" },
        { id = 33; description = "Chocolate"; completed = false; emoji = "🍫" },
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

  public query func toggleItemCompleted(id : Nat) : async ShoppingItem {
    let index = Array.indexOf<ShoppingItem>({ id = id; description = ""; completed = false; emoji = "" }, shoppingItems, func(a, b) { a.id == b.id });
    switch (index) {
      case null { { id = id; description = ""; completed = false; emoji = "" } };
      case (?i) {
        let item = shoppingItems[i];
        {
          id = item.id;
          description = item.description;
          completed = not item.completed;
          emoji = item.emoji;
        }
      };
    }
  };

  public func saveCart(items : [ShoppingItem]) : async Bool {
    shoppingItems := items;
    true
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