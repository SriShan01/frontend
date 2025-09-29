import { useState, useEffect } from "react";
import '../app/globals.css';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchOrders = async () => {
    const res = await fetch(`https://backend-production-4551.up.railway.app/orders?search=${search}`);
    const data = await res.json();
    setOrders(data);
  };

  const createOrder = async () => {
    await fetch(`https://backend-production-4551.up.railway.app/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        items: [{ productId: Number(productId), quantity: Number(quantity) }],
      }),
    });
    fetchOrders();
    setUserId("");
    setProductId("");
    setQuantity("");
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1>Orders</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search by User ID"
          className="input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchOrders} className="button button-blue">
          Search
        </button>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <input
          placeholder="User ID"
          className="input flex-1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Product ID"
          className="input flex-1"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          placeholder="Quantity"
          className="input flex-1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={createOrder} className="button button-green">
          Create Order
        </button>
      </div>

      <div className="grid gap-4">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <h2>Order #{order.id}</h2>
                <span>User: {order.userId}</span>
              </div>
              <p>
                Items: {order.items.map((i) => `${i.productId} x${i.quantity}`).join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}
