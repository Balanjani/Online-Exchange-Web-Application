<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orders Placed - Online Exchange</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      padding: 20px;
    }
    h1 {
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ccc;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .status {
      padding: 5px;
      border-radius: 4px;
      color: white;
    }
    .status.complete {
      background-color: #28a745;
    }
    .status.pending {
      background-color: #ffc107;
      color: black;
    }
    .status.cancelled {
      background-color: #dc3545;
    }
    .loading {
      text-align: center;
      font-size: 20px;
    }
    .error {
      text-align: center;
      color: red;
      font-size: 18px;
    }
  </style>
</head>
<body>

  <h1>Your Orders</h1>

  <div id="statusMessage" class="loading">Loading orders...</div>

  <table id="ordersTable" style="display: none;">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Asset</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody id="ordersList">
      <!-- Orders will be dynamically inserted here -->
    </tbody>
  </table>