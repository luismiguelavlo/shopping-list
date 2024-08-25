import { useState } from 'react';

const initialItems = [
  {
    id: 1, description: '🥦 broccoli', quantity: 2, checked: false
  },
  {
    id: 2, description: '🍎 Apples', quantity: 5, checked: false
  },
  {
    id: 3, description: '🥟 dumplings', quantity: 1, checked: false
  }
]

export default function App () {
  const [items, setItems] = useState(initialItems);

  function handleAddItems (item) {
    setItems(items => [...items, item])
  }

  function handleDeleteItem (id) {
    setItems(items => items.filter(item => item.id !== id))
  }

  function handleToggleItem (id) {
    setItems(items => items.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  function handleClearList () {
    const clearedItems = window.confirm('Are you sure you want to clear your list?');

    if (!clearedItems) return;
    setItems([])
  }

  return (
    <div className='app'>
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList 
        items={items} 
        onDeleteItem={handleDeleteItem} 
        onToggleItem={handleToggleItem} 
        onClearList={handleClearList}
        />
      <Stats items={items} />
    </div>
  )
}

function Logo () {
  return <h1>🛍️ Shopping List 🎁</h1>
}

function Form ({ onAddItems }) {

  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  // const [items, setItems] = useState(initialItems);

  // function handleAddItems(item){
  //   setItems(items => [...items, item])
  // }

  function handleSubmit (e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, checked: false, id: Date.now() };

    onAddItems(newItem);

    setDescription('');
    setQuantity(1);
  }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need to 🤑 buy?</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {
          Array.from({ length: 20 }, (_, i) => i + 1)
            .map(num => <option key={num}>{num}</option>)
        }
      </select>
      <input type='text' placeholder='Item...' value={description} onChange={(e) => setDescription(e.target.value)} />
      <button>Add</button>
    </form>
  )
}

function PackingList ({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState('input');

  let sortedItems;

  if (sortBy === 'input') sortedItems = items;

  if (sortBy === 'description') sortedItems = items.sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === 'checked') sortedItems = items.slice().sort((a,b) => +a.checked - (+b.checked))

  return (
    <div className='list'>
      <ul >
        {
          sortedItems.map(item => <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />)
        }
      </ul>

      <div className='actions'>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value='input'>Sort by input order</option>
          <option value='description'>Sort by description</option>
          <option value='checked'>Sort by checked</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  )
}

function Item ({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input type="checkbox" value={item.checked} onChange={() => { onToggleItem(item.id) }} />
      <span style={item.checked ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  )
}

function Stats ({ items }) {

  if (!items.length)
    return (
      <p className='stats'>😴 You have no items on your list</p>
    )

  const numItems = items.length;
  const numChecked = items.filter(item => item.checked).length;
  const percentage = Math.round((numChecked / numItems) * 100);

  return (
    <footer className='stats'>
      <em>
        {percentage === 100
          ?
          'you have made all the purchases, you can return home'
          :
          `you have ${numItems} items on your list, and you already packed ${numChecked} (${percentage}%)`
        }
      </em>
    </footer>
  )
}