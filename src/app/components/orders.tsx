"use client"; // Enables client-side fetching

import React, { useEffect, useState } from "react";
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
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  lineItems: {
    edges: Array<any>;
  };
};

type OrdersProps = {
  eventId: string;
};

export default function Orders({ eventId }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/shopify/orders?id=${eventId}`);
        const data = await response.json();
        const fetchedOrders = data.orders.edges.map((edge: any) => edge.node);
        setOrders(fetchedOrders);

        const total = fetchedOrders.reduce((sum: number, order: Order) => {
          return sum + parseFloat(order.totalPriceSet.presentmentMoney.amount);
        }, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [eventId]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Total Amount: {totalAmount.toFixed(2)}
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
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
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => toggleRow(index)}
                          startIcon={
                            expandedRows[index] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )
                          }
                        >
                          {expandedRows[index] ? "Hide" : "Show"} Details
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedRows[index] && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Table sx={{ width: "100%" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "33%" }}>
                                  Tipo
                                </TableCell>
                                <TableCell sx={{ width: "33%" }}>
                                  Precio
                                </TableCell>
                                <TableCell sx={{ width: "34%" }}>
                                  Cantidad
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.lineItems.edges.length > 0 ? (
                                order.lineItems.edges.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell sx={{ width: "33%" }}>
                                      {item.node.variant.title}
                                    </TableCell>
                                    <TableCell sx={{ width: "33%" }}>
                                      {item.node.variant.amount}
                                    </TableCell>
                                    <TableCell sx={{ width: "34%" }}>
                                      {item.node.quantity}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} align="center">
                                    No items found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
