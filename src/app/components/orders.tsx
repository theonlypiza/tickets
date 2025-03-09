"use client"; // Enables client-side fetching

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
} from "@mui/material";

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

type OrdersProps = {
  eventId: string;
};

export default function Orders({ eventId }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState<number>(0); // Added totalAmount state

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/shopify/orders?id=${eventId}`);
        const data = await response.json();
        const fetchedOrders = data.orders.edges.map((edge: any) => edge.node);
        setOrders(fetchedOrders);

        // Calculate the total amount of all orders
        const total = fetchedOrders.reduce((sum: number, order: Order) => {
          return sum + parseFloat(order.totalPriceSet.presentmentMoney.amount);
        }, 0);
        setTotalAmount(total); // Update the totalAmount state
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Total Amount: {totalAmount.toFixed(2)} {/* Display the total amount */}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Order Name</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Confirmation #</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>
                      {order.customer?.firstName} {order.customer?.lastName}
                    </TableCell>
                    <TableCell>{order.confirmationNumber || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.displayFinancialStatus}
                        color={
                          order.displayFinancialStatus === "PAID"
                            ? "success"
                            : order.displayFinancialStatus === "PENDING"
                            ? "warning"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {order.totalPriceSet.presentmentMoney.amount}{" "}
                      {order.totalPriceSet.presentmentMoney.currencyCode}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
