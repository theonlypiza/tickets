"use client"; // Enables client-side fetching

import { useEffect, useState } from "react";

type Order = {
  name: string;
  confirmationNumber: string;
  displayFinancialStatus: string;
  customer: { firstName: string; lastName: string };
  totalPriceSet: {
    presentmentMoney: {
      amount: string;
      currencyCode: string;
    };
  };
};

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/shopify/orders");
        const data = await response.json();
        setOrders(data.orders.edges.map((edge: any) => edge.node)); // Extract orders
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Shopify Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Order Name</th>
              <th scope="col">Customer</th>
              <th scope="col">Confirmation #</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Total</th> {/* New Total Column */}
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{order.name}</td>
                  <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                  <td>{order.confirmationNumber || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${order.displayFinancialStatus === "PAID"
                        ? "bg-success"  // Green
                        : order.displayFinancialStatus === "PENDING"
                          ? "bg-warning text-dark"  // Yellow with dark text
                          : "bg-secondary"  // Default Gray
                        }`}
                    >
                      {order.displayFinancialStatus}
                    </span>
                  </td>
                  <td>
                    {/* Displaying Total Price with currency */}
                    {order.totalPriceSet.presentmentMoney.amount} {order.totalPriceSet.presentmentMoney.currencyCode}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No orders found</td> {/* Updated colspan to 6 */}
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
