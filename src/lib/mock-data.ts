export interface Company {
  id: string;
  name: string;
  adminEmail: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  gst: number;
  stock: number;
  reorderLevel: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  outstandingBalance: number;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email: string;
  outstandingBalance: number;
}

export interface SaleRecord {
  invoiceNo: string;
  date: string;
  customer: string;
  items: { product: string; qty: number; price: number }[];
  totalAmount: number;
  gstAmount: number;
  paymentMode: string;
  status: string;
}

export const companies: Company[] = [
  { id: "abc", name: "ABC Pvt Ltd", adminEmail: "admin@abc.com", password: "admin123" },
  { id: "xyz", name: "XYZ Traders", adminEmail: "admin@xyz.com", password: "admin123" },
  { id: "alpha", name: "Alpha Industries", adminEmail: "admin@alpha.com", password: "admin123" },
];

const categories = ["Electronics", "Furniture", "Stationery", "Hardware", "Software"];

export const generateProducts = (): Product[] => [
  { id: "P001", name: "Samsung TV 55\"", category: "Electronics", price: 45000, gst: 18, stock: 25, reorderLevel: 5 },
  { id: "P002", name: "HP Laptop 15", category: "Electronics", price: 62000, gst: 18, stock: 18, reorderLevel: 5 },
  { id: "P003", name: "Office Desk", category: "Furniture", price: 12000, gst: 12, stock: 30, reorderLevel: 10 },
  { id: "P004", name: "Ergonomic Chair", category: "Furniture", price: 18500, gst: 12, stock: 15, reorderLevel: 5 },
  { id: "P005", name: "A4 Paper Ream", category: "Stationery", price: 350, gst: 5, stock: 200, reorderLevel: 50 },
  { id: "P006", name: "Printer Ink Set", category: "Stationery", price: 2800, gst: 18, stock: 40, reorderLevel: 10 },
  { id: "P007", name: "Power Drill", category: "Hardware", price: 4500, gst: 18, stock: 22, reorderLevel: 5 },
  { id: "P008", name: "LED Bulb Pack", category: "Hardware", price: 450, gst: 12, stock: 100, reorderLevel: 20 },
  { id: "P009", name: "Antivirus License", category: "Software", price: 1200, gst: 18, stock: 999, reorderLevel: 0 },
  { id: "P010", name: "MS Office Suite", category: "Software", price: 8500, gst: 18, stock: 999, reorderLevel: 0 },
  { id: "P011", name: "Wireless Mouse", category: "Electronics", price: 1200, gst: 18, stock: 60, reorderLevel: 15 },
  { id: "P012", name: "Mechanical Keyboard", category: "Electronics", price: 3500, gst: 18, stock: 35, reorderLevel: 10 },
  { id: "P013", name: "Filing Cabinet", category: "Furniture", price: 8500, gst: 12, stock: 12, reorderLevel: 3 },
  { id: "P014", name: "Whiteboard 4x3", category: "Stationery", price: 2200, gst: 12, stock: 20, reorderLevel: 5 },
  { id: "P015", name: "CCTV Camera Kit", category: "Electronics", price: 15000, gst: 18, stock: 8, reorderLevel: 3 },
  { id: "P016", name: "UPS 1000VA", category: "Electronics", price: 5500, gst: 18, stock: 20, reorderLevel: 5 },
  { id: "P017", name: "Ethernet Cable 50m", category: "Hardware", price: 1800, gst: 18, stock: 45, reorderLevel: 10 },
  { id: "P018", name: "Projector HD", category: "Electronics", price: 35000, gst: 18, stock: 6, reorderLevel: 2 },
  { id: "P019", name: "Tally ERP License", category: "Software", price: 18000, gst: 18, stock: 999, reorderLevel: 0 },
  { id: "P020", name: "Paper Shredder", category: "Hardware", price: 7500, gst: 18, stock: 10, reorderLevel: 3 },
];

export const generateCustomers = (): Customer[] => [
  { id: "C001", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@email.com", address: "Mumbai", outstandingBalance: 125000 },
  { id: "C002", name: "Priya Sharma", phone: "9876543211", email: "priya@email.com", address: "Delhi", outstandingBalance: 45000 },
  { id: "C003", name: "Amit Patel", phone: "9876543212", email: "amit@email.com", address: "Ahmedabad", outstandingBalance: 0 },
  { id: "C004", name: "Sneha Reddy", phone: "9876543213", email: "sneha@email.com", address: "Hyderabad", outstandingBalance: 78000 },
  { id: "C005", name: "Vikram Singh", phone: "9876543214", email: "vikram@email.com", address: "Jaipur", outstandingBalance: 32000 },
  { id: "C006", name: "Anita Desai", phone: "9876543215", email: "anita@email.com", address: "Pune", outstandingBalance: 0 },
  { id: "C007", name: "Suresh Menon", phone: "9876543216", email: "suresh@email.com", address: "Kochi", outstandingBalance: 56000 },
  { id: "C008", name: "Kavita Joshi", phone: "9876543217", email: "kavita@email.com", address: "Bangalore", outstandingBalance: 12000 },
  { id: "C009", name: "Rohit Gupta", phone: "9876543218", email: "rohit@email.com", address: "Lucknow", outstandingBalance: 89000 },
  { id: "C010", name: "Meera Nair", phone: "9876543219", email: "meera@email.com", address: "Chennai", outstandingBalance: 0 },
];

export const generateVendors = (): Vendor[] => [
  { id: "V001", name: "Tech Distributors", phone: "9800000001", email: "tech@vendor.com", outstandingBalance: 250000 },
  { id: "V002", name: "Office World Supplies", phone: "9800000002", email: "office@vendor.com", outstandingBalance: 45000 },
  { id: "V003", name: "Furniture Hub", phone: "9800000003", email: "fhub@vendor.com", outstandingBalance: 120000 },
  { id: "V004", name: "National Electronics", phone: "9800000004", email: "national@vendor.com", outstandingBalance: 0 },
  { id: "V005", name: "Digital Solutions", phone: "9800000005", email: "digital@vendor.com", outstandingBalance: 87000 },
  { id: "V006", name: "Hardware Palace", phone: "9800000006", email: "hwpal@vendor.com", outstandingBalance: 32000 },
  { id: "V007", name: "Stationery Mart", phone: "9800000007", email: "smart@vendor.com", outstandingBalance: 0 },
  { id: "V008", name: "Global Imports", phone: "9800000008", email: "global@vendor.com", outstandingBalance: 175000 },
  { id: "V009", name: "Quick Logistics", phone: "9800000009", email: "quick@vendor.com", outstandingBalance: 15000 },
  { id: "V010", name: "Prime Wholesale", phone: "9800000010", email: "prime@vendor.com", outstandingBalance: 0 },
];

const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const monthlySalesData = months.map((m, i) => ({
  month: m,
  sales: Math.floor(200000 + Math.random() * 300000 + i * 15000),
  purchases: Math.floor(150000 + Math.random() * 200000 + i * 8000),
  profit: Math.floor(40000 + Math.random() * 100000 + i * 5000),
}));

export const expenseBreakdown = [
  { name: "Cost of Goods", value: 45 },
  { name: "Salaries", value: 25 },
  { name: "Rent & Utilities", value: 12 },
  { name: "Marketing", value: 8 },
  { name: "Logistics", value: 6 },
  { name: "Others", value: 4 },
];

export const cashFlowData = months.map((m) => ({
  month: m,
  inflow: Math.floor(180000 + Math.random() * 250000),
  outflow: Math.floor(140000 + Math.random() * 200000),
}));

export const generateSales = (): SaleRecord[] => {
  const customers = generateCustomers();
  const products = generateProducts();
  const sales: SaleRecord[] = [];
  for (let i = 1; i <= 50; i++) {
    const cust = customers[Math.floor(Math.random() * customers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: numItems }, () => {
      const p = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      return { product: p.name, qty, price: p.price };
    });
    const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
    const gst = Math.floor(subtotal * 0.18);
    sales.push({
      invoiceNo: `INV-${String(i).padStart(4, "0")}`,
      date: `2025-${String(Math.floor(Math.random() * 6) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      customer: cust.name,
      items,
      totalAmount: subtotal + gst,
      gstAmount: gst,
      paymentMode: ["Cash", "Bank Transfer", "UPI", "Credit"][Math.floor(Math.random() * 4)],
      status: ["Paid", "Pending", "Partial"][Math.floor(Math.random() * 3)],
    });
  }
  return sales;
};

export const dashboardStats = {
  totalSales: 2847500,
  totalPurchases: 1965000,
  netProfit: 682500,
  receivables: 437000,
  payables: 724000,
  cashInHand: 285000,
  bankBalance: 1245000,
};

export const aiInsights = [
  { type: "success" as const, message: "Samsung TV 55\" predicted to be top seller next quarter — consider increasing stock by 40%" },
  { type: "warning" as const, message: "Outstanding receivables increased by 23% this month — follow up on 4 overdue invoices" },
  { type: "info" as const, message: "Cash flow forecast shows potential shortfall in March — plan for ₹1.2L buffer" },
  { type: "success" as const, message: "Profit margins improved by 3.2% compared to last quarter" },
  { type: "warning" as const, message: "5 products below reorder level — generate purchase orders" },
];

export const ratios = {
  currentRatio: 2.15,
  quickRatio: 1.82,
  grossProfitRatio: 34.5,
  netProfitRatio: 18.2,
  debtEquityRatio: 0.45,
  inventoryTurnover: 6.8,
};
