import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid, Database, PackageSearch, ListTree, Boxes, Truck, Radio,
  BrainCircuit, Search, ChevronRight, X, Star, Wifi, WifiOff, RefreshCw,
  AlertTriangle, CheckCircle2, Clock, Bot, ScanLine, ArrowRight,
  Gauge, Sparkles, Filter, Package, Calendar, Printer, MoveRight,
  ClipboardList, Smartphone, Monitor, PackageCheck, Users, Tags,
  TrendingUp, Timer, Route, ShoppingBag, Undo2, ImagePlus, ShieldCheck,
  CalendarClock, FileText, MapPinned, Headphones, PlusCircle, ClipboardCheck,
  Lock, Unlock, Send, Trash2, Box, ArrowDownToLine,
  ArrowLeftRight, Tag, Settings2, PlayCircle, Edit3, Save, ShieldAlert,
  Video, Camera, Warehouse,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import * as THREE from "three";

/* ================================================================== */
/* HELPERS (defined first — used by DATA generators below)             */
/* ================================================================== */

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

/* ================================================================== */
/* DATA — MASTER                                                       */
/* ================================================================== */

const GROUPS = {
  A: { label: "Conventional Picking", color: "#5FB4D6" },
  B: { label: "Multi-Order & Wave", color: "#6FCF97" },
  C: { label: "Dynamic Planning", color: "#F5A623" },
  D: { label: "Autonomous Task Mgmt", color: "#F2994A" },
  E: { label: "Slotting Intelligence", color: "#BB86FC" },
  F: { label: "Automation & Robotics", color: "#2FD4C4" },
  G: { label: "Fulfillment Modes", color: "#EB5757" },
  H: { label: "Continuous Fulfillment", color: "#56CCF2" },
  I: { label: "AI Intelligence Platform", color: "#F5A623" },
};

const STRATEGIES = [
  { id: 1, g: "A", name: "Discrete Picking", th: "หยิบเดี่ยวทีละออเดอร์", desc: "หยิบ 1 Order ต่อ 1 พนักงานจนครบก่อนเริ่มใบถัดไป", suited: "สินค้ามูลค่าสูง / Serial-IMEI", stars: 1 },
  { id: 2, g: "A", name: "Batch Picking", th: "หยิบรวมตาม SKU", desc: "รวมออเดอร์ที่มี SKU ซ้ำ หยิบครั้งเดียวแล้วแยกที่ Pack Station", suited: "Order ปริมาณมาก / SKU ซ้ำ", stars: 2 },
  { id: 3, g: "A", name: "Cluster Picking", th: "หยิบพร้อมกันหลายออเดอร์", desc: "ใช้รถเข็น Multi-Tote หยิบตามเส้นทาง แยกลง Tote ทันที", suited: "Order ปานกลาง / หลาย SKU ต่อใบ", stars: 2 },
  { id: 4, g: "A", name: "Zone Picking", th: "หยิบตาม⫹", desc: "แบ่งคลังเป็น⫹ พนักงานรับผิดชอบ⫹ตนเอง ลดระยะเดิน", suited: "คลังขนาดใหญ่ หลาย⫹", stars: 2 },
  { id: 5, g: "A", name: "Pick & Pass", th: "หยิบส่งต่อข้าม⫹", desc: "ส่งต่อ Tray ข้าม⫹ตามลำดับ แต่ละ⫹เพิ่มสินค้าของตน", suited: "Order ที่ต้องหยิบจากหลาย⫹", stars: 2 },
  { id: 6, g: "B", name: "Zone Batch Picking", th: "ผสม⫹ + Batch", desc: "หยิบหลายออเดอร์พร้อมกันใน⫹เดียวกันแล้ว Sort", suited: "Fast-Moving ใน Zone เดียว", stars: 3 },
  { id: 7, g: "B", name: "Wave Picking", th: "หยิบเป็นชุดตามเวลา", desc: "รวม Order เป็น Wave ตาม Cut-off/เขตจัดส่ง ปล่อยเป็นชุด", suited: "หลาย Carrier / หลาย Cut-off", stars: 3 },
  { id: 8, g: "B", name: "Multi-Order Picking", th: "หยิบหลายออเดอร์ไม่จำกัด Tote", desc: "หยิบพร้อมกันบน Cart ขนาดใหญ่ นำทางตาม Sequence", suited: "Order ปริมาณสูง น้ำหนักเบา", stars: 2 },
  { id: 9, g: "B", name: "Cart Picking", th: "หยิบด้วยรถเข็นหลายชั้น", desc: "รถเข็นมีหลาย Tote ระบบแสดงบน HHT ว่าลงช่องใด", suited: "Mixed SKU / Fulfillment", stars: 2 },
  { id: 10, g: "B", name: "Pick-to-Tote", th: "หยิบลง Tote ส่ง Conveyor", desc: "หยิบลง Tote มาตรฐาน วางบน Conveyor ไป Sort/Pack", suited: "มี Conveyor / Auto Sorter", stars: 3 },
  { id: 11, g: "C", name: "Dynamic Wave Planning", th: "วางแผน Wave แบบเรียลไทม์", desc: "สร้าง Wave อัตโนมัติตาม Order ใหม่และ Resource พร้อมใช้", suited: "รับ Order ตลอดเวลา", stars: 4 },
  { id: 12, g: "C", name: "Order Priority Engine", th: "จัดคะแนนความสำคัญออเดอร์", desc: "ให้คะแนนตาม SLA / VIP / Cut-off / มูลค่า", suited: "ทุกประเภทคลัง", stars: 3 },
  { id: 13, g: "C", name: "AI Batch Optimization", th: "AI จัดกลุ่ม Batch ที่ดีที่สุด", desc: "รวม SKU ซ้ำ ลดระยะทาง สมดุล Workload", suited: "Fulfillment ปริมาณสูง", stars: 4 },
  { id: 14, g: "C", name: "Dynamic Pick Path Optimization", th: "คำนวณเส้นทางหยิบสั้นที่สุด", desc: "ปรับตาม Congestion แบบไดนามิกด้วย TSP Heuristic", suited: "คลังใหญ่ หลาย⫹", stars: 4 },
  { id: 15, g: "C", name: "Congestion Management", th: "จัดการความหนาแน่นจราจร", desc: "ตรวจจับ Traffic Jam จัดสรรเส้นทางสำรองอัตโนมัติ", suited: "พนักงาน+หุ่นยนต์ทำงานร่วมกัน", stars: 4 },
  { id: 16, g: "C", name: "Waveless Picking", th: "หยิบไม่มี Wave ล่วงหน้า", desc: "มอบ Pick Task ทันทีที่ Order เข้า ทำงานต่อเนื่อง", suited: "E-commerce / Same-day", stars: 3 },
  { id: 17, g: "D", name: "Autonomous Task Allocation", th: "มอบหมายงานอัตโนมัติ", desc: "จัดงานตามตำแหน่ง ทักษะ ระยะใกล้ ภาระงานปัจจุบัน", suited: "หุ่นยนต์+พนักงานผสม", stars: 4 },
  { id: 18, g: "D", name: "Dynamic Robot Allocation", th: "จัดสรร Robot แบบไดนามิก", desc: "ตาม Priority, Battery, ตำแหน่ง, เวลาที่คาดว่าจะเสร็จ", suited: "คลังมี Robot Fleet", stars: 5 },
  { id: 19, g: "D", name: "AI Workload Balancing", th: "สมดุลภาระงานด้วย AI", desc: "ป้องกัน Overload / Idle ระหว่างพนักงานและหุ่นยนต์", suited: "ต้องการ Efficiency สูง", stars: 4 },
  { id: 20, g: "D", name: "Dynamic Station Assignment", th: "มอบหมายสถานี Pack แบบไดนามิก", desc: "ตาม Capacity, Queue Length, Proximity", suited: "หลาย Pack Station", stars: 3 },
  { id: 21, g: "D", name: "Predictive Picking", th: "หยิบล่วงหน้าด้วยการพยากรณ์", desc: "วิเคราะห์ Order ที่กำลังจะเข้าจาก OMS Pipeline", suited: "Flash Sale / Pattern คาดเดาได้", stars: 5 },
  { id: 22, g: "E", name: "Dynamic Slotting Optimization", th: "จัดตำแหน่งสินค้าใหม่อัตโนมัติ", desc: "ตาม Velocity / Co-pick / น้ำหนัก / Ergonomics", suited: "Fast-Moving Mix SKU", stars: 4 },
  { id: 23, g: "E", name: "SKU Affinity Optimization", th: "จัดสินค้าที่หยิบร่วมกันไว้ใกล้", desc: "วิเคราะห์ Co-pick Affinity ลดระยะทางต่อ Order", suited: "Order Multi-SKU", stars: 3 },
  { id: 24, g: "E", name: "Intelligent Replenishment", th: "เติมสินค้าอัตโนมัติล่วงหน้า", desc: "คำนวณและสร้างงานเติมก่อนของหมดตาม Velocity+Forecast", suited: "คลังมี Bulk + Pick Location", stars: 3 },
  { id: 25, g: "E", name: "AI Cartonization", th: "เลือกขนาดกล่องด้วย AI", desc: "คำนึงขนาดสินค้า จำนวน ความเปราะบาง และ Dimensional Weight", suited: "Fulfillment / ลดต้นทุนขนส่ง", stars: 4 },
  { id: 26, g: "F", name: "Multi-Agent Warehouse Orchestration", th: "กำกับทุกระบบให้ประสานกัน", desc: "Robot, AMR, Conveyor, ASRS, Miniload, Sorter ทำงานร่วมกัน", suited: "คลัง Automation หลายระบบ", stars: 5 },
  { id: 27, g: "F", name: "Robot Fleet Optimization", th: "บริหาร Fleet หุ่นยนต์", desc: "Charging Schedule, Maintenance Alert, Collision Avoidance", suited: "คลังมี Robot/AMR หลายตัว", stars: 5 },
  { id: 28, g: "F", name: "Vision Picking", th: "ตรวจสอบด้วย Computer Vision", desc: "ตรวจ SKU จำนวน สภาพ Packaging และ Barcode เสียหาย", suited: "High Accuracy / FMCG", stars: 5 },
  { id: 29, g: "G", name: "Goods-to-Person (GTP)", th: "สินค้ามาหาพนักงาน", desc: "ผ่าน ASRS/Miniload/AMR พนักงานรอหยิบที่จุดเดิม", suited: "Mini Load / ASRS / GTP Robot", stars: 4 },
  { id: 30, g: "G", name: "Person-to-Goods (PTG)", th: "พนักงานเดินหาสินค้า", desc: "เดินตาม Pick List ผ่าน HHT/Wearable/Pick-to-Light", suited: "คลังทั่วไปแบบดั้งเดิม", stars: 2 },
  { id: 31, g: "G", name: "Hybrid Picking Strategy", th: "ผสม GTP + PTG", desc: "WMS เลือกกลยุทธ์อัตโนมัติต่อ SKU ในออเดอร์เดียวกัน", suited: "คลังมีทั้ง Manual และ Automation", stars: 4 },
  { id: 32, g: "G", name: "Cross-Docking Picking", th: "ผ่านคลังไม่จัดเก็บ", desc: "รับเข้า Dock แยกตาม Outbound แล้วส่งออกใน 24 ชม.", suited: "สินค้า Perishable / Transfer", stars: 3 },
  { id: 33, g: "H", name: "Waveless Continuous Fulfillment", th: "จัดส่งต่อเนื่อง 24 ชม.", desc: "ออก Task ทันทีที่ Order ยืนยัน ไม่มี Batch/Cut-off", suited: "E-commerce / 24-hr Fulfillment", stars: 4 },
  { id: 34, g: "H", name: "Real-Time Inventory Allocation", th: "จองสต็อกแบบเรียลไทม์", desc: "ป้องกัน Over-commit รองรับ Multi-channel พร้อมกัน", suited: "Multi-Channel Fulfillment", stars: 3 },
  { id: 35, g: "H", name: "Dynamic Order Consolidation", th: "รวมออเดอร์ปลา·ҧเดียวกัน", desc: "รวมหลายใบจากลูกค้า/ปลา·ҧเดียวกันเป็นการจัดส่งเดียว", suited: "B2B / Bulk Order", stars: 3 },
  { id: 36, g: "I", name: "Digital Twin Warehouse Optimization", th: "จำลองคลังแบบ 3D", desc: "ทดสอบกลยุทธ์ใหม่ใน Virtual Clone ก่อนใช้จริง", suited: "คลังใหญ่ / วางแผนขยาย", stars: 5 },
  { id: 37, g: "I", name: "AI Decision Engine", th: "สมองกลางตัดสินใจ", desc: "เลือกกลยุทธ์หยิบ จัดสรร Resource ตอบสนอง Exception", suited: "ต้องการ Autonomous Operation", stars: 5 },
  { id: 38, g: "I", name: "Autonomous Warehouse Execution (AWES)", th: "บริหารคลังไร้ผู้ควบคุม", desc: "Self-Healing ปรับ Parameter และจัดการ Exception เอง", suited: "Next-Gen Smart Warehouse", stars: 5 },
  { id: 39, g: "I", name: "Self-Learning Warehouse Optimization", th: "เรียนรู้และปรับปรุงต่อเนื่อง", desc: "เรียนรู้จาก Historical Data ยิ่งใช้นานยิ่งแม่นยำ", suited: "Continuous Improvement", stars: 5 },
];

let ITEMS = [
  { id: "6425011001", partId: "PT-011001", itemCode: "ITM-000101", brand: "ASUS", partNo: "NB-ASUS-X1504-15", name: "Notebook ASUS Vivobook 15 X1504", abc: "A", storage: "Rack", tixHi: "6x4", stickerRequired: true, dim: { l: 36, w: 26, h: 5, wt: 1.9 }, pack: { boxPerPallet: 24, piecePerPallet: 24, boxPerBasket: 4, piecePerBasket: 4 }, dailySales: 18 },
  { id: "6425011089", partId: "PT-011089", itemCode: "ITM-000102", brand: "Kingston", partNo: "SSD-KING-NV2-1TB", name: "SSD Kingston NV2 1TB NVMe", abc: "A", storage: "Bin", tixHi: "20x8", stickerRequired: true, dim: { l: 10, w: 8, h: 1.2, wt: 0.05 }, pack: { boxPerPallet: 160, piecePerPallet: 3200, boxPerBasket: 20, piecePerBasket: 400 }, dailySales: 65 },
  { id: "6425012207", partId: "PT-012207", itemCode: "ITM-000103", brand: "TP-Link", partNo: "RT-TPLINK-AX55", name: "Router TP-Link Archer AX55", abc: "A", storage: "Rack", tixHi: "8x5", stickerRequired: true, dim: { l: 28, w: 22, h: 9, wt: 0.6 }, pack: { boxPerPallet: 40, piecePerPallet: 40, boxPerBasket: 8, piecePerBasket: 8 }, dailySales: 22 },
  { id: "6425013320", partId: "PT-013320", itemCode: "ITM-000104", brand: "LG", partNo: "MON-LG-24MP60G", name: "Monitor LG 24MP60G-B 24\"", abc: "B", storage: "Floor", tixHi: "4x3", stickerRequired: false, dim: { l: 58, w: 12, h: 40, wt: 3.1 }, pack: { boxPerPallet: 12, piecePerPallet: 12, boxPerBasket: 0, piecePerBasket: 0 }, dailySales: 6 },
  { id: "6425014412", partId: "PT-014412", itemCode: "ITM-000105", brand: "Corsair", partNo: "RAM-CORS-VNG16-D5", name: "RAM Corsair Vengeance 16GB DDR5", abc: "A", storage: "Bin", tixHi: "25x10", stickerRequired: true, dim: { l: 14, w: 4, h: 1, wt: 0.03 }, pack: { boxPerPallet: 250, piecePerPallet: 5000, boxPerBasket: 25, piecePerBasket: 500 }, dailySales: 55 },
  { id: "6425015590", partId: "PT-015590", itemCode: "ITM-000106", brand: "APC", partNo: "UPS-APC-BX950", name: "UPS APC BX950MI-MS", abc: "B", storage: "Floor", tixHi: "5x4", stickerRequired: false, dim: { l: 32, w: 17, h: 22, wt: 5.4 }, pack: { boxPerPallet: 20, piecePerPallet: 20, boxPerBasket: 0, piecePerBasket: 0 }, dailySales: 3 },
  { id: "6425016678", partId: "PT-016678", itemCode: "ITM-000107", brand: "Logitech", partNo: "MSE-LOGI-M331", name: "เมาส์ Logitech M331 Silent", abc: "C", storage: "Bin", tixHi: "30x12", stickerRequired: true, dim: { l: 10, w: 6, h: 3.6, wt: 0.09 }, pack: { boxPerPallet: 360, piecePerPallet: 3600, boxPerBasket: 30, piecePerBasket: 300 }, dailySales: 90 },
  { id: "6425017766", partId: "PT-017766", itemCode: "ITM-000108", brand: "Canon", partNo: "PRT-CANON-G3010", name: "Printer Canon G3010", abc: "B", storage: "Rack", tixHi: "4x3", stickerRequired: false, dim: { l: 47, w: 33, h: 32, wt: 6.5 }, pack: { boxPerPallet: 12, piecePerPallet: 12, boxPerBasket: 0, piecePerBasket: 0 }, dailySales: 4 },
  { id: "6425018854", partId: "PT-018854", itemCode: "ITM-000109", brand: "Logitech", partNo: "CAM-LOGI-C270", name: "Webcam Logitech C270 HD", abc: "C", storage: "Bin", tixHi: "24x10", stickerRequired: true, dim: { l: 8, w: 7, h: 7, wt: 0.1 }, pack: { boxPerPallet: 240, piecePerPallet: 2400, boxPerBasket: 24, piecePerBasket: 240 }, dailySales: 70 },
  { id: "6425019942", partId: "PT-019942", itemCode: "ITM-000110", brand: "Seagate", partNo: "HDD-SEA-2TB-EXT", name: "External HDD Seagate 2TB", abc: "A", storage: "Bin", tixHi: "18x9", stickerRequired: true, dim: { l: 12, w: 8, h: 2, wt: 0.2 }, pack: { boxPerPallet: 162, piecePerPallet: 162, boxPerBasket: 18, piecePerBasket: 18 }, dailySales: 28 },
];

let PLANTS = [
  { id: "BKK1", erpCode: "1120", name: "Plant HQ · คลังกรุงเทพ 1 (บางนา)" },
  { id: "BKK2", erpCode: "1121", name: "Plant TKS · คลังกรุงเทพ 2 (ลาดกระบัง — Cross-Dock)" },
];
let FLOORS = [
  { id: "BKK1-1", plant: "BKK1", name: "ชั้น 1 · Pick Face / Fast-Moving" },
  { id: "BKK1-2", plant: "BKK1", name: "ชั้น 2 · Bulk Storage" },
  { id: "BKK1-MZ", plant: "BKK1", name: "Mezzanine · Miniload ASRS" },
  { id: "BKK2-1", plant: "BKK2", name: "ชั้น 1 · Cross-Dock Lane" },
];
// system: ASRS | Miniload | Manual — used to decide robot vs manual pick flow
let LOCATIONS = [
  { code: "A-03-12-B", plant: "BKK1", floor: "BKK1-1", zone: "A", type: "Rack", system: "Manual", capacity: 600, status: "AVL" },
  { code: "A-05-02-C", plant: "BKK1", floor: "BKK1-1", zone: "A", type: "Rack", system: "Manual", capacity: 800, status: "AVL" },
  { code: "A-08-05-C", plant: "BKK1", floor: "BKK1-1", zone: "A", type: "Rack", system: "Manual", capacity: 400, status: "AVL" },
  { code: "B-01-04-A", plant: "BKK1", floor: "BKK1-1", zone: "B", type: "Bin", system: "Miniload", capacity: 2000, status: "AVL" },
  { code: "B-01-07-D", plant: "BKK1", floor: "BKK1-1", zone: "B", type: "Bin", system: "Miniload", capacity: 1500, status: "AVL" },
  { code: "B-03-01-A", plant: "BKK1", floor: "BKK1-1", zone: "B", type: "Bin", system: "Miniload", capacity: 1800, status: "AVL" },
  { code: "C-02-01-A", plant: "BKK1", floor: "BKK1-2", zone: "C", type: "Floor", system: "Manual", capacity: 300, status: "AVL" },
  { code: "C-04-03-B", plant: "BKK1", floor: "BKK1-2", zone: "C", type: "Floor", system: "Manual", capacity: 250, status: "AVL" },
  { code: "D-01-01-A", plant: "BKK1", floor: "BKK1-2", zone: "D", type: "Bin", system: "Miniload", capacity: 3000, status: "AVL" },
  { code: "D-02-02-B", plant: "BKK1", floor: "BKK1-2", zone: "D", type: "Bin", system: "Miniload", capacity: 2600, status: "AVL" },
  { code: "MZ-01-01-A", plant: "BKK1", floor: "BKK1-MZ", zone: "MZ", type: "ASRS", system: "ASRS", capacity: 5000, status: "AVL" },
  { code: "X-QC-01", plant: "BKK1", floor: "BKK1-1", zone: "QC", type: "QC", system: "Manual", capacity: 100, status: "AVL" },
  { code: "CD-01-A", plant: "BKK2", floor: "BKK2-1", zone: "CD", type: "Staging", system: "Manual", capacity: 500, status: "AVL" },
  { code: "CD-02-B", plant: "BKK2", floor: "BKK2-1", zone: "CD", type: "Staging", system: "Manual", capacity: 500, status: "AVL" },
  { code: "RECV-DOCK", plant: "BKK1", floor: "BKK1-1", zone: "RECV", type: "Staging", system: "Manual", capacity: 9999, status: "AVL" },
  { code: "STAGING-QC", plant: "BKK1", floor: "BKK1-1", zone: "STG", type: "Staging", system: "Manual", capacity: 1800, status: "AVL" },
  { code: "PREWORK", plant: "BKK1", floor: "BKK1-1", zone: "PRE", type: "Prework Station", system: "Manual", capacity: 900, status: "AVL" },
  { code: "PICK-PACK", plant: "BKK1", floor: "BKK1-1", zone: "PACK", type: "Pack Station", system: "Manual", capacity: 1200, status: "AVL" },
];
let STATUS_LIST = [
  { code: "AVL", name: "Available", th: "พร้อมจ่ายออก", color: "var(--success)" },
  { code: "ALLOC", name: "Allocated", th: "จองสำหรับ Order แล้ว รอ Release", color: "var(--amber)" },
  { code: "PICKED", name: "Picked", th: "หยิบแล้ว รอส่ง Pack Station", color: "var(--success)" },
  { code: "PACKED", name: "Packed", th: "ปิดกล่องแล้ว รอ Ship ตัด Stock", color: "var(--teal)" },
  { code: "RESV", name: "Reserved", th: "กันสินค้า / เบิกยืม / ทดลอง / QC", color: "var(--amber)" },
  { code: "TRANSIT", name: "In Transfer", th: "กำลังย้ายข้าม Warehouse", color: "var(--teal)" },
  { code: "HOLD", name: "Quality Hold", th: "ระงับรอตรวจคุณภาพ", color: "var(--danger)" },
  { code: "QC", name: "Pending QC", th: "รอตรวจสอบก่อนรับเข้า", color: "var(--amber)" },
  { code: "DMG", name: "Damaged", th: "สินค้าเสียหาย จ่ายไม่ได้", color: "var(--danger)" },
  { code: "BLK", name: "Blocked", th: "ระงับ Location ชั่วคราว", color: "var(--danger)" },
];

let SIZE_GROUPS = [
  { code: "S", name: "Small", maxL: 15, maxW: 10, maxH: 8, maxWt: 0.5, color: "#3EC775", stickerSize: "S" },
  { code: "M", name: "Medium", maxL: 40, maxW: 30, maxH: 15, maxWt: 3, color: "#3E7EE0", stickerSize: "M" },
  { code: "L", name: "Large", maxL: 60, maxW: 45, maxH: 35, maxWt: 8, color: "#F5A83C", stickerSize: "L" },
  { code: "XL", name: "Extra Large", maxL: 120, maxW: 80, maxH: 80, maxWt: 30, color: "#F15B71", stickerSize: "L" },
];
const STICKER_STOCK_INIT = [
  { size: "S", rollId: "STK-S-240701", qty: 18000, loc: "PREWORK", lastIn: "2569-07-01" },
  { size: "M", rollId: "STK-M-240701", qty: 12000, loc: "PREWORK", lastIn: "2569-07-01" },
  { size: "L", rollId: "STK-L-240701", qty: 7600, loc: "PREWORK", lastIn: "2569-07-01" },
];

const SYNNEX_PROJECT_CODES = [
  { code: "990", type: "สินค้าพร้อมขาย", meaning: "Stock for Sale" },
  { code: "110", type: "งานโครงการ", meaning: "สินค้า/บริการ สำหรับงานโครงการ" },
  { code: "220", type: "Gift + ของแถม", meaning: "สินค้า Gift / ของแถม / ส่งเสริมการขาย" },
  { code: "330", type: "สินค้า Service", meaning: "สินค้าเพื่อการบริการ / ซ่อมแซม" },
];
const SYNNEX_SALES_CODES = [
  { code: "001", team: "Apple", example: "iPhone, iPad, Mac, Accessories" },
  { code: "002", team: "Huawei", example: "Smartphone, Tablet, Wearable" },
  { code: "003", team: "Samsung", example: "Mobile, Tablet, Accessories" },
  { code: "004", team: "Canon", example: "Camera, Lens, Printer" },
  { code: "005", team: "HP", example: "Notebook, Desktop, Printer" },
  { code: "099", team: "Other / อื่นๆ", example: "สินค้าอื่นๆ นอกเหนือจากข้างต้น" },
];
const formatSynnexId = (project, sales, item) => `${String(project).padStart(3, "0")}${String(sales).padStart(3, "0")}${String(item).padStart(4, "0")}`;
const prettySynnexId = (id) => `${String(id).slice(0, 3)}-${String(id).slice(3, 6)}-${String(id).slice(6, 10)}`;
const parseWmsDate = (value) => {
  const raw = String(value || "").trim();
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]) > 2400 ? Number(m[1]) - 543 : Number(m[1]);
  return new Date(Date.UTC(year, Number(m[2]) - 1, Number(m[3])));
};
const daysBetweenWmsDates = (fromDate, toDate) => {
  const from = parseWmsDate(fromDate);
  const to = parseWmsDate(toDate);
  if (!from || !to) return null;
  return Math.floor((to.getTime() - from.getTime()) / 86400000);
};
const receivingAgeRuleOf = (item) => ({
  minAgeDays: Number(item?.receiveMinAgeDays ?? item?.receivingAgeRule?.minAgeDays ?? 0),
  maxAgeDays: Number(item?.receiveMaxAgeDays ?? item?.receivingAgeRule?.maxAgeDays ?? 3650),
});
const receivingAgeCheck = (item, mfgDate, receiveDate) => {
  const ageDays = daysBetweenWmsDates(mfgDate, receiveDate);
  const rule = receivingAgeRuleOf(item);
  if (ageDays === null) return { ok: false, ageDays: null, rule, message: "กรุณาระบุวันที่รับเข้าและวันผลิตสินค้าให้ถูกต้อง" };
  if (ageDays < 0) return { ok: false, ageDays, rule, message: "วันผลิตสินค้าอยู่หลังวันที่รับเข้า ระบบรับสินค้าไม่ได้" };
  if (ageDays < rule.minAgeDays) return { ok: false, ageDays, rule, message: `อายุสินค้า ${ageDays} วัน ต่ำกว่าเงื่อนไขขั้นต่ำ ${rule.minAgeDays} วัน` };
  if (ageDays > rule.maxAgeDays) return { ok: false, ageDays, rule, message: `อายุสินค้า ${ageDays} วัน เกินเงื่อนไขรับเข้า ${rule.maxAgeDays} วัน` };
  return { ok: true, ageDays, rule, message: `อายุสินค้า ${ageDays} วัน ผ่านเงื่อนไขรับเข้า (${rule.minAgeDays}-${rule.maxAgeDays} วัน)` };
};
const stickerStateOfStock = (row) => {
  const item = itemOf(row?.itemId);
  if (!item?.stickerRequired) return { required: false, code: "N/A", label: "ไม่ต้องติด", ok: true };
  if (row?.stickerStatus === "DONE") return { required: true, code: "DONE", label: "ติดแล้ว", ok: true };
  if (row?.stickerStatus === "IN_PROGRESS") return { required: true, code: "IN_PROGRESS", label: "กำลังติด", ok: false };
  return { required: true, code: "PENDING", label: "ยังไม่ได้ติด", ok: false };
};
const stickerStatusBadge = (row) => {
  const s = stickerStateOfStock(row);
  const color = s.code === "DONE" ? "var(--success)" : s.code === "N/A" ? "var(--muted)" : s.code === "IN_PROGRESS" ? "var(--amber)" : "var(--danger)";
  return <span className="status-badge" style={{ background: color }}>{s.label}</span>;
};
const stickerSizeForItem = (item) => item?.stickerSize || sizeGroupOf(item).stickerSize || sizeGroupOf(item).code || "M";

// Current stock — now with LPN + age (days since received) for Aging / Hold reports
const STOCK_INIT = [
  { key: 1, itemId: "6425011001", batch: "LOT-1001-A", lpn: "LPN-000231", loc: "A-03-12-B", qty: 210, status: "AVL", age: 12, stickerStatus: "DONE" },
  { key: 2, itemId: "6425011001", batch: "LOT-1001-B", lpn: "LPN-000255", loc: "A-05-02-C", qty: 132, status: "AVL", age: 48, stickerStatus: "PENDING" },
  { key: 3, itemId: "6425011089", batch: "LOT-1089-A", lpn: "LPN-000310", loc: "B-01-04-A", qty: 980, status: "AVL", age: 5, stickerStatus: "DONE" },
  { key: 4, itemId: "6425011089", batch: "LOT-1089-A", lpn: "LPN-000311", loc: "MZ-01-01-A", qty: 300, status: "AVL", age: 9, stickerStatus: "PENDING" },
  { key: 5, itemId: "6425012207", batch: "LOT-2207-A", lpn: "LPN-000402", loc: "A-05-02-C", qty: 566, status: "AVL", age: 22, stickerStatus: "PENDING" },
  { key: 6, itemId: "6425013320", batch: "LOT-3320-A", lpn: "LPN-000501", loc: "C-02-01-A", qty: 128, status: "AVL", age: 96 },
  { key: 7, itemId: "6425014412", batch: "LOT-4412-A", lpn: "LPN-000610", loc: "B-01-07-D", qty: 700, status: "AVL", age: 3, stickerStatus: "DONE" },
  { key: 8, itemId: "6425014412", batch: "LOT-4412-B", lpn: "LPN-000611", loc: "D-01-01-A", qty: 240, status: "HOLD", age: 30, stickerStatus: "PENDING" },
  { key: 9, itemId: "6425015590", batch: "LOT-5590-A", lpn: "LPN-000705", loc: "C-04-03-B", qty: 87, status: "AVL", age: 145 },
  { key: 10, itemId: "6425016678", batch: "LOT-6678-A", lpn: "LPN-000811", loc: "D-01-01-A", qty: 2140, status: "AVL", age: 15, stickerStatus: "PENDING" },
  { key: 11, itemId: "6425017766", batch: "LOT-7766-A", lpn: "LPN-000905", loc: "A-08-05-C", qty: 64, status: "AVL", age: 180 },
  { key: 12, itemId: "6425018854", batch: "LOT-8854-A", lpn: "LPN-001002", loc: "D-02-02-B", qty: 1560, status: "AVL", age: 25, stickerStatus: "IN_PROGRESS" },
  { key: 13, itemId: "6425019942", batch: "LOT-9942-A", lpn: "LPN-001105", loc: "B-03-01-A", qty: 520, status: "AVL", age: 40, stickerStatus: "DONE" },
  { key: 14, itemId: "6425019942", batch: "LOT-9942-B", lpn: "LPN-001106", loc: "X-QC-01", qty: 200, status: "QC", age: 60, stickerStatus: "PENDING" },
];

const DOCKS = ["Dock-1", "Dock-2", "Dock-3"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const WEEK_DATES = ["2569-07-05", "2569-07-06", "2569-07-07", "2569-07-08", "2569-07-09", "2569-07-10", "2569-07-11"];

// status lifecycle: Booked -> Arrived -> Receiving -> Completed
const DOCK_SLOTS_INIT = [
  { id: "DK-0091", date: "2569-07-08", time: "08:00–09:00", dock: "Dock-1", supplier: "ASUSTeK Distribution", plate: "70-8812", status: "Arrived", poNumber: "PO-256907-121", invoiceNo: "INV-6607-0231", itemId: "6425011001", expQty: 210 },
  { id: "DK-0092", date: "2569-07-08", time: "09:00–10:00", dock: "Dock-3", supplier: "Western Digital (TH)", plate: "80-2231", status: "Booked", poNumber: "PO-256907-118", invoiceNo: "INV-6607-0455", itemId: "6425019942", expQty: 480 },
  { id: "DK-0093", date: "2569-07-08", time: "11:00–12:00", dock: "Dock-2", supplier: "Logitech Regional", plate: "70-4471", status: "Booked", poNumber: "PO-256907-126", invoiceNo: "INV-6607-0512", itemId: "6425016678", expQty: 960 },
  { id: "DK-0094", date: "2569-07-08", time: "13:00–14:00", dock: "Dock-3", supplier: "TP-Link Thailand", plate: "81-9902", status: "Booked", poNumber: "PO-256907-129", invoiceNo: "INV-6607-0588", itemId: "6425012207", expQty: 340 },
];

const PENDING_PO_INIT = [
  { po: "PO-256907-118", supplier: "Western Digital (TH)", itemId: "6425019942", expQty: 480, dock: "Dock-3", actualQty: null, remark: "", status: "Pending" },
  { po: "PO-256907-121", supplier: "ASUSTeK Distribution", itemId: "6425011001", expQty: 210, dock: "Dock-1", actualQty: null, remark: "", status: "Pending" },
  { po: "PO-256907-126", supplier: "Logitech Regional", itemId: "6425016678", expQty: 960, dock: "Dock-2", actualQty: null, remark: "", status: "Pending" },
  { po: "PO-256907-129", supplier: "TP-Link Thailand", itemId: "6425012207", expQty: 340, dock: "Dock-3", actualQty: null, remark: "", status: "Pending" },
];

const ALLOC_ORDERS_INIT = [
  { id: "SO-88213", customer: "IT City Co., Ltd.", priority: "VIP", channel: "B2B", route: "BKK-01", region: "Bangkok", salesSentAt: "2569-07-10 08:15", shipSeq: 1, items: [{ itemId: "6425011001", qty: 25 }, { itemId: "6425011089", qty: 40 }], status: "Pending" },
  { id: "SO-88250", customer: "Advice PC", priority: "Normal", channel: "B2B", route: "NORTH-02", region: "North", salesSentAt: "2569-07-10 09:05", shipSeq: 3, items: [{ itemId: "6425016678", qty: 200 }, { itemId: "6425018854", qty: 80 }], status: "Pending" },
  { id: "SO-88266", customer: "JIB Computer Group", priority: "SLA Risk", channel: "Shopee", route: "BKK-EXP", region: "Bangkok", salesSentAt: "2569-07-10 08:42", shipSeq: 2, items: [{ itemId: "6425014412", qty: 60 }], status: "Pending" },
  { id: "SO-88270", customer: "Banana IT", priority: "Normal", channel: "Lazada", route: "EAST-01", region: "East", salesSentAt: "2569-07-10 10:20", shipSeq: 4, items: [{ itemId: "6425012207", qty: 150 }, { itemId: "6425019942", qty: 30 }], status: "Pending" },
  { id: "SO-88310", customer: "Mega Online Flash Sale", priority: "SLA Risk", channel: "TikTok Shop", route: "BKK-EXP", region: "Bangkok", salesSentAt: "2569-07-10 10:35", shipSeq: 5, items: [{ itemId: "6425015590", qty: 500 }, { itemId: "6425017766", qty: 120 }], status: "Pending", note: "ตัวอย่างเคส Inventory not enough" },
];

const PICK_TASKS_INIT = [];

const SERIAL_UNITS_INIT = [
  { unitId: "UNIT-NB-0001", po: "PO-DEMO-001", sampleOrder: "SO-88213", itemId: "6425011001", level: "Piece", lpn: "LPN-PACK-NB-0001", boxBarcode: "CTN-NB-0001", sn: "SN-NB-ASUS-0001", imei: "IMEI-356789100000001", qty: 1, loc: "A-03-12-B", status: "Available" },
  { unitId: "UNIT-NB-0002", po: "PO-DEMO-001", sampleOrder: "SO-88213", itemId: "6425011001", level: "Piece", lpn: "LPN-PACK-NB-0002", boxBarcode: "CTN-NB-0002", sn: "SN-NB-ASUS-0002", imei: "IMEI-356789100000002", qty: 1, loc: "A-03-12-B", status: "Available" },
  { unitId: "UNIT-NB-0003", po: "PO-DEMO-001", sampleOrder: "SO-88213", itemId: "6425011001", level: "Piece", lpn: "LPN-PACK-NB-0003", boxBarcode: "CTN-NB-0003", sn: "SN-NB-ASUS-0003", imei: "IMEI-356789100000003", qty: 1, loc: "A-03-12-B", status: "Available" },
  { unitId: "UNIT-NB-0004", po: "PO-DEMO-001", sampleOrder: "SO-88213", itemId: "6425011001", level: "Piece", lpn: "LPN-PACK-NB-0004", boxBarcode: "CTN-NB-0004", sn: "SN-NB-ASUS-0004", imei: "IMEI-356789100000004", qty: 1, loc: "A-03-12-B", status: "Available" },
  { unitId: "UNIT-NB-0005", po: "PO-DEMO-001", sampleOrder: "SO-88213", itemId: "6425011001", level: "Piece", lpn: "LPN-PACK-NB-0005", boxBarcode: "CTN-NB-0005", sn: "SN-NB-ASUS-0005", imei: "IMEI-356789100000005", qty: 1, loc: "A-03-12-B", status: "Available" },
  { unitId: "BOX-M331-001", po: "PO-DEMO-002", sampleOrder: "SO-88250", itemId: "6425016678", level: "Box", lpn: "LPN-PACK-M331-001", boxBarcode: "CTN-M331-001", sn: "BOX-M331-001", imei: "", qty: 24, loc: "D-01-01-A", status: "Available" },
  { unitId: "BOX-M331-002", po: "PO-DEMO-002", sampleOrder: "SO-88250", itemId: "6425016678", level: "Box", lpn: "LPN-PACK-M331-002", boxBarcode: "CTN-M331-002", sn: "BOX-M331-002", imei: "", qty: 24, loc: "D-01-01-A", status: "Available" },
  { unitId: "BOX-M331-003", po: "PO-DEMO-002", sampleOrder: "SO-88250", itemId: "6425016678", level: "Box", lpn: "LPN-PACK-M331-003", boxBarcode: "CTN-M331-003", sn: "BOX-M331-003", imei: "", qty: 24, loc: "D-01-01-A", status: "Available" },
  { unitId: "PALLET-RAM-001", po: "PO-DEMO-003", sampleOrder: "SO-88266", itemId: "6425014412", level: "Pallet", lpn: "LPN-PACK-RAM-001", boxBarcode: "PLT-RAM-001", sn: "PLT-RAM-DDR5-001", imei: "", qty: 60, loc: "B-01-07-D", status: "Available" },
  { unitId: "BOX-AX55-001", po: "PO-DEMO-004", sampleOrder: "SO-88270", itemId: "6425012207", level: "Box", lpn: "LPN-PACK-AX55-001", boxBarcode: "CTN-AX55-001", sn: "BOX-AX55-001", imei: "", qty: 12, loc: "A-05-02-C", status: "Available" },
  { unitId: "BOX-AX55-002", po: "PO-DEMO-004", sampleOrder: "SO-88270", itemId: "6425012207", level: "Box", lpn: "LPN-PACK-AX55-002", boxBarcode: "CTN-AX55-002", sn: "BOX-AX55-002", imei: "", qty: 12, loc: "A-05-02-C", status: "Available" },
];

const CARRIERS = [
  { name: "Kerry Express", cost: 42, speed: "Next-day", sla: 98.2 },
  { name: "Flash Express", cost: 38, speed: "Next-day", sla: 96.5 },
  { name: "DHL eCommerce", cost: 65, speed: "Same-day", sla: 99.1 },
  { name: "ไปรษณีย์ไทย EMS", cost: 33, speed: "2-day", sla: 94.8 },
];

const SYSTEMS = [
  { name: "ASRS Controller", vendor: "Daifuku", icon: Boxes },
  { name: "Miniload ASRS", vendor: "Kardex", icon: Boxes },
  { name: "RFID Gate", vendor: "Impinj Reader", icon: Radio },
  { name: "Auto Picking Arm", vendor: "Robotic Cobot", icon: Bot },
  { name: "Auto Packing Line", vendor: "CVP Everest", icon: Package },
  { name: "OMS", vendor: "Order Mgmt", icon: PackageSearch },
  { name: "TMS", vendor: "Transport Mgmt", icon: Truck },
  { name: "ERP", vendor: "SAP S/4HANA", icon: Database },
  { name: "WCS / WES", vendor: "Control Layer", icon: ListTree },
  { name: "Robot Fleet (AMR)", vendor: "Fleet Controller", icon: Bot },
];

const MODES = [
  { id: "general", label: "General Warehouse", th: "คลังทั่วไป" },
  { id: "fulfillment", label: "Fulfillment Center", th: "ศูนย์จัดส่ง E-commerce" },
  { id: "crossdock", label: "Cross-Dock", th: "ผ่านคลังไม่จัดเก็บ" },
];

// -- Order by Platform (B2B / B2C) --
const AREAS = ["กรุงเทพฯ & นนทบุรี", "ภาคกลาง", "ภาคตะวันออก", "ภาคเหนือ", "ภาคใต้", "ภาคอีสาน"];
function genPlatformOrders() {
  const platforms = ["Lazada", "Shopee", "TikTok Shop", "B2B"];
  const statuses = ["รอจัดสรร", "กำลังแพ็ค", "จัดส่งแล้ว", "สำเร็จ"];
  const out = [];
  let n = 1;
  for (let d = 1; d <= 31; d++) {
    const day = `2569-07-${String(d).padStart(2, "0")}`;
    let count;
    if (d % 7 === 0) count = rand(24, 34); // periodic campaign / payday spike — heavy
    else if (d % 5 === 0) count = rand(14, 20); // medium-high
    else if (d % 3 === 0) count = rand(2, 6); // quiet day
    else count = rand(7, 13); // normal
    for (let i = 0; i < count; i++) {
      out.push({
        id: `ORD-${String(30000 + n).padStart(6, "0")}`,
        platform: pick(platforms),
        customer: pick(["คุณสมชาย", "IT City", "คุณนภา", "Advice PC", "คุณกิตติ", "JIB Computer", "คุณวรรณา"]),
        area: pick(AREAS),
        items: rand(1, 6),
        cube: +(rand(2, 40) / 100).toFixed(2),
        status: d <= 8 ? "สำเร็จ" : pick(statuses),
        date: day,
        slot: pick(["12:00", "16:00"]),
      });
      n++;
    }
  }
  return out;
}
const PLATFORM_ORDERS_INIT = genPlatformOrders();

// -- Productivity / Users --
const USERS_INIT = [
  { id: "EMP-101", name: "สมชาย ใจดี", role: "Receiving", linesPerHour: 145, accuracy: 99.2, tasksToday: 62 },
  { id: "EMP-102", name: "สุดา พงษ์ไพร", role: "Putaway", linesPerHour: 120, accuracy: 98.7, tasksToday: 48 },
  { id: "EMP-103", name: "วิชัย ทองดี", role: "Picking", linesPerHour: 210, accuracy: 99.5, tasksToday: 130 },
  { id: "EMP-104", name: "อรุณี แสงทอง", role: "Picking", linesPerHour: 185, accuracy: 98.9, tasksToday: 110 },
  { id: "EMP-105", name: "ประยุทธ ศรีสุข", role: "Packing", linesPerHour: 95, accuracy: 99.8, tasksToday: 80 },
  { id: "EMP-106", name: "มาลี รักงาน", role: "Packing", linesPerHour: 88, accuracy: 99.1, tasksToday: 75 },
  { id: "EMP-107", name: "ธนกร ไพศาล", role: "Receiving", linesPerHour: 130, accuracy: 97.9, tasksToday: 55 },
  { id: "EMP-108", name: "กมลชนก บุญมี", role: "Putaway", linesPerHour: 105, accuracy: 98.2, tasksToday: 40 },
  { id: "EMP-109", name: "ณัฐพล เจริญสุข", role: "Picking", linesPerHour: 160, accuracy: 97.5, tasksToday: 95 },
  { id: "EMP-110", name: "ปวีณา ศรีวงศ์", role: "Packing", linesPerHour: 102, accuracy: 99.4, tasksToday: 70 },
];

// -- Sticker / Prework tasks --
const STICKER_SOURCES = ["Inbound Staging", "ASRS", "Onfloor", "Putaway Staging"];
const STICKER_MACHINES = Array.from({ length: 7 }, (_, i) => `เครื่อง ${i + 1}`);
const STICKER_TASKS_INIT = [
  { id: "PW-2001", order: "SO-88213", itemId: "6425011001", qtyRequired: 25, qtyDone: 25, source: "Inbound Staging", machineNo: "เครื่อง 1", workDate: "2569-07-10", status: "Completed", note: "ติดสติกเกอร์ QR รับประกันสินค้า" },
  { id: "PW-2002", order: "SO-88250", itemId: "6425016678", qtyRequired: 200, qtyDone: 120, source: "ASRS", machineNo: "เครื่อง 3", workDate: "2569-07-10", status: "In Machine", note: "ติดสติกเกอร์ราคาโปรโมชั่น" },
  { id: "PW-2003", order: "SO-88266", itemId: "6425014412", qtyRequired: 60, qtyDone: 0, source: "Putaway Staging", machineNo: "เครื่อง 5", workDate: "2569-07-10", status: "Called", note: "พันฟิล์มกันรอย + ติดป้ายรุ่น" },
  { id: "PW-2004", order: "SO-88270", itemId: "6425012207", qtyRequired: 150, qtyDone: 150, source: "ASRS", machineNo: "เครื่อง 2", workDate: "2569-07-09", status: "Completed", note: "ติดสติกเกอร์ Serial ภาษาไทย" },
  { id: "PW-2005", order: "SO-88291", itemId: "6425018854", qtyRequired: 80, qtyDone: 35, source: "Inbound Staging", machineNo: "เครื่อง 7", workDate: "2569-07-08", status: "In Machine", note: "ติดสติกเกอร์คู่มือย่อภาษาไทย" },
];

// -- Returns Management --
const RETURN_REASONS = ["สินค้าเสียหาย", "ส่งสินค้าผิด", "ลูกค้าเปลี่ยนใจ", "สินค้าไม่ตรงสเปค", "สินค้าหมดอายุ/ใกล้หมดอายุ"];
const RETURN_STEPS = ["รับเรื่อง", "ตรวจสอบสภาพ", "Grade สินค้า", "Restock / Scrap", "เสร็จสิ้น"];
const RETURN_PICKUP_STEPS = ["CS เปิดรับคืน", "ส่งงานให้ขนส่ง", "ขนส่งไปรับของ", "กำลังกลับคลัง", "ถึงคลัง/รอตรวจรับ"];
const RETURN_TX_FLOW = [
  { key: "cs_open", phase: "CS", activity: "เปิด Ticket รับคืน", loc: "Customer Service", offset: "08:30" },
  { key: "carrier_assign", phase: "Logistics", activity: "ส่งงานให้ขนส่งไปรับของ", loc: "Carrier Dispatch", offset: "09:05" },
  { key: "pickup", phase: "Logistics", activity: "ขนส่งรับสินค้าจากลูกค้า", loc: "Customer Site", offset: "11:20" },
  { key: "in_transit", phase: "Logistics", activity: "ขนส่งกำลังกลับคลัง", loc: "In Transit", offset: "13:10" },
  { key: "warehouse_arrive", phase: "Warehouse", activity: "สินค้ากลับถึงคลัง / เข้า Return Staging", loc: "RETURN-STAGING", offset: "15:00" },
  { key: "inspect", phase: "Returns", activity: "ตรวจสอบสภาพสินค้า", loc: "RETURN-QC", offset: "15:35" },
  { key: "grade", phase: "Returns", activity: "Grade สินค้า", loc: "RETURN-QC", offset: "16:05" },
  { key: "decision", phase: "Inventory", activity: "Restock / Scrap Decision", loc: "X-QC-01", offset: "16:35" },
  { key: "close", phase: "System", activity: "ปิดกระบวนการรับคืน", loc: "WMS", offset: "16:50" },
];
const RECEIVING_STEPS = ["นัดหมาย", "รถถึงคลัง", "ตรวจเอกสาร/ASN", "รับสินค้า", "พิมพ์ LPN", "รอ Putaway"];
const RETURN_TICKETS_INIT = [
  { id: "RT-3001", order: "SO-88190", itemId: "6425011001", qty: 2, reason: "สินค้าเสียหาย", photo: null, video: null, pickupStep: 4, carrier: "Kerry Express", trackingNo: "RET-KEX-3001", step: 4, grade: "C", decision: "Scrap", note: "จอแตกจากการขนส่ง", date: "2569-07-03" },
  { id: "RT-3002", order: "SO-88205", itemId: "6425016678", qty: 5, reason: "ลูกค้าเปลี่ยนใจ", photo: null, video: null, pickupStep: 4, carrier: "Flash Express", trackingNo: "RET-FLH-3002", step: 4, grade: "A", decision: "Restock", note: "สภาพสมบูรณ์ ไม่เปิดกล่อง", date: "2569-07-04" },
  { id: "RT-3003", order: "SO-88240", itemId: "6425014412", qty: 10, reason: "ส่งสินค้าผิด", photo: null, video: null, pickupStep: 3, carrier: "DHL eCommerce", trackingNo: "RET-DHL-3003", step: 0, grade: null, decision: null, note: "", date: "2569-07-07" },
  { id: "RT-3004", order: "SO-88261", itemId: "6425018854", qty: 3, reason: "สินค้าไม่ตรงสเปค", photo: null, video: null, pickupStep: 2, carrier: "Kerry Express", trackingNo: "RET-KEX-3004", step: 0, grade: null, decision: null, note: "", date: "2569-07-08" },
];

// -- Customer Service Cases --
const ISSUE_TYPES = [
  { label: "ส่งขาด (Short Ship)", kpi: "InFull" },
  { label: "ส่งเกิน (Over Ship)", kpi: "InFull" },
  { label: "ส่งไม่ครบ (Incomplete)", kpi: "InFull" },
  { label: "ผิดรุ่น (Wrong Model)", kpi: "InFull" },
  { label: "ผิดสี (Wrong Color)", kpi: "InFull" },
  { label: "ผิดจำนวน (Wrong Qty)", kpi: "InFull" },
  { label: "ชำรุดเสียหาย (Damaged)", kpi: "InFull" },
  { label: "จัดส่งล่าช้า (Late Delivery)", kpi: "OnTime" },
  { label: "สินค้าสูญหาย (Lost in Transit)", kpi: "OnTime" },
];
const FAULT_OWNERS = ["Warehouse", "Carrier", "Pending Investigation"];
const SLA_TARGET = 99.98;

function seedCsCases() {
  const customers = ["IT City Co.", "Advice PC", "JIB Computer", "Banana IT", "คุณสมชาย", "คุณนภา"];
  const out = [];
  let n = 1;
  for (let d = 1; d <= 31; d++) {
    const day = `2569-07-${String(d).padStart(2, "0")}`;
    const cnt = rand(0, 4);
    for (let i = 0; i < cnt; i++) {
      const issue = pick(ISSUE_TYPES);
      out.push({
        id: `CS-${String(4000 + n).padStart(5, "0")}`,
        date: day, so: `SO-8${rand(8000, 8999)}`, po: `PO-2569${rand(5, 7)}-${rand(100, 999)}`, invoice: `INV-6607-${rand(1000, 9999)}`,
        customer: pick(customers), itemId: pick(ITEMS).id, issueType: issue.label, kpiImpact: issue.kpi,
        faultOwner: issue.kpi === "OnTime" ? "Carrier" : pick(["Warehouse", "Carrier"]),
        qty: rand(1, 8), note: "", status: d <= 25 ? "ปิดเคส" : pick(["เปิดเคส", "กำลังตรวจสอบ", "ปิดเคส"]),
      });
      n++;
    }
  }
  return out;
}
const CS_CASES_INIT = seedCsCases();

// -- Inventory Cycle Count (blind count via Handheld) --
const CYCLE_COUNT_INIT = [
  { id: "CC-9001", loc: "A-03-12-B", itemId: "6425011001", batch: "LOT-1001-A", expectedQty: 210, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9002", loc: "B-01-04-A", itemId: "6425011089", batch: "LOT-1089-A", expectedQty: 980, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9003", loc: "A-05-02-C", itemId: "6425012207", batch: "LOT-2207-A", expectedQty: 566, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9004", loc: "C-02-01-A", itemId: "6425013320", batch: "LOT-3320-A", expectedQty: 128, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9005", loc: "B-01-07-D", itemId: "6425014412", batch: "LOT-4412-A", expectedQty: 700, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9006", loc: "D-01-01-A", itemId: "6425016678", batch: "LOT-6678-A", expectedQty: 2140, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9007", loc: "D-02-02-B", itemId: "6425018854", batch: "LOT-8854-A", expectedQty: 1560, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
  { id: "CC-9008", loc: "B-03-01-A", itemId: "6425019942", batch: "LOT-9942-A", expectedQty: 520, countedQty: null, status: "รอนับ", variance: null, countedBy: null, adjusted: false },
];

// -- Replenishment rules (Min-Max per pick location) --
const REPLENISH_STRATEGIES = ["Min-Max Trigger", "Manual Request", "Demand Forecast"];
const REPLENISH_RULES_INIT = [
  { id: "RP-01", itemId: "6425016678", pickLoc: "D-01-01-A", min: 500, max: 3000, sourceLoc: "B-03-01-A", strategy: "Min-Max Trigger" },
  { id: "RP-02", itemId: "6425011089", pickLoc: "MZ-01-01-A", min: 250, max: 1500, sourceLoc: "B-01-04-A", strategy: "Min-Max Trigger" },
  { id: "RP-03", itemId: "6425015590", pickLoc: "C-04-03-B", min: 100, max: 150, sourceLoc: "A-08-05-C", strategy: "Min-Max Trigger" },
  { id: "RP-04", itemId: "6425018854", pickLoc: "D-02-02-B", min: 800, max: 2500, sourceLoc: "B-01-07-D", strategy: "Demand Forecast" },
  { id: "RP-05", itemId: "6425017766", pickLoc: "A-08-05-C", min: 80, max: 200, sourceLoc: "C-02-01-A", strategy: "Manual Request" },
];

const NAV_GROUPS = [
  {
    header: "Data & Analytics Report", items: [
      { id: "overview", label: "Dashboard", icon: LayoutGrid },
      { id: "orders", label: "Order by Platform (B2B/B2C)", icon: ShoppingBag },
      { id: "inboundsummary", label: "Total Inbound Summary", icon: ScanLine },
      { id: "outboundsummary", label: "Total Outbound Summary", icon: Truck },
      { id: "externalwh", label: "External Warehouse Dashboard", icon: Warehouse },
      { id: "salestracking", label: "Sales Order Tracking", icon: Route },
      { id: "warehouse3d", label: "3D Warehouse Space", icon: Box },
      { id: "recall", label: "Total Recall Product", icon: RefreshCw },
      { id: "recallprework", label: "Total Recall Prework", icon: Tags },
      { id: "people", label: "Productivity Dashboard", icon: Users },
      { id: "rodocs", label: "RO / RI Billing", icon: FileText },
    ]
  },
  {
    header: "Operation Workflow", items: [
      { id: "appointment", label: "1. จองพื้นที่จัดส่ง", icon: CalendarClock },
      { id: "receiving", label: "2. รับสินค้า", icon: ScanLine },
      { id: "putaway", label: "3. Putaway & Move", icon: ArrowDownToLine },
      { id: "prework", label: "4. สติ๊กเกอร์ / Prework", icon: Tags },
      { id: "replenishment", label: "5. Replenishment", icon: RefreshCw },
      { id: "allocation", label: "6. Allocation Order", icon: ClipboardList },
      { id: "pickops", label: "7. Picking Handheld / Web", icon: Smartphone },
      { id: "console", label: "8. Console Order", icon: ArrowLeftRight },
      { id: "packing", label: "9. Packing", icon: Package },
      { id: "shipping", label: "10. Shipping", icon: Truck },
      { id: "workorders", label: "11. Transfer / Reservation / Check Stock", icon: ClipboardList },
    ]
  },
  {
    header: "Inventory", items: [
      { id: "inventory", label: "1. Inventory Transaction", icon: Boxes },
      { id: "cyclecount", label: "2. Cycle Count", icon: ClipboardCheck },
      { id: "invhold", label: "3. Inventory Overview", icon: Boxes },
      { id: "aging", label: "4. Aging", icon: Clock },
      { id: "cover", label: "5. Stock Cover Day", icon: TrendingUp },
    ]
  },
  {
    header: "Returns & Customer Service", items: [
      { id: "returns", label: "รับคืนสินค้า", icon: Undo2 },
      { id: "cs", label: "Customer Service Case", icon: Headphones },
    ]
  },
  {
    header: "Master Data & System", items: [
      { id: "master", label: "ข้อมูลหลัก", icon: Database },
      { id: "integrations", label: "Integration Status", icon: Radio },
      { id: "picking", label: "กลยุทธ์การหยิบ (39)", icon: ListTree },
      { id: "dispatch", label: "Dispatch Planning", icon: Route },
      { id: "ai", label: "AI Decision Log", icon: BrainCircuit },
    ]
  },
];
const STAGES = ["Receiving", "Put-away", "Picking", "Packing", "Shipping"];

/* ================================================================== */
/* HELPERS                                                              */
/* ================================================================== */

const itemOf = (id) => ITEMS.find((i) => i.id === id);
const locOf = (code) => LOCATIONS.find((l) => l.code === code);
const statusOf = (code) => STATUS_LIST.find((s) => s.code === code) || STATUS_LIST[0];
const floorOf = (id) => FLOORS.find((f) => f.id === id);
const plantOf = (id) => PLANTS.find((p) => p.id === id);
const plantLabelOf = (id) => {
  const p = plantOf(id);
  return p ? `${p.erpCode} ${p.name}` : id || "-";
};
const navLabelOf = (view) => NAV_GROUPS.flatMap((g) => g.items).find((n) => n.id === view)?.label || view;
const escapeHtml = (v) => String(v ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const downloadBlob = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
const rowsToExcel = (rows, sheetName, fileName) => {
  const safeRows = rows.length ? rows : [{ Message: "No data" }];
  const headers = Object.keys(safeRows[0]);
  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${safeRows.map((r) => `<tr>${headers.map((h) => `<td>${escapeHtml(r[h])}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
  downloadBlob(html, `${fileName}.xls`, "application/vnd.ms-excel;charset=utf-8");
};
const getBacklog24h = ({ poList = [], allocOrders = [], pickTasks = [], stock = [], returnTickets = [], platformOrders = [] }) => {
  const receivedWaitingPutaway = stock.filter((r) => ["RECV-DOCK", "STAGING-QC"].includes(r.loc) || ["QC"].includes(r.status));
  const pickedWaitingPack = stock.filter((r) => r.status === "PICKED" || r.loc === "PICK-PACK");
  const openOrders = platformOrders.filter((o) => !statusHas(o.status, "สำเร็จ", "สำเร็จ") && !statusHas(o.status, "จัดส่ง", "จัดส่ง"));
  const rows = [
    { stage: "Inbound / Receiving", count: poList.filter((p) => p.status !== "Completed").length, owner: "WH Inbound", slaHours: 24, tone: "blue" },
    { stage: "QC / Putaway Staging", count: receivedWaitingPutaway.length, owner: "WH Putaway", slaHours: 24, tone: "cyan" },
    { stage: "Allocation Backlog", count: allocOrders.filter((o) => ["Pending", "Backorder"].includes(o.status)).length, owner: "Planning", slaHours: 24, tone: "amber" },
    { stage: "Picking Backlog", count: pickTasks.filter((t) => t.status !== "Completed").length, owner: "WH Picking", slaHours: 24, tone: "green" },
    { stage: "Pack / Ship Backlog", count: pickedWaitingPack.length + openOrders.filter((o) => statusHas(o.status, "แพ็ค", "pack")).length, owner: "WH Packing", slaHours: 24, tone: "violet" },
    { stage: "Return Backlog", count: returnTickets.filter((t) => t.step < 4).length, owner: "Returns", slaHours: 24, tone: "rose" },
  ];
  return rows.map((r, idx) => {
    const ageHours = r.count === 0 ? 0 : Math.min(36, 8 + idx * 3 + r.count * 2);
    return { ...r, ageHours, within24: ageHours <= 24 ? r.count : 0, over24: ageHours > 24 ? r.count : 0 };
  });
};
const getExportRows = (view, ctx) => {
  const stockRows = () => (ctx.stock || []).map((r) => {
    const item = itemOf(r.itemId) || {};
    const loc = locOf(r.loc) || {};
    return {
      LPN: r.lpn || "",
      SYNNEX_ID: r.itemId || "",
      Item_ID: item.itemCode || "",
      Part_ID: item.partId || "",
      Part_No: item.partNo || "",
      Item_Name: item.name || "",
      Brand: item.brand || "",
      Sticker_Required: item.stickerRequired ? "Y" : "N",
      Sticker_Status: stickerStateOfStock(r).label,
      ABC_Class: item.abc || "",
      Size_Group: sizeGroupOf(item).code || "",
      Lot: r.batch || "",
      Location: r.loc || "",
      Plant: loc.plant || "",
      Floor: loc.floor || "",
      Zone: loc.zone || "",
      Location_Type: loc.type || "",
      Storage_System: loc.system || "",
      Qty: r.qty || 0,
      Pallet_Pcs: item.pack?.piecePerPallet || "",
      Basket_Pcs: item.pack?.piecePerBasket || "",
      Status_Code: r.status || "",
      Status_Name: statusOf(r.status)?.name || "",
      Age_Days: r.age || 0,
      Allocated_For: r.allocatedFor || "",
    };
  });
  const orderRows = () => (ctx.platformOrders || []).map((o) => ({ Date: o.date, Order: o.id, Platform: o.platform, Status: o.status, Items: o.items, Cube_CBM: o.cube, Customer: o.customer || "" }));
  const poRows = () => (ctx.poList || []).map((p) => ({ PO: p.po, Supplier: p.supplier, SYNNEX_ID: p.itemId, Item_Name: itemOf(p.itemId)?.name, Expected_Qty: p.expQty, Actual_Qty: p.actualQty ?? "", Dock: p.dock, Status: p.status, Remark: p.remark }));
  const pickRows = () => (ctx.pickTasks || []).map((t) => ({ Pick_Task: t.id, Order: t.order, SYNNEX_ID: t.itemId, Item_Name: itemOf(t.itemId)?.name, Qty: t.qty, Location: t.loc, Strategy: t.strategy, Status: t.status, Assignee: t.assignee }));
  const txRows = () => (ctx.txLog || []).map((t) => {
    const synnexId = t.synnexId || t.itemId || "";
    const item = itemOf(synnexId) || {};
    return {
      Timestamp: new Date(t.t).toLocaleString("th-TH"),
      Activity_Type: t.type || "",
      LPN: t.lpn || "",
      SYNNEX_ID: synnexId,
      Item_ID: item.itemCode || "",
      Part_ID: item.partId || "",
      Part_No: item.partNo || "",
      Item_Name: item.name || "",
      Brand: item.brand || t.brand || "",
      Lot: t.lot || "",
      From_Location: t.fromLoc || "",
      To_Location: t.toLoc || t.loc || "",
      Current_Location: t.loc || t.toLoc || "",
      Order_ID: t.orderId || "",
      User: t.user || "",
      Detail: t.detail || "",
    };
  });
  const returnRows = () => (ctx.returnTickets || []).map((t) => ({ Ticket: t.id, Date: t.date, SO: t.so || t.order || "", SYNNEX_ID: t.itemId || "", Item_Name: itemOf(t.itemId)?.name || t.item || "", Qty: t.qty, Reason: t.reason, Step: t.step, Decision: t.decision || "", Pickup_Status: t.pickupStatus || "" }));
  const csRows = () => (ctx.csCases || []).map((c) => ({ Case: c.id, Date: c.date, SO: c.so, Customer: c.customer, SYNNEX_ID: c.itemId || "", Item_Name: itemOf(c.itemId)?.name || "", Issue: c.issueType, KPI: c.kpiImpact, Owner: c.faultOwner, Qty: c.qty, Status: c.status, Return_Ticket: c.returnTicketId || "" }));
  const backlogRows = () => getBacklog24h(ctx).map((r) => ({ Stage: r.stage, Owner: r.owner, Backlog: r.count, Within_24h: r.within24, Over_24h: r.over24, Max_Age_Hours: r.ageHours, SLA_Hours: r.slaHours }));
  const summaryRows = () => [
    ...backlogRows(),
    { Stage: "Total Stock", Owner: "Inventory", Backlog: (ctx.stock || []).reduce((a, r) => a + r.qty, 0), Within_24h: "", Over_24h: "", Max_Age_Hours: "", SLA_Hours: "" },
    { Stage: "Open Orders", Owner: "Outbound", Backlog: (ctx.platformOrders || []).filter((o) => !statusHas(o.status, "สำเร็จ", "สำเร็จ") && !statusHas(o.status, "จัดส่ง", "จัดส่ง")).length, Within_24h: "", Over_24h: "", Max_Age_Hours: "", SLA_Hours: "" },
  ];
  const map = {
    overview: summaryRows, orders: orderRows, inboundsummary: poRows, outboundsummary: orderRows, appointment: () => ctx.dockSlots || [],
    receiving: poRows, putaway: stockRows, inventory: txRows, cyclecount: () => ctx.cycleCounts || [], replenishment: () => ctx.replenishRules || [],
    allocation: () => (ctx.allocOrders || []).map((o) => ({ Order: o.id, Customer: o.customer, Priority: o.priority, Status: o.status, Lines: (o.items || o.lines || []).length })),
    picking: summaryRows, pickops: pickRows,
    console: () => (ctx.allocOrders || []).flatMap((o) => (o.lines || []).flatMap((l) => (l.sources || []).map((s) => ({ Order: o.id, Customer: o.customer, SYNNEX_ID: l.itemId, Item_Name: itemOf(l.itemId)?.name, Qty: s.qty, From_Location: s.loc, From_Floor: floorOf(locOf(s.loc)?.floor)?.name || locOf(s.loc)?.floor || "", Target_Location: "PICK-PACK", Target_Floor: floorOf(locOf("PICK-PACK")?.floor)?.name || "ชั้น 1", System: s.system, Released: s.released ? "Y" : "N" })))),
    packing: () => [...stockRows().filter((r) => ["PICKED", "PACKED"].includes(r.Status_Code)), ...pickRows()],
    prework: () => ctx.stickerTasks || [], returns: returnRows, cs: csRows, warehouse3d: stockRows, invhold: stockRows, aging: stockRows, cover: stockRows,
    recall: stockRows, people: () => ctx.users || [], integrations: summaryRows, dispatch: orderRows, ai: () => ctx.aiLog || [],
    master: () => ITEMS.map((i) => ({ SYNNEX_ID: i.id, Item_Code: i.itemCode, Name: i.name, Brand: i.brand, Size: i.sizeClass, Pack_Key: i.packKey })),
  };
  return (map[view] || summaryRows)();
};
const txDateFromAge = (age, hour = 8, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - (Number(age) || 0));
  d.setHours(hour, minute, 0, 0);
  return d;
};
const seedStockTimeline = () => STOCK_INIT.flatMap((r) => {
  const item = itemOf(r.itemId);
  const receiveTime = txDateFromAge(r.age, 8, 15);
  const qcTime = txDateFromAge(Math.max((Number(r.age) || 0) - 1, 0), 9, 20);
  const putawayTime = txDateFromAge(Math.max((Number(r.age) || 0) - 1, 0), 10, 30);
  const stagingLoc = r.status === "QC" ? "STAGING-QC" : "RECV-DOCK";
  return [
    { t: receiveTime, type: "Receive", user: "seed", detail: `${r.lpn}: รับเข้า ${item?.name} ${r.qty} หน่วย เข้า Staging Area ${stagingLoc}`, itemId: r.itemId, synnexId: r.itemId, brand: item?.brand || "", lpn: r.lpn, lot: r.batch, fromLoc: "INBOUND-DOCK", toLoc: stagingLoc, loc: stagingLoc },
    { t: qcTime, type: r.status === "QC" ? "QC Hold" : "QC Pass", user: "seed", detail: `${r.lpn}: ตรวจรับ/QC ที่ ${stagingLoc} ก่อน Putaway`, itemId: r.itemId, synnexId: r.itemId, brand: item?.brand || "", lpn: r.lpn, lot: r.batch, fromLoc: stagingLoc, toLoc: stagingLoc, loc: stagingLoc },
    { t: putawayTime, type: "Putaway", user: "seed", detail: `${r.lpn}: Putaway จาก ${stagingLoc} → ${r.loc} (${locOf(r.loc)?.type || "Location"})`, itemId: r.itemId, synnexId: r.itemId, brand: item?.brand || "", lpn: r.lpn, lot: r.batch, fromLoc: stagingLoc, toLoc: r.loc, loc: r.loc },
  ];
});
const poLinesOf = (po) => po?.lines?.length ? po.lines : [{ itemId: po.itemId, expQty: po.expQty, actualQty: po.actualQty, remark: po.remark, status: po.status }];
const poExpectedQty = (po) => poLinesOf(po).reduce((a, l) => a + (Number(l.expQty) || Number(l.qty) || 0), 0);
const poActualQty = (po) => poLinesOf(po).reduce((a, l) => a + (Number(l.actualQty) || 0), 0);
const scanMatchesUnit = (unit, code) => {
  const needle = String(code || "").trim().toLowerCase();
  if (!needle) return false;
  return [unit.unitId, unit.lpn, unit.boxBarcode, unit.sn, unit.imei].some((v) => String(v || "").trim().toLowerCase() === needle);
};
const scanKindOf = (unit, code) => {
  const needle = String(code || "").trim().toLowerCase();
  const pairs = [
    ["LPN", unit.lpn],
    ["Box Barcode", unit.boxBarcode],
    ["SN", unit.sn],
    ["IMEI", unit.imei],
    ["Unit ID", unit.unitId],
  ];
  return pairs.find(([, value]) => String(value || "").trim().toLowerCase() === needle)?.[0] || "Barcode";
};
const scanCodeKind = (code, serialUnits = []) => {
  const raw = String(code || "").trim();
  const needle = raw.toLowerCase();
  if (!raw) return "Empty";
  if (LOCATIONS.some((l) => l.code.toLowerCase() === needle)) return "Location";
  if (/^\d{10}$/.test(raw) || ITEMS.some((i) => i.id === raw)) return "SYNNEX ID";
  const unit = serialUnits.find((u) => scanMatchesUnit(u, raw));
  if (unit) return scanKindOf(unit, raw);
  if (/^imei[-\s:]?\d{10,}$/i.test(raw) || /^\d{14,17}$/.test(raw)) return "IMEI";
  if (/^sn[-\s:]?/i.test(raw)) return "SN";
  if (/^lpn[-\s:]?/i.test(raw)) return "LPN";
  return "Unknown";
};
const sortedDims = (dim) => [Number(dim?.l) || 0, Number(dim?.w) || 0, Number(dim?.h) || 0].sort((a, b) => b - a);
const sizeGroupOf = (item) => {
  const [longSide, midSide, shortSide] = sortedDims(item?.dim);
  const wt = Number(item?.dim?.wt) || 0;
  return [...SIZE_GROUPS]
    .sort((a, b) => (a.maxL * a.maxW * a.maxH) - (b.maxL * b.maxW * b.maxH))
    .find((g) => longSide <= g.maxL && midSide <= g.maxW && shortSide <= g.maxH && wt <= g.maxWt)
    || SIZE_GROUPS[SIZE_GROUPS.length - 1];
};
const sizeTextOf = (item) => {
  const [longSide, midSide, shortSide] = sortedDims(item?.dim);
  return `${longSide}x${midSide}x${shortSide} cm / ${item?.dim?.wt || 0} kg`;
};

function Stars({ n }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < n ? "#F5A623" : "none"} stroke={i < n ? "#F5A623" : "#4A5462"} />
      ))}
    </span>
  );
}
function GroupPill({ g }) {
  const info = GROUPS[g];
  return <span className="group-pill" style={{ "--pill": info.color }}>{g} · {info.label}</span>;
}
function StatusBadge({ code }) {
  const s = statusOf(code);
  return <span className="status-badge" style={{ background: s.color }}>{s.name}</span>;
}
const orderStatusTone = (status = "") => {
  const s = String(status).toLowerCase();
  if (s.includes("cancel") || s.includes("backorder") || s.includes("problem") || s.includes("hold") || s.includes("short") || s.includes("ยกเลิก") || s.includes("ปัญหา")) return "danger";
  if (s.includes("shipped") || s.includes("complete") || s.includes("picked") || s.includes("packed") || s.includes("closed") || s.includes("สำเร็จ") || s.includes("จัดส่งแล้ว")) return "success";
  if (s.includes("release") || s.includes("shipping") || s.includes("load") || s.includes("กำลัง")) return "info";
  if (s.includes("alloc") || s.includes("partial") || s.includes("pending") || s.includes("รอ")) return "warning";
  return "neutral";
};
function OrderStatusPill({ status }) {
  return <span className={`order-status ${orderStatusTone(status)}`}>{status || "Pending"}</span>;
}
function SizeBadge({ item }) {
  const s = sizeGroupOf(item);
  return <span className="status-badge" style={{ background: s.color }}>{s.code}</span>;
}
class ViewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view && this.state.error) this.setState({ error: null });
  }
  componentDidCatch(error) {
    console.error("View crash:", this.props.view, error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="card view-error-card">
          <h3>หน้านี้โหลดไม่สำเร็จ</h3>
          <div className="kpi-sub">View: {this.props.view}</div>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
function ItemCell({ itemId }) {
  const item = itemOf(itemId);
  return (
    <div className="item-cell">
      <span className="mono">{itemId || "-"}</span>
      <b>{item?.name || "-"}</b>
    </div>
  );
}
function Modal({ onClose, children, width = 480 }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <X className="close" size={18} onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
function AppPopup({ popup, onCancel, onConfirm }) {
  if (!popup) return null;
  const Icon = popup.kind === "success" ? CheckCircle2 : popup.kind === "danger" ? AlertTriangle : ShieldCheck;
  return (
    <div className="modal-backdrop">
      <div className="modal confirm-modal" style={{ maxWidth: 430 }}>
        <div className={`confirm-icon ${popup.kind || "info"}`}><Icon size={24} /></div>
        <h2>{popup.title}</h2>
        <p>{popup.message}</p>
        <div className="confirm-actions">
          {popup.mode === "confirm" && <button className="btn secondary" onClick={onCancel}>ยกเลิก</button>}
          <button className="btn" onClick={popup.mode === "confirm" ? onConfirm : onCancel}>{popup.mode === "confirm" ? "ยืนยัน" : "ตกลง"}</button>
        </div>
      </div>
    </div>
  );
}
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ user: "admin", pass: "1234", role: "Warehouse Supervisor" });
  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="brand-mark" style={{ marginBottom: 12 }}>
          <svg viewBox="0 0 100 100" width="42" height="42">
            <polygon points="50,8 88,26 50,44 12,26" fill="#1c1c1c" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="12,26 50,44 50,92 12,74" fill="#0a0a0a" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="50,44 88,26 88,74 50,92" fill="#141414" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
        <h1>PANDORA WMS</h1>
        <div className="kpi-sub" style={{ marginBottom: 18 }}>เข้าสู่ระบบเพื่อใช้งานคลังสินค้า</div>
        <div className="field"><label>Username</label><input value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} /></div>
        <div className="field"><label>Password</label><input type="password" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} /></div>
        <div className="field"><label>Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Warehouse Supervisor</option><option>Customer Service</option><option>Picker / Packer</option><option>Inventory Controller</option></select></div>
        <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onLogin(form)}>Login</button>
        <div className="kpi-sub" style={{ marginTop: 12 }}>Demo: admin / 1234</div>
      </div>
    </div>
  );
}
function ageBucket(age) {
  if (age <= 30) return { label: "0–30 วัน", cls: "ok" };
  if (age <= 60) return { label: "31–60 วัน", cls: "warn" };
  if (age <= 90) return { label: "61–90 วัน", cls: "orange" };
  return { label: "90+ วัน", cls: "risk" };
}
const sizeChipClass = (size) => `size-chip size-${String(size || "M").toLowerCase()}`;
const utilizationBar = (value, cls = "") => (
  <div className="util-cell"><span>{Math.round(value || 0)}%</span><div className={`util-track ${cls}`}><i style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }} /></div></div>
);
// green (low) → yellow (medium) → red (high), ratio 0..1
function heatColor(ratio) {
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const t = Math.max(0, Math.min(1, ratio));
  let c1, c2, tt;
  if (t <= 0.5) { c1 = [62, 199, 117]; c2 = [245, 196, 45]; tt = t / 0.5; }
  else { c1 = [245, 196, 45]; c2 = [241, 91, 113]; tt = (t - 0.5) / 0.5; }
  return `rgb(${lerp(c1[0], c2[0], tt)},${lerp(c1[1], c2[1], tt)},${lerp(c1[2], c2[2], tt)})`;
}
// Generic stock mover: moves an exact qty of an item from an AVL row at fromLoc into toLoc/toStatus.
// Caller is responsible for capping qty to what's actually available at fromLoc.
function moveStockQty(setStock, { itemId, fromLoc, toLoc, qty, toStatus = "AVL", batchPrefix = "MV" }) {
  setStock((list) => {
    let next = [...list];
    let remaining = qty;
    next = next.map((r) => {
      if (remaining <= 0) return r;
      if (r.itemId === itemId && r.loc === fromLoc && r.status === "AVL" && r.qty > 0) {
        const take = Math.min(remaining, r.qty);
        remaining -= take;
        return { ...r, qty: r.qty - take };
      }
      return r;
    }).filter((r) => r.qty > 0);
    const moved = qty - remaining;
    if (moved > 0) {
      const existing = next.find((r) => r.itemId === itemId && r.loc === toLoc && r.status === toStatus);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + moved } : r));
      else next = [...next, { key: Date.now() + Math.random(), itemId, batch: `${batchPrefix}-${Date.now()}`, lpn: "-", loc: toLoc, qty: moved, status: toStatus, age: 0 }];
    }
    return next;
  });
}

/* ================================================================== */
/* APP                                                                  */
/* ================================================================== */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [popup, setPopup] = useState(null);
  const [view, setView] = useState("overview");
  const [mode, setMode] = useState("general");
  const [now, setNow] = useState(new Date());
  const [pipeline, setPipeline] = useState([42, 118, 96, 74, 61]);
  const [kpi, setKpi] = useState({ accuracy: 89.0, caseRate: 0.0545, throughput: 61200, cycle: 5.4, otif: 88.4 });
  const [aiLog, setAiLog] = useState([{ t: new Date(), text: "เริ่มระบบ AI Decision Engine — โหมด Monitoring", tag: "system" }]);
  const [txLog, setTxLog] = useState(() => [{ t: new Date(), type: "System", detail: "ระบบ WMS พร้อมทำงาน", itemId: null }, ...seedStockTimeline()].sort((a, b) => new Date(b.t) - new Date(a.t)).slice(0, 200));

  const [stock, setStock] = useState(STOCK_INIT);
  const [dockSlots, setDockSlots] = useState(DOCK_SLOTS_INIT);
  const [poList, setPoList] = useState(PENDING_PO_INIT);
  const [allocOrders, setAllocOrders] = useState(ALLOC_ORDERS_INIT);
  const [pickTasks, setPickTasks] = useState(PICK_TASKS_INIT);
  const [platformOrders, setPlatformOrders] = useState(PLATFORM_ORDERS_INIT);
  const [users, setUsers] = useState(USERS_INIT);
  const [stickerTasks, setStickerTasks] = useState(STICKER_TASKS_INIT);
  const [stickerStock, setStickerStock] = useState(STICKER_STOCK_INIT);
  const [returnTickets, setReturnTickets] = useState(RETURN_TICKETS_INIT);
  const [csCases, setCsCases] = useState(CS_CASES_INIT);
  const [cycleCounts, setCycleCounts] = useState(CYCLE_COUNT_INIT);
  const [replenishRules, setReplenishRules] = useState(REPLENISH_RULES_INIT);
  const [robotJobs, setRobotJobs] = useState([]);
  const [serialUnits, setSerialUnits] = useState(SERIAL_UNITS_INIT);

  const notify = (title, message, kind = "success") => setPopup({ mode: "alert", title, message, kind });
  const confirmAction = ({ title = "ยืนยันรายการ", message = "ต้องการดำเนินการต่อหรือไม่", kind = "info", onConfirm }) => setPopup({ mode: "confirm", title, message, kind, onConfirm });
  const closePopup = () => setPopup(null);
  const runPopupConfirm = () => {
    const action = popup?.onConfirm;
    setPopup(null);
    if (action) action();
  };
  const addTx = (entry) => setTxLog((log) => {
    const item = itemOf(entry.itemId);
    return [{
      t: new Date(),
      user: userSession?.user || "system",
      brand: item?.brand || entry.brand || "",
      synnexId: entry.itemId || "",
      ...entry,
    }, ...log].slice(0, 200);
  });

  // Shared transition: move reserved (ALLOC) or legacy-available stock into PICKED status,
  // and mark the owning allocation order fully "Picked" once every source line is done.
  const applyPick = ({ orderId, itemId, loc, qty }) => {
    const pickSource = stock.find((r) => r.itemId === itemId && r.loc === loc && ["ALLOC", "AVL"].includes(r.status) && (!r.allocatedFor || r.allocatedFor === orderId));
    setStock((list) => {
      let next = [...list];
      const allocRow = next.find((r) => r.itemId === itemId && r.loc === loc && r.status === "ALLOC" && r.allocatedFor === orderId);
      const sourceRow = allocRow || next.find((r) => r.itemId === itemId && r.loc === loc && r.status === "AVL");
      if (sourceRow) next = next.map((r) => (r === sourceRow ? { ...r, qty: r.qty - qty } : r)).filter((r) => r.qty > 0);
      const existingPicked = next.find((r) => r.itemId === itemId && r.loc === "PICK-PACK" && r.status === "PICKED" && r.allocatedFor === orderId);
      if (existingPicked) next = next.map((r) => (r === existingPicked ? { ...r, qty: r.qty + qty } : r));
      else next = [...next, { key: Date.now() + Math.random(), itemId, batch: sourceRow?.batch || allocRow?.batch || `PICK-${orderId}`, lpn: sourceRow?.lpn || allocRow?.lpn || "-", loc: "PICK-PACK", qty, status: "PICKED", age: 0, allocatedFor: orderId }];
      return next;
    });
    setAllocOrders((list) => list.map((o) => {
      if (o.id !== orderId || !o.lines) return o;
      let allDone = true;
      const newLines = o.lines.map((l) => {
        if (l.itemId !== itemId) { if (!(l.sources || []).every((s) => (s.pickedQty || 0) >= s.qty)) allDone = false; return l; }
        const newSources = (l.sources || []).map((s) => (s.loc === loc ? { ...s, pickedQty: Math.min(Number(s.qty || 0), (Number(s.pickedQty || 0) + Number(qty || 0))) } : s));
        if (!newSources.every((s) => (s.pickedQty || 0) >= s.qty)) allDone = false;
        return { ...l, sources: newSources };
      });
      return { ...o, lines: newLines, status: allDone ? "Picked" : o.status };
    }));
    addTx({ type: "Pick", detail: `${orderId}: User ${userSession?.user || "system"} หยิบ ${itemOf(itemId)?.name} ${qty} หน่วย จาก ${loc} → PICK-PACK (Picked พร้อมส่ง Pack Station)`, itemId, lpn: pickSource?.lpn, lot: pickSource?.batch, fromLoc: loc, toLoc: "PICK-PACK", loc: "PICK-PACK", orderId, user: userSession?.user || "system" });
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPipeline((p) => p.map((v, i) => Math.max(4, v + rand(-6, 8) - i)));
      setKpi((k) => ({
        accuracy: Math.min(99.5, +(k.accuracy + Math.random() * 0.03).toFixed(2)),
        caseRate: Math.max(0.02, +(k.caseRate - Math.random() * 0.0004).toFixed(4)),
        throughput: k.throughput + rand(20, 90),
        cycle: Math.max(2.2, +(k.cycle - Math.random() * 0.01).toFixed(2)),
        otif: Math.min(97, +(k.otif + Math.random() * 0.025).toFixed(2)),
      }));
      const events = [
        "AI Batch Optimization: จัดกลุ่ม 14 ออเดอร์เป็น 3 Batch ลดระยะทางหยิบ 22%",
        "Congestion Management: ตรวจพบความหนาแน่นสูงที่ Aisle B-04 → เปลี่ยนเส้นทางหุ่นยนต์ 2 ตัว",
        "Predictive Picking: พยากรณ์ Order พุ่งสูงช่วง 14:00 → เตรียม Pre-pick SKU กลุ่ม Fast-moving",
        "Dynamic Robot Allocation: จัดสรร AMR-07 (Battery 82%) ไปงาน Retrieval ที่ ASRS-2",
        "Exception: ASRS-1 แจ้ง Fault Code E203 → สั่งหยิบสำรองจาก Manual Location อัตโนมัติ",
        "AI Cartonization: เลือกกล่องขนาด M สำหรับ Order #SO-88213 ลด Dead Space 18%",
      ];
      setAiLog((log) => [{ t: new Date(), text: pick(events), tag: pick(["ai", "exception", "robot"]) }, ...log].slice(0, 30));
    }, 4200);
    return () => clearInterval(t);
  }, []);

  const ctx = {
    stock, setStock, dockSlots, setDockSlots, poList, setPoList, allocOrders, setAllocOrders,
    pickTasks, setPickTasks, addTx, txLog, aiLog, platformOrders, setPlatformOrders,
    users, setUsers, stickerTasks, setStickerTasks, stickerStock, setStickerStock, returnTickets, setReturnTickets, csCases, setCsCases,
    cycleCounts, setCycleCounts, robotJobs, setRobotJobs, applyPick, replenishRules, setReplenishRules,
    serialUnits, setSerialUnits, notify, confirmAction, userSession,
  };
  const activeViewLabel = navLabelOf(view);
  const backlog24h = getBacklog24h(ctx);
  const handleExportExcel = () => {
    rowsToExcel(getExportRows(view, ctx), activeViewLabel, `WMS-${view}-${new Date().toISOString().slice(0, 10)}`);
    notify("Export Excel สำเร็จ", `ดาวน์โหลดข้อมูลหน้า ${activeViewLabel} แล้ว`, "success");
  };
  const handleExportPdf = () => {
    document.querySelector(".content")?.setAttribute("data-print-title", activeViewLabel);
    window.print();
    notify("Export PDF", "เลือก Save as PDF ในหน้าต่าง Print เพื่อบันทึกเอกสาร", "success");
  };

  if (!loggedIn) return (
    <>
      <GlobalStyle />
      <LoginScreen onLogin={(session) => { setUserSession(session); setLoggedIn(true); notify("Login สำเร็จ", `ยินดีต้อนรับ ${session.user} (${session.role})`, "success"); }} />
      <AppPopup popup={popup} onCancel={closePopup} onConfirm={runPopupConfirm} />
    </>
  );

  return (
    <div className="wms-app">
      <GlobalStyle />
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 100 100" width="34" height="34">
              <polygon points="50,8 88,26 50,44 12,26" fill="#1c1c1c" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
              <polygon points="12,26 50,44 50,92 12,74" fill="#0a0a0a" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
              <polygon points="50,44 88,26 88,74 50,92" fill="#141414" stroke="#E6C766" strokeWidth="3" strokeLinejoin="round" />
              <line x1="50" y1="8" x2="50" y2="44" stroke="#E6C766" strokeWidth="1.5" opacity="0.6" />
              <text x="30" y="72" fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="30" fill="#F0C75E">P</text>
            </svg>
          </div>
          <div className="brand-text">
            <div className="t1">PANDORA</div>
            <div className="t2">กล่องดำ · WMS Command Center</div>
          </div>
        </div>
        <nav className="navlist">
          {NAV_GROUPS.map((grp) => (
            <div key={grp.header}>
              <div className="nav-group-header">{grp.header}</div>
              {grp.items.map((n) => (
                <div key={n.id} className={`navitem ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
                  <n.icon size={16} /><span>{n.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="lbl">Warehouse Mode</div>
          <div className="val">{MODES.find((m) => m.id === mode).label}</div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <h1>{navLabelOf(view)}</h1>
          <div className="mode-switch">
            {MODES.map((m) => (
              <button key={m.id} className={`mode-btn ${mode === m.id ? "active" : ""}`} onClick={() => setMode(m.id)}>{m.th}</button>
            ))}
          </div>
          <div className="topbar-right">
            <div className="ai-pill">{userSession?.role || "User"}</div>
            <div className="ai-pill"><span className="dot" /> AI Engine Active</div>
            <div className="clock">{now.toLocaleTimeString("th-TH")}</div>
            <button className="btn secondary export-btn" onClick={handleExportExcel}><FileText size={13} /> Excel</button>
            <button className="btn secondary export-btn" onClick={handleExportPdf}><Printer size={13} /> PDF</button>
            <button className="btn secondary" onClick={() => { setLoggedIn(false); notify("Logout สำเร็จ", "ออกจากระบบแล้ว", "success"); }}>Logout</button>
          </div>
        </div>
        <div className="content">
          <ViewErrorBoundary view={view} key={view}>
            {view === "overview" && <Overview pipeline={pipeline} kpi={kpi} mode={mode} stock={stock} returnTickets={returnTickets} csCases={csCases} platformOrders={platformOrders} backlog24h={backlog24h} />}
            {view === "orders" && <PlatformOrders {...ctx} />}
            {view === "inboundsummary" && <TotalInboundSummary dockSlots={dockSlots} poList={poList} />}
            {view === "outboundsummary" && <TotalOutboundSummary platformOrders={platformOrders} />}
            {view === "externalwh" && <ExternalWarehouseDashboard stock={stock} platformOrders={platformOrders} poList={poList} />}
            {view === "salestracking" && <SalesOrderTracking {...ctx} />}
            {view === "master" && <MasterData />}
            {view === "appointment" && <AppointmentScheduling {...ctx} />}
            {view === "receiving" && <Receiving {...ctx} />}
            {view === "putaway" && <PutawayMove {...ctx} />}
            {view === "inventory" && <InventoryTransaction {...ctx} />}
            {view === "cyclecount" && <CycleCount {...ctx} />}
            {view === "replenishment" && <Replenishment {...ctx} />}
            {view === "allocation" && <AllocationOrder {...ctx} />}
            {view === "picking" && <Picking />}
            {view === "pickops" && <PickOps {...ctx} />}
            {view === "console" && <ConsoleOrder {...ctx} />}
            {view === "packing" && <Packing {...ctx} />}
            {view === "shipping" && <Shipping {...ctx} />}
            {view === "workorders" && <InventoryWorkOrders {...ctx} />}
            {view === "prework" && <PreworkStickers {...ctx} />}
            {view === "returns" && <ReturnsManagement {...ctx} />}
            {view === "cs" && <CustomerService {...ctx} />}
            {view === "warehouse3d" && <Warehouse3D stock={stock} />}
            {view === "invhold" && <InventoryHoldOverview {...ctx} />}
            {view === "aging" && <AgingReport stock={stock} />}
            {view === "cover" && <StockCover stock={stock} />}
            {view === "recall" && <TotalRecall stock={stock} />}
            {view === "recallprework" && <TotalRecallPrework stickerTasks={stickerTasks} stickerStock={stickerStock} />}
            {view === "people" && <Productivity {...ctx} />}
            {view === "rodocs" && <RoRiBilling returnTickets={returnTickets} platformOrders={platformOrders} allocOrders={allocOrders} />}
            {view === "integrations" && <Integrations />}
            {view === "dispatch" && <DispatchPlanning {...ctx} />}
            {view === "ai" && <AILog log={aiLog} />}
          </ViewErrorBoundary>
        </div>
      </div>
      <AppPopup popup={popup} onCancel={closePopup} onConfirm={runPopupConfirm} />
    </div>
  );
}

/* ================================================================== */
/* OVERVIEW                                                             */
/* ================================================================== */

function LpCard({ icon: Icon, label, value, sub, variant = "info", progress, tone = "blue" }) {
  return (
    <div className={`lp-card lp-${variant} tone-${tone}`}>
      <div className="lp-icon"><Icon size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="lp-label">{label}</div>
        <div className="lp-value">{value}</div>
        {sub && <div className="lp-sub">{sub}</div>}
        {progress != null && <div className="lp-progress-track"><div className="lp-progress-fill" style={{ width: `${Math.min(100, progress)}%`, background: variant === "bad" ? "var(--danger)" : variant === "plan" ? "var(--tone)" : variant === "good" ? "var(--success)" : "var(--amber)" }} /></div>}
      </div>
    </div>
  );
}

const PIPELINE_ICONS = { Receiving: ScanLine, "Put-away": ArrowDownToLine, Picking: Sparkles, Packing: Package, Shipping: Truck };
const SOFT_TONES = ["blue", "cyan", "green", "amber", "rose", "violet"];
const lightTooltip = {
  contentStyle: {
    background: "#FFFFFF",
    border: "1px solid #DDE6F2",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(22,35,61,.12)",
    color: "#17213A",
    fontFamily: "'Sarabun','Noto Sans Thai','Leelawadee UI',Tahoma,Arial,sans-serif",
    fontSize: 12,
  },
  labelStyle: { color: "#637089", fontWeight: 800 },
};

function Overview({ pipeline, kpi, mode, stock, returnTickets, csCases, platformOrders, backlog24h = [] }) {
  const latestDate = [...new Set(platformOrders.map((o) => o.date))].sort().at(-1) || "2569-07-10";
  const todayOrders = platformOrders.filter((o) => o.date === latestDate);
  const inProcess = platformOrders.filter((o) => !isCompletedStatus(o.status) && !isShippedStatus(o.status)).length;
  const totalInventory = stock.reduce((a, r) => a + r.qty, 0);
  const trendDates = [...new Set(platformOrders.map((o) => o.date))].sort().slice(-7);
  const trendRows = trendDates.map((date) => {
    const rows = platformOrders.filter((o) => o.date === date);
    return { date: date.slice(-5), orders: rows.length, units: rows.reduce((a, o) => a + Number(o.items || 0), 0) };
  });
  const taskRows = [
    { label: "Receiving", value: pipeline[0], color: "#2F67FF", icon: ScanLine },
    { label: "Picking", value: pipeline[2], color: "#20C766", icon: Sparkles },
    { label: "Packing", value: pipeline[3], color: "#FFAA1F", icon: Package },
    { label: "Shipping", value: pipeline[4], color: "#FF3D62", icon: Truck },
  ];
  const maxTask = Math.max(...taskRows.map((r) => r.value), 1);
  const categoryRows = [
    { name: "IT Device", value: stock.filter((r) => ["ASUS", "LG", "Canon", "APC"].includes(itemOf(r.itemId)?.brand)).reduce((a, r) => a + r.qty, 0), color: "#2F67FF" },
    { name: "Accessory", value: stock.filter((r) => ["Logitech"].includes(itemOf(r.itemId)?.brand)).reduce((a, r) => a + r.qty, 0), color: "#20C766" },
    { name: "Network", value: stock.filter((r) => ["TP-Link"].includes(itemOf(r.itemId)?.brand)).reduce((a, r) => a + r.qty, 0), color: "#15B8C8" },
    { name: "Others", value: stock.filter((r) => !["ASUS", "LG", "Canon", "APC", "Logitech", "TP-Link"].includes(itemOf(r.itemId)?.brand)).reduce((a, r) => a + r.qty, 0), color: "#F5A83C" },
  ].filter((r) => r.value > 0);
  const pickStorage = stock.filter((r) => locOf(r.loc)?.floor === "BKK1-1").reduce((a, r) => a + r.qty, 0);
  const bulkStorage = stock.filter((r) => locOf(r.loc)?.floor === "BKK1-2").reduce((a, r) => a + r.qty, 0);
  const mezzanine = stock.filter((r) => locOf(r.loc)?.floor === "BKK1-MZ").reduce((a, r) => a + r.qty, 0);
  const qtyByItem = (itemId) => stock.filter((r) => r.itemId === itemId).reduce((a, r) => a + r.qty, 0);
  const salesBucketOf = (dailySales) => dailySales >= 60 ? "Fast Moving" : dailySales >= 15 ? "Medium Moving" : "Slow Moving";
  const brandSummaryOf = (rows) => {
    const counts = rows.reduce((acc, it) => ({ ...acc, [it.brand]: (acc[it.brand] || 0) + 1 }), {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([brand, count]) => `${brand} ${count}`).join(" · ");
  };
  const itemSamplesOf = (rows) => rows.slice().sort((a, b) => Number(b.dailySales || 0) - Number(a.dailySales || 0)).slice(0, 2).map((it) => it.name).join(" • ");
  const salesMatrixRows = ["Fast Moving", "Medium Moving", "Slow Moving"].map((bucket) => {
    const bucketItems = ITEMS.filter((it) => salesBucketOf(it.dailySales) === bucket);
    const cells = ["A", "B", "C"].map((abc) => {
      const rows = bucketItems.filter((it) => it.abc === abc);
      return {
        abc,
        sku: rows.length,
        sales: rows.reduce((a, it) => a + Number(it.dailySales || 0), 0),
        stock: rows.reduce((a, it) => a + qtyByItem(it.id), 0),
        brands: brandSummaryOf(rows),
        samples: itemSamplesOf(rows),
      };
    });
    return { bucket, cells, totalSku: bucketItems.length, totalSales: bucketItems.reduce((a, it) => a + Number(it.dailySales || 0), 0), totalBrands: new Set(bucketItems.map((it) => it.brand)).size };
  });
  const warehouseCapacity = LOCATIONS.reduce((a, l) => a + Number(l.capacity || 0), 0);
  const usedCapacity = Math.min(totalInventory, warehouseCapacity);
  const freeCapacity = Math.max(warehouseCapacity - usedCapacity, 0);
  const goodQty = stock.filter((r) => ["AVL", "ALLOC", "PICKED", "PACKED"].includes(r.status)).reduce((a, r) => a + r.qty, 0);
  const holdQty = stock.filter((r) => ["HOLD", "QC"].includes(r.status)).reduce((a, r) => a + r.qty, 0);
  const damageQty = stock.filter((r) => ["DMG"].includes(r.status)).reduce((a, r) => a + r.qty, 0);
  const inventoryTrendRows = trendDates.map((date, idx) => {
    const swing = idx % 2 === 0 ? 0.008 : -0.006;
    const factor = 0.9 + idx * 0.018 + swing;
    const used = Math.min(warehouseCapacity, Math.max(0, Math.round(usedCapacity * factor)));
    const usedPercent = warehouseCapacity ? (used / warehouseCapacity) * 100 : 0;
    return {
      date: date.slice(-5),
      usedPct: Number(usedPercent.toFixed(1)),
      freePct: Number(Math.max(0, 100 - usedPercent).toFixed(1)),
      used,
    };
  });
  const inventoryDonutRows = [
    { name: "Free Space", value: freeCapacity, color: "#DCE7F5" },
    { name: "Good Stock", value: goodQty, color: "#20C766" },
    { name: "Hold / QC", value: holdQty, color: "#FFAA1F" },
    { name: "Damage", value: damageQty, color: "#FF3D62" },
  ].filter((r) => r.value > 0);
  const otifRows = trendDates.map((date) => {
    const orders = platformOrders.filter((o) => o.date === date).length || 1;
    const dayCases = csCases.filter((c) => c.date === date);
    const missByOwner = (owner) => dayCases.filter((c) => c.faultOwner === owner && ["OnTime", "InFull"].includes(c.kpiImpact)).length;
    return {
      date,
      warehouse: Math.max(0, ((orders - missByOwner("Warehouse")) / orders) * 100),
      carrier: Math.max(0, ((orders - missByOwner("Carrier")) / orders) * 100),
    };
  });
  const avgOtif = (key) => +(otifRows.reduce((a, r) => a + r[key], 0) / (otifRows.length || 1)).toFixed(2);
  const warehouseOtif = avgOtif("warehouse");
  const carrierOtif = avgOtif("carrier");
  const serviceRows = trendDates.map((date) => {
    const orders = platformOrders.filter((o) => o.date === date).length || 1;
    const dayCases = csCases.filter((c) => c.date === date);
    const miss = (kpiName, owner) => dayCases.filter((c) => c.kpiImpact === kpiName && c.faultOwner === owner).length;
    const score = (n) => Math.max(0, +(((orders - n) / orders) * 100).toFixed(2));
    return {
      date: date.slice(-5),
      onTimeWh: score(miss("OnTime", "Warehouse")),
      inFullWh: score(miss("InFull", "Warehouse")),
      onTimeLogistics: score(miss("OnTime", "Carrier")),
      inFullLogistics: score(miss("InFull", "Carrier")),
    };
  });
  const avgService = (key) => +(serviceRows.reduce((a, r) => a + r[key], 0) / (serviceRows.length || 1)).toFixed(2);
  const serviceCharts = [
    { title: "Ontime WH Trend", keyName: "onTimeWh", color: "#2F67FF", value: avgService("onTimeWh") },
    { title: "Infull WH Trend", keyName: "inFullWh", color: "#20C766", value: avgService("inFullWh") },
    { title: "Ontime Logistics Trend", keyName: "onTimeLogistics", color: "#15B8C8", value: avgService("onTimeLogistics") },
    { title: "Infull Logistics Trend", keyName: "inFullLogistics", color: "#FFAA1F", value: avgService("inFullLogistics") },
  ];
  const serviceDonutRows = serviceCharts.map((r) => ({ name: r.title.replace(" Trend", ""), value: r.value, color: r.color }));
  const totalBacklog = backlog24h.reduce((a, r) => a + r.count, 0);
  const over24Backlog = backlog24h.reduce((a, r) => a + r.over24, 0);
  const inboundOpen = backlog24h.find((r) => r.stage === "Inbound / Receiving")?.count || 0;
  const outboundOpen = platformOrders.filter((o) => !isCompletedStatus(o.status) && !isShippedStatus(o.status)).length;
  const utilizationPct = warehouseCapacity ? (usedCapacity / warehouseCapacity) * 100 : 0;

  return (
    <div className="exec-dashboard">
      <div className="exec-title">Dashboard</div>
      <div className="exec-kpi-grid">
        <ExecKpi title="Orders Today" value={todayOrders.length.toLocaleString()} sub="↑ 12.4%" />
        <ExecKpi title="In Process" value={inProcess.toLocaleString()} sub="● Active" tone="green" />
        <ExecKpi title="OTIF คลัง" value={`${warehouseOtif.toFixed(2)}%`} sub="Warehouse SLA" tone={warehouseOtif >= SLA_TARGET ? "green" : "amber"} />
        <ExecKpi title="OTIF ขนส่ง" value={`${carrierOtif.toFixed(2)}%`} sub="Carrier SLA" tone={carrierOtif >= SLA_TARGET ? "green" : "amber"} />
        <ExecKpi title="Inventory" value={`${kpi.accuracy.toFixed(2)}%`} sub="Accuracy" />
      </div>
      <div className="grid g3" style={{ marginBottom: 14 }}>
        <LpCard icon={Gauge} label="Warehouse Utilization" value={`${utilizationPct.toFixed(1)}%`} sub="พื้นที่คลังที่ใช้งาน" variant="info" progress={utilizationPct} />
        <LpCard icon={ScanLine} label="Total Inbound Order" value={inboundOpen.toLocaleString()} sub="งานรับเข้าเปิดอยู่" variant="plan" />
        <LpCard icon={Truck} label="Total Outbound Order" value={outboundOpen.toLocaleString()} sub="งานขาย/ส่งออกเปิดอยู่" variant="good" />
      </div>

      <div className="exec-backlog-panel">
        <div className="backlog-head">
          <div>
            <div className="exec-panel-title">24H WMS Backlog Control</div>
            <span>นับงานค้างทุกกิจกรรมแบบ 24 ชั่วโมง แยกงานใน SLA และเกิน SLA</span>
          </div>
          <div className={`backlog-total ${over24Backlog ? "risk" : ""}`}>
            <b>{totalBacklog}</b>
            <span>Backlog ทั้งหมด · เกิน 24 ชม. {over24Backlog}</span>
          </div>
        </div>
        <div className="backlog-grid">
          {backlog24h.map((r) => (
            <div className={`backlog-card tone-${r.tone}`} key={r.stage}>
              <div className="backlog-card-top">
                <span>{r.stage}</span>
                <b>{r.count}</b>
              </div>
              <div className="backlog-meta">{r.owner} · Max age {r.ageHours}h</div>
              <div className="backlog-track">
                <i className="ok" style={{ width: `${Math.min(100, r.count ? (r.within24 / r.count) * 100 : 0)}%` }} />
                <i className="risk" style={{ width: `${Math.min(100, r.count ? (r.over24 / r.count) * 100 : 0)}%` }} />
              </div>
              <div className="backlog-split"><span>≤24h {r.within24}</span><span>&gt;24h {r.over24}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="exec-main-grid">
        <div className="exec-panel trend-panel">
          <div className="exec-panel-title">Order Trend <span>(7 Days)</span></div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendRows} margin={{ top: 12, right: 18, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8B96A8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#8B96A8" tick={{ fontSize: 11 }} />
              <Tooltip {...lightTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="orders" name="Orders" stroke="#2F67FF" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="units" name="Units" stroke="#20C766" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="exec-panel task-panel">
          <div className="exec-panel-title">Task Progress</div>
          {taskRows.map(({ label, value, color, icon: Icon }) => (
            <div className="task-row" key={label}>
              <div className="task-icon" style={{ color, background: `${color}18` }}><Icon size={17} /></div>
              <div className="task-body">
                <div className="task-head"><span style={{ color }}>{label}</span><b>{value}</b></div>
                <div className="task-track"><i style={{ width: `${Math.max(8, (value / maxTask) * 100)}%`, background: color }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="exec-bottom-grid">
        <div className="exec-panel">
          <div className="exec-panel-title">Top Categories</div>
          <div className="category-wrap">
            <div style={{ width: 142, height: 142 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryRows} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={3}>
                    {categoryRows.map((r) => <Cell key={r.name} fill={r.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="category-legend">
              {categoryRows.map((r) => (
                <div className="cat-line" key={r.name}><span><i style={{ background: r.color }} />{r.name}</span><b>{pct(r.value, totalInventory)}</b></div>
              ))}
            </div>
          </div>
        </div>
        <div className="exec-panel warehouse-panel">
          <div className="exec-panel-title">Warehouse Status</div>
          <div className="warehouse-status-body">
            <div className="warehouse-photo">
              <Boxes size={36} />
              <span>Smart Storage</span>
            </div>
            <div className="warehouse-metrics">
              <div><span>Pick Storage</span><b>{pickStorage.toLocaleString()}</b></div>
              <div><span>Mezzanine ASRS</span><b>{mezzanine.toLocaleString()}</b></div>
              <div><span>Bulk Storage</span><b>{bulkStorage.toLocaleString()}</b></div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-inventory-grid">
        <div className="exec-panel inventory-trend-panel">
          <div className="exec-panel-title">Inventory Trend <span>(Daily Space Usage)</span></div>
          <div className="inventory-summary-strip">
            <div className="inventory-pill used"><span>Used Space</span><b>{pct(usedCapacity, warehouseCapacity)}</b></div>
            <div className="inventory-pill free"><span>Free Space</span><b>{pct(freeCapacity, warehouseCapacity)}</b></div>
            <div className="inventory-pill stock"><span>Total Stock</span><b>{totalInventory.toLocaleString()}</b></div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={inventoryTrendRows} margin={{ top: 10, right: 18, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8B96A8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#8B96A8" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip {...lightTooltip} formatter={(value, name) => [`${value}%`, name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="usedPct" name="Used Space" stroke="#2F67FF" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="freePct" name="Free Space" stroke="#20C766" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-pair-grid">
          <div className="exec-panel inventory-donut-panel">
            <div className="exec-panel-title">Inventory Space & Condition</div>
            <div className="compact-donut-wrap">
              <div className="inventory-donut-chart">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={inventoryDonutRows} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={3}>
                      {inventoryDonutRows.map((r) => <Cell key={r.name} fill={r.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><b>{pct(freeCapacity, warehouseCapacity)}</b><span>Free</span></div>
              </div>
              <div className="category-legend inventory-legend">
                {inventoryDonutRows.map((r) => (
                  <div className="cat-line" key={r.name}>
                    <span><i style={{ background: r.color }} />{r.name}</span>
                    <b>{pct(r.value, warehouseCapacity)}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="exec-panel service-donut-panel">
            <div className="exec-panel-title">Service KPI Mix <span>(Average Score)</span></div>
            <div className="compact-donut-wrap">
              <div className="inventory-donut-chart">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={serviceDonutRows} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={3}>
                      {serviceDonutRows.map((r) => <Cell key={r.name} fill={r.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><b>{warehouseOtif.toFixed(1)}%</b><span>WH OTIF</span></div>
              </div>
              <div className="category-legend inventory-legend">
                {serviceDonutRows.map((r) => (
                  <div className="cat-line" key={r.name}>
                    <span><i style={{ background: r.color }} />{r.name}</span>
                    <b>{r.value.toFixed(2)}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-section-head">
        <div>
          <h3>Warehouse & Logistics KPI</h3>
          <span>Ontime / Infull daily trend by owner</span>
        </div>
      </div>
      <div className="exec-service-grid">
        {serviceCharts.map((chart) => (
          <div className="exec-panel service-chart-card" key={chart.keyName}>
            <div className="service-chart-head">
              <div className="exec-panel-title">{chart.title}</div>
              <b style={{ color: chart.color }}>{chart.value.toFixed(2)}%</b>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={serviceRows} margin={{ top: 8, right: 14, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#8B96A8" tick={{ fontSize: 10 }} />
                <YAxis domain={[95, 100]} stroke="#8B96A8" tick={{ fontSize: 10 }} />
                <Tooltip {...lightTooltip} formatter={(value) => [`${value}%`, chart.title]} />
                <ReferenceLine y={SLA_TARGET} stroke="#111827" strokeDasharray="4 4" />
                <Line type="monotone" dataKey={chart.keyName} name={chart.title} stroke={chart.color} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
      <div className="exec-cs-row">
        <div className="exec-panel cs-dashboard-panel">
          <div className="exec-panel-title">Customer Service Dashboard <span>(CS + WMS + Logistics)</span></div>
          <ServiceLevelDashboard csCases={csCases} platformOrders={platformOrders} light salesMatrixRows={salesMatrixRows} />
        </div>
      </div>
      <SalesVelocityMatrix rows={salesMatrixRows} />
    </div>
  );
}

function ServiceLevelDashboard({ csCases = [], platformOrders = [], light = false, salesMatrixRows = [] }) {
  const dates = [...new Set(platformOrders.map((o) => o.date))].sort().slice(-7);
  const scoreFor = (date, kpiImpact, owner) => {
    const orders = platformOrders.filter((o) => o.date === date).length || 1;
    const misses = csCases.filter((c) => c.date === date && c.kpiImpact === kpiImpact && c.faultOwner === owner).length;
    return +Math.max(0, ((orders - misses) / orders) * 100).toFixed(2);
  };
  const trendRows = dates.map((date) => ({
    date: date.slice(-5),
    onTimeWh: scoreFor(date, "OnTime", "Warehouse"),
    onTimeCarrier: scoreFor(date, "OnTime", "Carrier"),
    inFullWh: scoreFor(date, "InFull", "Warehouse"),
    inFullCarrier: scoreFor(date, "InFull", "Carrier"),
  }));
  const avg = (key) => +(trendRows.reduce((a, r) => a + Number(r[key] || 0), 0) / (trendRows.length || 1)).toFixed(2);
  const cards = [
    { label: "On-Time — Warehouse", value: avg("onTimeWh"), icon: ShieldCheck, tone: "green" },
    { label: "On-Time — ขนส่ง (Carrier)", value: avg("onTimeCarrier"), icon: Truck, tone: "rose" },
    { label: "In-Full — Warehouse", value: avg("inFullWh"), icon: Package, tone: "rose" },
    { label: "In-Full — ขนส่ง (Carrier)", value: avg("inFullCarrier"), icon: Route, tone: "rose" },
  ];
  const serviceMixRows = [
    { name: "Ontime WH", value: avg("onTimeWh"), color: "#2F67FF" },
    { name: "Ontime Carrier", value: avg("onTimeCarrier"), color: "#15B8C8" },
    { name: "InFull WH", value: avg("inFullWh"), color: "#20C766" },
    { name: "InFull Carrier", value: avg("inFullCarrier"), color: "#FFAA1F" },
  ];
  const issueRows = ISSUE_TYPES.map((it) => ({
    name: it.label,
    count: csCases.filter((c) => c.issueType === it.label || c.type === it.label).length,
  })).filter((r) => r.count > 0).sort((a, b) => b.count - a.count).slice(0, 6);
  const barRows = issueRows.map((r) => ({ ...r, shortName: r.name.replace(/\s*\(.+?\)/g, "").slice(0, 14) }));
  const [selectedIssue, setSelectedIssue] = useState(issueRows[0]?.name || ISSUE_TYPES[0]?.label || "");
  const issueTrendRows = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค."].map((m, idx) => {
    const base = csCases.filter((c) => (c.issueType || c.type) === selectedIssue).length;
    return { month: m, cases: Math.max(0, Math.round(base * (0.55 + idx * 0.08 + (idx % 2 ? 0.18 : -0.08)))) };
  });

  return (
    <>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        {cards.map((c) => (
          <LpCard key={c.label} icon={c.icon} label={c.label} value={`${c.value.toFixed(2)}%`} sub={`เกณฑ์ ${SLA_TARGET}%`} variant={c.value >= SLA_TARGET ? "good" : "bad"} tone={c.tone} />
        ))}
      </div>
      <div className="lp-panel" style={{ marginBottom: 14 }}>
        <h3>Trend Service Level รายวัน</h3>
        <ResponsiveContainer width="100%" height={light ? 210 : 260}>
          <LineChart data={trendRows} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#8B96A8" tick={{ fontSize: 10 }} />
            <YAxis domain={[80, 100]} stroke="#8B96A8" tick={{ fontSize: 10 }} />
            <Tooltip {...lightTooltip} formatter={(value) => [`${value}%`, "Service"]} />
            <ReferenceLine y={SLA_TARGET} stroke="#111827" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="onTimeWh" name="Ontime WH" stroke="#2F67FF" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="inFullWh" name="InFull WH" stroke="#20C766" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="onTimeCarrier" name="Ontime Carrier" stroke="#15B8C8" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="inFullCarrier" name="InFull Carrier" stroke="#FFAA1F" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid g2" style={{ marginBottom: 14 }}>
        <div className="lp-panel service-donut-panel">
          <h3>Service Level Mix</h3>
          <div className="compact-donut-wrap">
            <div className="inventory-donut-chart">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={serviceMixRows} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={3}>
                    {serviceMixRows.map((r) => <Cell key={r.name} fill={r.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center"><b>{avg("onTimeWh").toFixed(1)}%</b><span>WH SLA</span></div>
            </div>
            <div className="category-legend inventory-legend">
              {serviceMixRows.map((r) => <div className="cat-line" key={r.name}><span><i style={{ background: r.color }} />{r.name}</span><b>{r.value.toFixed(2)}%</b></div>)}
            </div>
          </div>
        </div>
        <div className="lp-panel">
          <h3>จำนวนเคสแยกตามประเด็นปัญหา</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barRows} layout="vertical" margin={{ top: 12, right: 18, left: 16, bottom: 8 }}>
              <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} stroke="#8B96A8" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="shortName" width={112} stroke="#8B96A8" tick={{ fontSize: 10 }} />
              <Tooltip {...lightTooltip} />
              <Bar dataKey="count" name="Cases" fill="#2F67FF" radius={[0, 6, 6, 0]} onClick={(row) => setSelectedIssue(row?.name || selectedIssue)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lp-panel" style={{ marginBottom: 14 }}>
        <h3>Trend Line รายเดือนตามประเด็นปัญหา</h3>
        <div className="strategy-toolbar" style={{ marginBottom: 8 }}>
          {issueRows.map((r) => <span key={r.name} className={`chip ${selectedIssue === r.name ? "active" : ""}`} onClick={() => setSelectedIssue(r.name)}>{r.name}</span>)}
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={issueTrendRows} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#8B96A8" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} stroke="#8B96A8" tick={{ fontSize: 10 }} />
            <Tooltip {...lightTooltip} />
            <Line type="monotone" dataKey="cases" name={selectedIssue || "Cases"} stroke="#2F67FF" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid g2">
        <div className="lp-panel">
          <h3>จำนวนเคสแยกตามประเด็นปัญหา</h3>
          {issueRows.length === 0 && <div className="kpi-sub">ยังไม่มีเคสปัญหา</div>}
          {issueRows.map((r) => <div className="recall-row" key={r.name}><span>{r.name}</span><span className="mono">{r.count}</span></div>)}
        </div>
        <div className="lp-panel">
          <h3>Sales Velocity Matrix</h3>
          {salesMatrixRows.map((r) => <div className="recall-row" key={r.bucket}><span>{r.bucket}</span><span className="mono">{r.totalSku} SKU · {r.totalSales} sales/day</span></div>)}
        </div>
      </div>
    </>
  );
}

function ExecKpi({ title, value, sub, tone = "blue" }) {
  return (
    <div className={`exec-kpi tone-${tone}`}>
      <div>{title}</div>
      <b>{value}</b>
      <span>{sub}</span>
    </div>
  );
}

function ReturnsSummaryCards({ returnTickets }) {
  const total = returnTickets.length;
  const pending = returnTickets.filter((t) => t.step < 4).length;
  const restocked = returnTickets.filter((t) => t.decision === "Restock").reduce((a, t) => a + t.qty, 0);
  const scrapped = returnTickets.filter((t) => t.decision === "Scrap").reduce((a, t) => a + t.qty, 0);
  const recoveryRate = restocked + scrapped ? (restocked / (restocked + scrapped)) * 100 : 0;
  return (
    <div className="grid g4" style={{ marginBottom: 24 }}>
      <LpCard icon={Undo2} label="ใบงานรับคืนทั้งหมด" value={total} sub={`รอดำเนินการ ${pending} รายการ`} variant={pending > 0 ? "plan" : "info"} />
      <LpCard icon={CheckCircle2} label="กลับเข้า Stock (Restock)" value={restocked} sub="หน่วย" variant="good" />
      <LpCard icon={AlertTriangle} label="ชำรุดเสียหาย (Scrap)" value={scrapped} sub="หน่วย" variant="bad" />
      <LpCard icon={TrendingUp} label="อัตรานำกลับใช้ได้" value={`${recoveryRate.toFixed(0)}%`} sub="Restock เทียบกับ Scrap ทั้งหมด" variant={recoveryRate >= 70 ? "good" : "bad"} />
    </div>
  );
}

function SalesVelocityMatrix({ rows = [] }) {
  if (!rows.length) return null;
  return (
    <div className="exec-panel sales-matrix-panel">
      <div className="exec-panel-title">Sales Velocity Matrix <span>(Daily Sales x ABC Class)</span></div>
      <div className="sales-matrix">
        <div className="matrix-head">ยอดขาย/วัน</div>
        {["ABC A", "ABC B", "ABC C"].map((h) => <div className="matrix-head" key={h}>{h}</div>)}
        <div className="matrix-head">รวม</div>
        {rows.map((row) => (
          <React.Fragment key={row.bucket}>
            <div className={`matrix-row-title ${row.bucket.split(" ")[0].toLowerCase()}`}>{row.bucket}</div>
            {row.cells.map((cell) => (
              <div className="matrix-cell" key={`${row.bucket}-${cell.abc}`}>
                <b>{cell.sku}</b>
                <span>SKU</span>
                <em>{cell.sales.toLocaleString()} sold/day</em>
                <small>{cell.stock.toLocaleString()} stock</small>
                <div className="matrix-brands">{cell.brands || "No brand"}</div>
                <div className="matrix-items">{cell.samples || "No item"}</div>
              </div>
            ))}
            <div className="matrix-total">
              <b>{row.totalSku}</b>
              <span>SKU</span>
              <em>{row.totalSales.toLocaleString()} sold/day</em>
              <small>{row.totalBrands} brands</small>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* ORDER BY PLATFORM (B2B / B2C)                                       */
/* ================================================================== */

function PlatformOrders({ platformOrders }) {
  const [platform, setPlatform] = useState("ALL");
  const platforms = ["ALL", "Lazada", "Shopee", "TikTok Shop", "B2B"];
  const filtered = platform === "ALL" ? platformOrders : platformOrders.filter((o) => o.platform === platform);

  const byDay = {};
  platformOrders.forEach((o) => { byDay[o.date] = (byDay[o.date] || 0) + 1; });
  const days = Object.keys(byDay).sort();
  const maxDay = Math.max(...Object.values(byDay), 1);

  const statusCount = { "รอจัดสรร": 0, "กำลังแพ็ค": 0, "จัดส่งแล้ว": 0, "สำเร็จ": 0 };
  filtered.forEach((o) => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });

  // Mon → Sun weekday pattern (Buddhist 2569-07 = Gregorian July 2026)
  const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const wdAgg = Array.from({ length: 7 }, () => ({ total: 0, n: 0 }));
  Object.entries(byDay).forEach(([dateStr, c]) => {
    const dd = parseInt(dateStr.slice(-2), 10);
    const wd = new Date(2026, 6, dd).getDay();
    wdAgg[wd].total += c; wdAgg[wd].n += 1;
  });
  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];
  const weekdayData = weekdayOrder.map((wd) => ({ day: WEEKDAY_TH[wd], full: WEEKDAY_TH[wd], avg: wdAgg[wd].n ? +(wdAgg[wd].total / wdAgg[wd].n).toFixed(1) : 0 }));
  const peakDay = weekdayData.reduce((a, b) => (b.avg > a.avg ? b : a), weekdayData[0]);

  return (
    <>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        {Object.entries(statusCount).map(([s, c]) => (
          <div className="card" key={s}><h3>{s}</h3><div className="kpi-val" style={{ fontSize: 22 }}>{c}</div></div>
        ))}
      </div>

      <div className="section-title">Trend Order รายวัน (14 วันล่าสุด)</div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="trend-chart">
          {days.slice(-14).map((d) => (
            <div className="trend-bar" key={d}>
              <div className="bar" style={{ height: `${(byDay[d] / maxDay) * 100}px`, background: heatColor(byDay[d] / maxDay) }} title={byDay[d]} />
              <div className="lbl mono">{d.slice(-2)}</div>
              <div className="lbl" style={{ color: "var(--text)" }}>{byDay[d]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">กราฟแนวโน้ม Order by Platform ตามวันในสัปดาห์ — จันทร์ อังคาร พุธ พฤหัสบดี ศุกร์ เสาร์ อาทิตย์</div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={weekdayData} margin={{ top: 10, right: 22, left: -8, bottom: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--muted)" tick={{ fontSize: 11 }} interval={0} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 8, color: "#1F2937", fontSize: 12 }} formatter={(v) => [`${v} Order/วัน`, "เฉลี่ย"]} />
              <Line type="monotone" dataKey="avg" stroke="var(--amber)" strokeWidth={3} dot={{ r: 5, fill: "var(--amber)" }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="kpi-sub" style={{ textAlign: "center", marginTop: 6 }}>
          วันที่มี Order เฉลี่ยสูงสุดคือวัน<b style={{ color: "var(--danger)" }}> {peakDay.full}</b> ({peakDay.avg} Order/วัน)
        </div>
      </div>

      <div className="section-title">ปฏิทินสรุป Order (กรกฎาคม 2569) — Heat Map ตามปริมาณ Order</div>
      <div className="strategy-toolbar" style={{ marginBottom: 10 }}>
        <span className="kpi-sub" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="stat-dot" style={{ background: heatColor(0.05) }} /> Order น้อย
          <i className="stat-dot" style={{ background: heatColor(0.5), marginLeft: 10 }} /> ปานกลาง
          <i className="stat-dot" style={{ background: heatColor(0.95), marginLeft: 10 }} /> Order เยอะ
        </span>
      </div>
      <div className="calendar-grid" style={{ marginBottom: 24 }}>
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const key = `2569-07-${String(day).padStart(2, "0")}`;
          const c = byDay[key] || 0;
          return (
            <div key={day} className="cal-cell heat" style={c ? { background: heatColor(c / maxDay), borderColor: "transparent" } : {}}>
              <div className="d" style={c ? { color: "rgba(255,255,255,0.85)" } : {}}>{day}</div>
              <div className="n" style={c ? { color: "#FFFFFF" } : {}}>{c || "-"}</div>
            </div>
          );
        })}
      </div>

      <div className="strategy-toolbar">
        {platforms.map((p) => (
          <span key={p} className={`chip ${platform === p ? "active" : ""}`} onClick={() => setPlatform(p)}>{p === "ALL" ? "ทั้งหมด" : p}</span>
        ))}
      </div>
      <div className="kpi-sub" style={{ marginBottom: 10 }}>แสดง {Math.min(80, filtered.length)} จาก {filtered.length} Order ทั้งหมด (เดือนกรกฎาคม 2569)</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Platform</th><th>ลูกค้า</th><th>พื้นที่จัดส่ง</th><th>จำนวนรายการ</th><th>Cube (CBM)</th><th>รอบจัดส่ง</th><th>วันที่</th><th>สถานะ</th></tr></thead>
          <tbody>
            {filtered.slice(0, 80).map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td><td>{o.platform}</td><td>{o.customer}</td><td>{o.area}</td><td>{o.items}</td><td className="mono">{o.cube}</td><td>{o.slot}</td><td className="mono">{o.date}</td>
                <td><span className={`tag-status ${o.status === "สำเร็จ" ? "Completed" : o.status === "จัดส่งแล้ว" ? "Arrived" : "Booked"}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================================================================== */
/* DAILY INBOUND / OUTBOUND SUMMARY                                     */
/* ================================================================== */

function pct(n, d) {
  return d ? `${((n / d) * 100).toFixed(1)}%` : "0.0%";
}

const statusHas = (status, ...tokens) => tokens.some((t) => String(status || "").includes(t));
const isFullReceiveStatus = (status) => statusHas(status, "รับครบ", "รับครบ");
const isPackedStatus = (status) => statusHas(status, "แพ็ค", "พ็ค");
const isShippedStatus = (status) => statusHas(status, "จัดส่ง", "จัดส่ง");
const isCompletedStatus = (status) => statusHas(status, "สำเร็จ", "สำเร็จ");
const isPendingStatus = (status) => statusHas(status, "รอ", "รอ");

function TotalInboundSummary({ dockSlots, poList }) {
  const poByNo = Object.fromEntries(poList.map((p) => [p.po, p]));
  const slotByPo = Object.fromEntries(dockSlots.filter((d) => d.poNumber).map((d) => [d.poNumber, d]));
  const rowsByDate = {};

  dockSlots.forEach((slot) => {
    const po = poByNo[slot.poNumber] || null;
    const date = slot.date || "2569-07-08";
    if (!rowsByDate[date]) rowsByDate[date] = { date, appointments: 0, expected: 0, received: 0, completed: 0, pending: 0, exceptions: 0 };
    rowsByDate[date].appointments += 1;
    rowsByDate[date].expected += po ? poExpectedQty(po) : slot.expQty ?? 0;
    rowsByDate[date].received += po ? poActualQty(po) : 0;
    const done = po ? po.status !== "Pending" : slot.status === "Completed";
    if (done) rowsByDate[date].completed += 1;
    else rowsByDate[date].pending += 1;
    if (po && po.status !== "Pending" && !isFullReceiveStatus(po.status)) rowsByDate[date].exceptions += 1;
  });

  poList.forEach((po) => {
    if (slotByPo[po.po]) return;
    const date = "2569-07-08";
    if (!rowsByDate[date]) rowsByDate[date] = { date, appointments: 0, expected: 0, received: 0, completed: 0, pending: 0, exceptions: 0 };
    rowsByDate[date].expected += poExpectedQty(po);
    rowsByDate[date].received += poActualQty(po);
    if (po.status !== "Pending") rowsByDate[date].completed += 1;
    else rowsByDate[date].pending += 1;
    if (po.status !== "Pending" && !isFullReceiveStatus(po.status)) rowsByDate[date].exceptions += 1;
  });

  const rows = Object.values(rowsByDate).sort((a, b) => a.date.localeCompare(b.date));
  const total = rows.reduce((a, r) => ({
    appointments: a.appointments + r.appointments,
    expected: a.expected + r.expected,
    received: a.received + r.received,
    completed: a.completed + r.completed,
    pending: a.pending + r.pending,
    exceptions: a.exceptions + r.exceptions,
  }), { appointments: 0, expected: 0, received: 0, completed: 0, pending: 0, exceptions: 0 });

  return (
    <>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <LpCard icon={CalendarClock} label="Inbound Appointment" value={total.appointments} sub="จำนวนรอบรถเข้าคลัง" variant="plan" tone="blue" progress={Math.min(100, total.appointments * 12)} />
        <LpCard icon={PackageCheck} label="Expected Qty" value={total.expected.toLocaleString()} sub="จำนวนที่คาดรับทั้งหมด" variant="plan" tone="cyan" progress={100} />
        <LpCard icon={ScanLine} label="Received Qty" value={total.received.toLocaleString()} sub={`Fill Rate ${pct(total.received, total.expected)}`} variant={total.received >= total.expected ? "good" : "info"} progress={Math.min(100, total.expected ? (total.received / total.expected) * 100 : 0)} />
        <LpCard icon={AlertTriangle} label="Pending / Exception" value={`${total.pending} / ${total.exceptions}`} sub="งานค้าง / งานผิดปกติ" variant={total.exceptions ? "bad" : "plan"} tone="rose" progress={Math.min(100, total.pending * 20)} />
      </div>

      <div className="section-title">Total Inbound Summary รายวัน</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={rows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} />
              <Tooltip {...lightTooltip} />
              <Legend />
              <Bar dataKey="expected" name="Expected" fill="#4F7DE8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" name="Received" fill="#3EC775" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Appointment</th><th>Expected Qty</th><th>Received Qty</th><th>Fill Rate</th><th>Completed</th><th>Pending</th><th>Exception</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.date}>
              <td className="mono">{r.date}</td><td>{r.appointments}</td><td>{r.expected.toLocaleString()}</td><td>{r.received.toLocaleString()}</td>
              <td>{pct(r.received, r.expected)}</td><td>{r.completed}</td><td>{r.pending}</td><td>{r.exceptions}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function TotalOutboundSummary({ platformOrders }) {
  const rowsByDate = {};
  platformOrders.forEach((o) => {
    if (!rowsByDate[o.date]) rowsByDate[o.date] = { date: o.date, orders: 0, items: 0, cube: 0, packed: 0, shipped: 0, completed: 0, pending: 0 };
    const r = rowsByDate[o.date];
    r.orders += 1;
    r.items += o.items;
    r.cube += o.cube;
    if (isPackedStatus(o.status)) r.packed += 1;
    if (isShippedStatus(o.status)) r.shipped += 1;
    if (isCompletedStatus(o.status)) r.completed += 1;
    if (isPendingStatus(o.status)) r.pending += 1;
  });
  const rows = Object.values(rowsByDate).sort((a, b) => a.date.localeCompare(b.date));
  const total = rows.reduce((a, r) => ({
    orders: a.orders + r.orders,
    items: a.items + r.items,
    cube: a.cube + r.cube,
    packed: a.packed + r.packed,
    shipped: a.shipped + r.shipped,
    completed: a.completed + r.completed,
    pending: a.pending + r.pending,
  }), { orders: 0, items: 0, cube: 0, packed: 0, shipped: 0, completed: 0, pending: 0 });
  const recentRows = rows.slice(-14);

  return (
    <>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <LpCard icon={ShoppingBag} label="Outbound Orders" value={total.orders.toLocaleString()} sub="จำนวน Order ทั้งหมด" variant="plan" tone="blue" progress={100} />
        <LpCard icon={Package} label="Item Lines" value={total.items.toLocaleString()} sub="จำนวนรายการสินค้ารวม" variant="plan" tone="cyan" progress={100} />
        <LpCard icon={Truck} label="Shipped / Completed" value={`${total.shipped + total.completed}`} sub={`Completion ${pct(total.completed, total.orders)}`} variant="good" progress={Math.min(100, (total.completed / Math.max(total.orders, 1)) * 100)} />
        <LpCard icon={Boxes} label="Total Cube" value={total.cube.toFixed(2)} sub="CBM สำหรับวางแผนโหลด" variant="plan" tone="amber" progress={Math.min(100, total.cube)} />
      </div>

      <div className="section-title">Total Outbound Summary รายวัน</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={recentRows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} />
              <Tooltip {...lightTooltip} />
              <Legend />
              <Bar dataKey="orders" name="Orders" fill="#4F7DE8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#3EC775" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#F5A83C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Orders</th><th>Items</th><th>Cube</th><th>Packed</th><th>Shipped</th><th>Completed</th><th>Pending</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.date}>
              <td className="mono">{r.date}</td><td>{r.orders}</td><td>{r.items}</td><td className="mono">{r.cube.toFixed(2)}</td>
              <td>{r.packed}</td><td>{r.shipped}</td><td>{r.completed}</td><td>{r.pending}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

/* ================================================================== */
/* MASTER DATA                                                          */
/* ================================================================== */

function MasterData() {
  const [tab, setTab] = useState("item");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);
  const [itemModal, setItemModal] = useState(null);
  const [locModal, setLocModal] = useState(null);
  const [plantModal, setPlantModal] = useState(null);
  const [floorModal, setFloorModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [sizeModal, setSizeModal] = useState(null);
  const [, setRev] = useState(0);
  const bump = () => setRev((r) => r + 1);

  const filtered = ITEMS.filter((it) => (it.name + it.id + it.itemCode + it.partId + it.partNo + it.brand).toLowerCase().includes(q.toLowerCase()));

  const saveItem = (form) => {
    const clean = { ...form, receiveMinAgeDays: Number(form.receiveMinAgeDays ?? 0), receiveMaxAgeDays: Number(form.receiveMaxAgeDays ?? 3650) };
    if (clean._editing) ITEMS = ITEMS.map((it) => (it.id === clean.id ? clean : it));
    else ITEMS = [...ITEMS, clean];
    setItemModal(null); bump();
  };
  const saveLoc = (form) => {
    if (form._editing) LOCATIONS = LOCATIONS.map((l) => (l.code === form._origCode ? { ...form } : l));
    else LOCATIONS = [...LOCATIONS, form];
    setLocModal(null); bump();
  };
  const savePlant = (form) => { PLANTS = [...PLANTS, form]; setPlantModal(null); bump(); };
  const saveFloor = (form) => { FLOORS = [...FLOORS, form]; setFloorModal(null); bump(); };
  const saveStatus = (form) => { STATUS_LIST = [...STATUS_LIST, form]; setStatusModal(null); bump(); };
  const saveSize = (form) => {
    const clean = { ...form, maxL: Number(form.maxL), maxW: Number(form.maxW), maxH: Number(form.maxH), maxWt: Number(form.maxWt), stickerSize: form.stickerSize || form.code };
    if (clean._editing) SIZE_GROUPS = SIZE_GROUPS.map((s) => (s.code === clean._origCode ? { ...clean, _editing: undefined, _origCode: undefined } : s));
    else SIZE_GROUPS = [...SIZE_GROUPS, clean];
    setSizeModal(null); bump();
  };

  return (
    <>
      <div className="tabs">
        <span className={`tab ${tab === "item" ? "active" : ""}`} onClick={() => setTab("item")}>Item Master</span>
        <span className={`tab ${tab === "synnex" ? "active" : ""}`} onClick={() => setTab("synnex")}>SYNNEX ID Rule</span>
        <span className={`tab ${tab === "loc" ? "active" : ""}`} onClick={() => setTab("loc")}>Location Master</span>
        <span className={`tab ${tab === "plant" ? "active" : ""}`} onClick={() => setTab("plant")}>Plant &amp; Floor</span>
        <span className={`tab ${tab === "size" ? "active" : ""}`} onClick={() => setTab("size")}>Size Group Master</span>
        <span className={`tab ${tab === "status" ? "active" : ""}`} onClick={() => setTab("status")}>Status Master</span>
      </div>

      {tab === "item" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <div className="search-box" style={{ marginBottom: 0 }}><Search size={15} color="var(--muted)" /><input placeholder="ค้นหา SYNNEX ID / Item ID / Part ID / Part No / Brand / ชื่อสินค้า…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <button className="btn" onClick={() => setItemModal({ id: "", partId: "", itemCode: "", brand: "", partNo: "", name: "", abc: "A", storage: "Rack", tixHi: "", stickerRequired: true, receiveMinAgeDays: 0, receiveMaxAgeDays: 3650, dim: { l: 0, w: 0, h: 0, wt: 0 }, pack: { boxPerPallet: 0, piecePerPallet: 0, boxPerBasket: 0, piecePerBasket: 0 }, dailySales: 0 })}><PlusCircle size={13} /> เพิ่มสินค้าใหม่</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>SYNNEX ID</th><th>Item ID</th><th>Brand</th><th>ชื่อสินค้า</th><th>Receiving Min Age</th><th>Receiving Max Age</th><th>ต้องติด Sticker</th><th>Sticker Size</th><th>Part ID</th><th>Part No.</th><th>ABC</th><th>Size</th><th>TixHi</th><th>Length cm</th><th>Width cm</th><th>Height cm</th><th>Weight kg</th><th></th></tr></thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className="clickable" onClick={() => setDetail(it)}>
                    <td className="mono">{it.id}</td><td className="mono">{it.itemCode}</td><td>{it.brand}</td><td>{it.name}</td><td className="mono">{receivingAgeRuleOf(it).minAgeDays} วัน</td><td className="mono">{receivingAgeRuleOf(it).maxAgeDays} วัน</td><td>{it.stickerRequired ? <span className="scan-step done">ต้องติด</span> : <span className="kpi-sub">ไม่ต้องติด</span>}</td><td><span className="status-badge" style={{ background: "var(--teal)" }}>{stickerSizeForItem(it)}</span></td><td className="mono">{it.partId}</td><td className="mono">{it.partNo}</td>
                    <td><span className={`badge ${it.abc}`}>{it.abc}</span></td><td><SizeBadge item={it} /></td><td className="mono">{it.tixHi}</td>
                    <td className="mono">{it.dim.l}</td><td className="mono">{it.dim.w}</td><td className="mono">{it.dim.h}</td><td className="mono">{it.dim.wt}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn secondary" onClick={(e) => { e.stopPropagation(); setItemModal({ ...it, _editing: true }); }}><Edit3 size={12} /></button>
                      <ChevronRight size={14} color="var(--muted)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "synnex" && <SynnexIdRulePanel onCreateItem={(id) => setItemModal({ id, partId: "", itemCode: id, brand: "", partNo: "", name: "", abc: "A", storage: "Rack", tixHi: "", stickerRequired: true, receiveMinAgeDays: 0, receiveMaxAgeDays: 3650, dim: { l: 0, w: 0, h: 0, wt: 0 }, pack: { boxPerPallet: 0, piecePerPallet: 0, boxPerBasket: 0, piecePerBasket: 0 }, dailySales: 0 })} />}

      {tab === "loc" && (
        <>
          <div style={{ marginBottom: 12 }}><button className="btn" onClick={() => setLocModal({ code: "", plant: PLANTS[0].id, floor: FLOORS[0].id, zone: "", type: "Rack", system: "Manual", capacity: 500, status: "AVL" })}><PlusCircle size={13} /> เพิ่ม Location ใหม่</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Location</th><th>Plant / WH</th><th>Floor</th><th>Zone</th><th>ประเภท</th><th>System</th><th>Capacity</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {LOCATIONS.map((l) => (
                  <tr key={l.code}>
                    <td className="mono">{l.code}</td><td>{plantLabelOf(l.plant)}</td><td>{floorOf(l.floor)?.name}</td><td>{l.zone}</td><td>{l.type}</td>
                    <td><span className={`sys-tag ${l.system}`}>{l.system}</span></td>
                    <td>{l.capacity.toLocaleString()}</td><td><StatusBadge code={l.status} /></td>
                    <td><button className="btn secondary" onClick={() => setLocModal({ ...l, _editing: true, _origCode: l.code })}><Edit3 size={12} /> แก้ไข</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "plant" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button className="btn secondary" onClick={() => setPlantModal({ id: "", erpCode: "", name: "" })}><PlusCircle size={13} /> เพิ่ม Plant</button>
            <button className="btn secondary" onClick={() => setFloorModal({ id: "", plant: PLANTS[0].id, name: "" })}><PlusCircle size={13} /> เพิ่ม Floor</button>
          </div>
          <div className="grid g2">
            {PLANTS.map((p) => (
              <div className="card" key={p.id}>
                <h3>{p.erpCode} · {p.id}</h3>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{p.name}</div>
                {FLOORS.filter((f) => f.plant === p.id).map((f) => (
                  <div key={f.id} className="recall-row"><span>{f.name}</span><span className="mono" style={{ color: "var(--muted)" }}>{LOCATIONS.filter((l) => l.floor === f.id).length} Location</span></div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "size" && (
        <>
          <div className="ai-box">
            <div className="row">
              <Settings2 size={18} color="var(--amber)" />
              <div>
                <div style={{ fontWeight: 700 }}>Size Group Rule</div>
                <div className="kpi-sub">ระบบจะเรียงมิติสินค้าเป็น ด้านยาวสุด x ด้านกลาง x ด้านสั้น แล้วเทียบกับ rule S/M/L/XL อัตโนมัติ</div>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}><button className="btn" onClick={() => setSizeModal({ code: "", name: "", maxL: 0, maxW: 0, maxH: 0, maxWt: 0, color: "#3E7EE0", stickerSize: "M" })}><PlusCircle size={13} /> เพิ่ม Size Group</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Size</th><th>ชื่อ</th><th>Sticker Size</th><th>Max Dimension Rule</th><th>Max Weight</th><th>จำนวนสินค้า</th><th></th></tr></thead>
              <tbody>
                {SIZE_GROUPS.map((s) => (
                  <tr key={s.code}>
                    <td><span className="status-badge" style={{ background: s.color }}>{s.code}</span></td>
                    <td>{s.name}</td>
                    <td><span className="status-badge" style={{ background: "var(--teal)" }}>{s.stickerSize || s.code}</span></td>
                    <td className="mono">{s.maxL} x {s.maxW} x {s.maxH} cm</td>
                    <td className="mono">{s.maxWt} kg</td>
                    <td>{ITEMS.filter((it) => sizeGroupOf(it).code === s.code).length}</td>
                    <td><button className="btn secondary" onClick={() => setSizeModal({ ...s, _editing: true, _origCode: s.code })}><Edit3 size={12} /> แก้ไข</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "status" && (
        <>
          <div style={{ marginBottom: 12 }}><button className="btn" onClick={() => setStatusModal({ code: "", name: "", th: "", color: "var(--teal)" })}><PlusCircle size={13} /> เพิ่ม Status ใหม่</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Status Code</th><th>ชื่อ</th><th>คำอธิบาย</th><th>จำนวน Location ที่ใช้อยู่</th></tr></thead>
              <tbody>
                {STATUS_LIST.map((s) => (
                  <tr key={s.code}><td><StatusBadge code={s.code} /></td><td>{s.name}</td><td>{s.th}</td><td>{LOCATIONS.filter((l) => l.status === s.code).length}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {detail && (
        <Modal onClose={() => setDetail(null)} width={520}>
          <h2>{detail.name}</h2>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>SYNNEX ID {detail.id} · Item ID {detail.itemCode} · Part ID {detail.partId} · Part No. {detail.partNo} · Brand {detail.brand}</div>
          <div className="grid g2" style={{ marginBottom: 14 }}>
            <div className="mini-stat"><div className="lbl">TixHi (Ti ร— Hi)</div><div className="val mono">{detail.tixHi}</div></div>
            <div className="mini-stat"><div className="lbl">ABC Class</div><div className="val">{detail.abc}</div></div>
            <div className="mini-stat"><div className="lbl">Size Group</div><div className="val"><SizeBadge item={detail} /> <span className="mono" style={{ marginLeft: 6 }}>{sizeGroupOf(detail).name}</span></div></div>
            <div className="mini-stat"><div className="lbl">Dimension</div><div className="val mono">{detail.dim.l}x{detail.dim.w}x{detail.dim.h} ซม.</div></div>
            <div className="mini-stat"><div className="lbl">น้ำหนัก</div><div className="val mono">{detail.dim.wt} กก.</div></div>
            <div className="mini-stat"><div className="lbl">Receiving Age Rule</div><div className="val mono">{receivingAgeRuleOf(detail).minAgeDays}-{receivingAgeRuleOf(detail).maxAgeDays} วัน</div></div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 6 }}>Pack Key</div>
          <div className="table-wrap">
            <table><tbody>
              <tr><td>กล่อง / พาเลท</td><td className="mono">{detail.pack.boxPerPallet || "—"}</td></tr>
              <tr><td>ชิ้น / พาเลท</td><td className="mono">{detail.pack.piecePerPallet || "—"}</td></tr>
              <tr><td>กล่อง / ตะกร้า</td><td className="mono">{detail.pack.boxPerBasket || "—"}</td></tr>
              <tr><td>ชิ้น / ตะกร้า</td><td className="mono">{detail.pack.piecePerBasket || "—"}</td></tr>
            </tbody></table>
          </div>
        </Modal>
      )}

      {itemModal && <ItemFormModal form={itemModal} onClose={() => setItemModal(null)} onSave={saveItem} />}
      {locModal && <LocFormModal form={locModal} onClose={() => setLocModal(null)} onSave={saveLoc} />}
      {plantModal && <PlantFormModal form={plantModal} onClose={() => setPlantModal(null)} onSave={savePlant} />}
      {floorModal && <FloorFormModal form={floorModal} onClose={() => setFloorModal(null)} onSave={saveFloor} />}
      {statusModal && <StatusFormModal form={statusModal} onClose={() => setStatusModal(null)} onSave={saveStatus} />}
      {sizeModal && <SizeGroupModal form={sizeModal} onClose={() => setSizeModal(null)} onSave={saveSize} />}
    </>
  );
}

function SynnexIdRulePanel({ onCreateItem }) {
  const [project, setProject] = useState("990");
  const [sales, setSales] = useState("001");
  const [item, setItem] = useState("0001");
  const generated = formatSynnexId(project, sales, item);
  const examples = [
    ["990", "001", "0001", "สินค้าพร้อมขาย - Apple - ลำดับที่ 0001"],
    ["110", "003", "0250", "งานโครงการ - Samsung - ลำดับที่ 0250"],
    ["220", "002", "0105", "Gift/ของแถม - Huawei - ลำดับที่ 0105"],
    ["330", "004", "0033", "สินค้า Service - Canon - ลำดับที่ 0033"],
    ["990", "099", "1500", "สินค้าพร้อมขาย - Other - ลำดับที่ 1500"],
  ];
  return (
    <>
      <div className="synnex-rule-hero">
        <div>
          <h2>หลักเกณฑ์การตั้งรหัส SYNNEX ID</h2>
          <p>มาตรฐานรหัสสินค้า 10 หลัก เพื่อรวมรหัสสินค้าเป็นมาตรฐานเดียว ใช้ร่วมกันใน WMS, ERP, POS, e-Commerce และ Report</p>
        </div>
        <div className="synnex-id-preview">
          <span>SYNNEX ID (10 หลัก)</span>
          <b>{prettySynnexId(generated)}</b>
          <small>{generated}</small>
        </div>
      </div>
      <div className="grid g3" style={{ marginBottom: 18 }}>
        <div className="card synnex-code-card">
          <h3>Digit 1-3 · Project Code</h3>
          <div className="synnex-digits"><i>XXX</i><span>-</span><em>XXX</em><span>-</span><strong>XXXX</strong></div>
          <div className="kpi-sub">บอกประเภทสินค้า / ลักษณะการใช้งาน</div>
        </div>
        <div className="card synnex-code-card">
          <h3>Digit 4-6 · Sales Dept. Code</h3>
          <div className="synnex-digits"><i>XXX</i><span>-</span><em>XXX</em><span>-</span><strong>XXXX</strong></div>
          <div className="kpi-sub">ระบุแผนกหรือทีมขายหลักที่รับผิดชอบสินค้า</div>
        </div>
        <div className="card synnex-code-card">
          <h3>Digit 7-10 · Item Code</h3>
          <div className="synnex-digits"><i>XXX</i><span>-</span><em>XXX</em><span>-</span><strong>XXXX</strong></div>
          <div className="kpi-sub">ลำดับสินค้าในแผนก ช่วง 0001-9999 ห้ามซ้ำ</div>
        </div>
      </div>
      <div className="grid g2" style={{ marginBottom: 18 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Project Code</th><th>ประเภท</th><th>ความหมาย</th></tr></thead>
            <tbody>{SYNNEX_PROJECT_CODES.map((r) => <tr key={r.code}><td className="mono">{r.code}</td><td>{r.type}</td><td>{r.meaning}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Sales Code</th><th>ทีมขาย</th><th>ตัวอย่างกลุ่มสินค้า</th></tr></thead>
            <tbody>{SYNNEX_SALES_CODES.map((r) => <tr key={r.code}><td className="mono">{r.code}</td><td>{r.team}</td><td>{r.example}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="section-title" style={{ marginTop: 0 }}>ตัวช่วยสร้าง SYNNEX ID</div>
        <div className="grid g4">
          <div className="field"><label>Project Code</label><select value={project} onChange={(e) => setProject(e.target.value)}>{SYNNEX_PROJECT_CODES.map((r) => <option key={r.code} value={r.code}>{r.code} · {r.type}</option>)}</select></div>
          <div className="field"><label>Sales Dept. Code</label><select value={sales} onChange={(e) => setSales(e.target.value)}>{SYNNEX_SALES_CODES.map((r) => <option key={r.code} value={r.code}>{r.code} · {r.team}</option>)}</select></div>
          <div className="field"><label>Item Code</label><input value={item} maxLength={4} onChange={(e) => setItem(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0001" /></div>
          <div className="field"><label>Generated ID</label><input value={prettySynnexId(generated)} readOnly /></div>
        </div>
        <div className="scan-steps-row">
          <span className="scan-step done"><CheckCircle2 size={11} /> 1 SKU = 1 SYNNEX ID</span>
          <span className="scan-step done"><CheckCircle2 size={11} /> ใช้ตัวเลข 0-9 เท่านั้น</span>
          <span className="scan-step done"><CheckCircle2 size={11} /> ห้ามซ้ำในแผนกเดียวกัน</span>
          <span className="scan-step done"><CheckCircle2 size={11} /> อนุมัติก่อนใช้งานจริง</span>
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={() => onCreateItem(generated)}><PlusCircle size={13} /> สร้างสินค้าใหม่ด้วยรหัสนี้</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>SYNNEX ID</th><th>ความหมาย</th><th>Project</th><th>Sales Dept.</th><th>Item Code</th></tr></thead>
          <tbody>{examples.map(([p, s, i, text]) => <tr key={`${p}${s}${i}`}><td className="mono">{prettySynnexId(`${p}${s}${i}`)}</td><td>{text}</td><td className="mono">{p}</td><td className="mono">{s}</td><td className="mono">{i}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

function ItemFormModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  const setDim = (k, v) => setF({ ...f, dim: { ...f.dim, [k]: Number(v) } });
  const setPack = (k, v) => setF({ ...f, pack: { ...f.pack, [k]: Number(v) } });
  const previewItem = { ...f, dim: f.dim || { l: 0, w: 0, h: 0, wt: 0 } };
  return (
    <Modal onClose={onClose} width={560}>
      <h2>{f._editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
      <div className="grid g2">
        <div className="field"><label>SYNNEX ID</label><input value={f.id} disabled={f._editing} onChange={(e) => setF({ ...f, id: e.target.value })} /></div>
        <div className="field"><label>Item ID</label><input value={f.itemCode} onChange={(e) => setF({ ...f, itemCode: e.target.value })} /></div>
        <div className="field"><label>Part ID</label><input value={f.partId} onChange={(e) => setF({ ...f, partId: e.target.value })} /></div>
        <div className="field"><label>Part No.</label><input value={f.partNo} onChange={(e) => setF({ ...f, partNo: e.target.value })} /></div>
        <div className="field"><label>Brand</label><input value={f.brand} onChange={(e) => setF({ ...f, brand: e.target.value })} /></div>
        <div className="field"><label>ABC Class</label><select value={f.abc} onChange={(e) => setF({ ...f, abc: e.target.value })}><option>A</option><option>B</option><option>C</option></select></div>
      </div>
      <div className="field"><label>ชื่อสินค้า</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <label className="chip active" style={{ width: "fit-content", marginBottom: 12 }}>
        <input type="checkbox" checked={!!f.stickerRequired} onChange={(e) => setF({ ...f, stickerRequired: e.target.checked })} style={{ marginRight: 6 }} />
        ต้องติดสติ๊กเกอร์ก่อนขาย / Allocate
      </label>
      <div className="field"><label>Sticker Size Override</label><select value={f.stickerSize || ""} onChange={(e) => setF({ ...f, stickerSize: e.target.value || undefined })}><option value="">Auto ตาม Size Group</option><option>S</option><option>M</option><option>L</option></select></div>
      <div className="grid g2">
        <div className="field"><label>TixHi (Ti x Hi)</label><input value={f.tixHi} onChange={(e) => setF({ ...f, tixHi: e.target.value })} placeholder="เช่น 8x5" /></div>
        <div className="field"><label>ยอดขายเฉลี่ย/วัน</label><input type="number" value={f.dailySales} onChange={(e) => setF({ ...f, dailySales: Number(e.target.value) })} /></div>
      </div>
      <div className="kpi-sub" style={{ margin: "4px 0 8px" }}>Receiving Age Rule / เงื่อนไขอายุสินค้าตอนรับเข้า</div>
      <div className="grid g2">
        <div className="field"><label>Min Age Days</label><input type="number" value={f.receiveMinAgeDays ?? 0} onChange={(e) => setF({ ...f, receiveMinAgeDays: Number(e.target.value) })} /></div>
        <div className="field"><label>Max Age Days (Reject if older)</label><input type="number" value={f.receiveMaxAgeDays ?? 3650} onChange={(e) => setF({ ...f, receiveMaxAgeDays: Number(e.target.value) })} /></div>
      </div>
      <div className="kpi-sub" style={{ margin: "4px 0 8px" }}>Dimension (ซม. / กก.)</div>
      <div className="grid g4">
        <div className="field"><label>Length</label><input type="number" value={f.dim.l} onChange={(e) => setDim("l", e.target.value)} /></div>
        <div className="field"><label>Width</label><input type="number" value={f.dim.w} onChange={(e) => setDim("w", e.target.value)} /></div>
        <div className="field"><label>Height</label><input type="number" value={f.dim.h} onChange={(e) => setDim("h", e.target.value)} /></div>
        <div className="field"><label>Weight</label><input type="number" value={f.dim.wt} onChange={(e) => setDim("wt", e.target.value)} /></div>
      </div>
      <div className="mini-stat" style={{ marginBottom: 12 }}>
        <div className="lbl">Calculated Size Group</div>
        <div className="val"><SizeBadge item={previewItem} /> <span className="mono" style={{ marginLeft: 8 }}>{sizeTextOf(previewItem)}</span></div>
      </div>
      <div className="kpi-sub" style={{ margin: "4px 0 8px" }}>Pack Key</div>
      <div className="grid g4">
        <div className="field"><label>กล่อง/พาเลท</label><input type="number" value={f.pack.boxPerPallet} onChange={(e) => setPack("boxPerPallet", e.target.value)} /></div>
        <div className="field"><label>ชิ้น/พาเลท</label><input type="number" value={f.pack.piecePerPallet} onChange={(e) => setPack("piecePerPallet", e.target.value)} /></div>
        <div className="field"><label>กล่อง/ตะกร้า</label><input type="number" value={f.pack.boxPerBasket} onChange={(e) => setPack("boxPerBasket", e.target.value)} /></div>
        <div className="field"><label>ชิ้น/ตะกร้า</label><input type="number" value={f.pack.piecePerBasket} onChange={(e) => setPack("piecePerBasket", e.target.value)} /></div>
      </div>
      <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => onSave(f)} disabled={!f.id || !f.name}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

function SizeGroupModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  const setNum = (k, v) => setF({ ...f, [k]: Number(v) });
  return (
    <Modal onClose={onClose} width={500}>
      <h2>{f._editing ? "แก้ไข Size Group" : "เพิ่ม Size Group"}</h2>
      <div className="grid g2">
        <div className="field"><label>Size Code</label><input value={f.code} disabled={f._editing} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="เช่น S, M, L, XL" /></div>
        <div className="field"><label>ชื่อ Size</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Small / Medium / Large" /></div>
      </div>
      <div className="kpi-sub" style={{ margin: "4px 0 8px" }}>Max Dimension Rule หลังเรียงด้านยาวสุด x ด้านกลาง x ด้านสั้น</div>
      <div className="grid g4">
        <div className="field"><label>Max Long</label><input type="number" value={f.maxL} onChange={(e) => setNum("maxL", e.target.value)} /></div>
        <div className="field"><label>Max Mid</label><input type="number" value={f.maxW} onChange={(e) => setNum("maxW", e.target.value)} /></div>
        <div className="field"><label>Max Short</label><input type="number" value={f.maxH} onChange={(e) => setNum("maxH", e.target.value)} /></div>
        <div className="field"><label>Max Weight</label><input type="number" value={f.maxWt} onChange={(e) => setNum("maxWt", e.target.value)} /></div>
      </div>
      <div className="field"><label>สี Badge</label><input type="color" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} /></div>
      <div className="field"><label>Sticker Size Mapping</label><select value={f.stickerSize || f.code || "M"} onChange={(e) => setF({ ...f, stickerSize: e.target.value })}><option>S</option><option>M</option><option>L</option></select></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(f)} disabled={!f.code || !f.name}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

function LocFormModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  return (
    <Modal onClose={onClose} width={460}>
      <h2>{f._editing ? "แก้ไข Location" : "เพิ่ม Location ใหม่"}</h2>
      <div className="field"><label>รหัส Location</label><input value={f.code} disabled={f._editing} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="เช่น E-01-01-A" /></div>
      <div className="grid g2">
        <div className="field"><label>Plant</label><select value={f.plant} onChange={(e) => setF({ ...f, plant: e.target.value })}>{PLANTS.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}</select></div>
        <div className="field"><label>Floor</label><select value={f.floor} onChange={(e) => setF({ ...f, floor: e.target.value })}>{FLOORS.filter((fl) => fl.plant === f.plant).map((fl) => <option key={fl.id} value={fl.id}>{fl.name}</option>)}</select></div>
        <div className="field"><label>Zone</label><input value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })} /></div>
        <div className="field"><label>ประเภท</label><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option>Rack</option><option>Bin</option><option>Floor</option><option>ASRS</option><option>QC</option><option>Staging</option></select></div>
        <div className="field"><label>ระบบ</label><select value={f.system} onChange={(e) => setF({ ...f, system: e.target.value })}><option>Manual</option><option>Miniload</option><option>ASRS</option></select></div>
        <div className="field"><label>Capacity</label><input type="number" value={f.capacity} onChange={(e) => setF({ ...f, capacity: Number(e.target.value) })} /></div>
      </div>
      <div className="field"><label>Status</label><select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(f)} disabled={!f.code}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

function PlantFormModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  return (
    <Modal onClose={onClose} width={380}>
      <h2>เพิ่ม Plant ใหม่</h2>
      <div className="field"><label>รหัส Plant ใน WMS</label><input value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} placeholder="เช่น BKK3" /></div>
      <div className="field"><label>เลข Plant สำหรับ D365 / SAP</label><input value={f.erpCode || ""} onChange={(e) => setF({ ...f, erpCode: e.target.value })} placeholder="เช่น 1122" /></div>
      <div className="field"><label>ชื่อ Plant</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(f)} disabled={!f.id || !f.name}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

function FloorFormModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  return (
    <Modal onClose={onClose} width={380}>
      <h2>เพิ่ม Floor ใหม่</h2>
      <div className="field"><label>Plant</label><select value={f.plant} onChange={(e) => setF({ ...f, plant: e.target.value })}>{PLANTS.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}</select></div>
      <div className="field"><label>รหัส Floor</label><input value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} placeholder="เช่น BKK1-3" /></div>
      <div className="field"><label>ชื่อ Floor</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(f)} disabled={!f.id || !f.name}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

function StatusFormModal({ form: init, onClose, onSave }) {
  const [f, setF] = useState(init);
  const colorOptions = [{ v: "var(--teal)", l: "ฟ้า/น้ำเงิน" }, { v: "var(--amber)", l: "ฟ้าอ่อนนีออน" }, { v: "var(--success)", l: "เขียว" }, { v: "var(--danger)", l: "แดง" }, { v: "var(--muted)", l: "เทา" }];
  return (
    <Modal onClose={onClose} width={400}>
      <h2>เพิ่ม Status ใหม่</h2>
      <div className="field"><label>Status Code</label><input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="เช่น RSRV" /></div>
      <div className="field"><label>ชื่อ (EN)</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div className="field"><label>คำอธิบาย (TH)</label><input value={f.th} onChange={(e) => setF({ ...f, th: e.target.value })} /></div>
      <div className="field"><label>สี</label><select value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })}>{colorOptions.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}</select></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(f)} disabled={!f.code || !f.name}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

/* ================================================================== */
/* APPOINTMENT SCHEDULING — dock/yard calendar + PO/Invoice → ASN       */
/* ================================================================== */

function slotHour(timeStr) { return timeStr.split("–")[0]; }

function AppointmentScheduling({ dockSlots, setDockSlots, poList, setPoList, addTx }) {
  const [date, setDate] = useState("2569-07-08");
  const [booking, setBooking] = useState(null); // { dock, hour } when opening blank-cell form
  const [detail, setDetail] = useState(null); // slot detail / ASN doc
  const emptyLine = () => ({ itemId: ITEMS[0].id, expQty: 1, trackingLevel: "Piece", needSn: true, needImei: true });
  const [form, setForm] = useState({ supplier: "", poNumber: "", invoiceNo: "", itemId: ITEMS[0].id, expQty: "", plate: "", lines: [emptyLine()] });

  const dayList = dockSlots.filter((d) => d.date === date);
  const todayAll = dockSlots.filter((d) => d.date === "2569-07-08");
  const countByDate = {};
  dockSlots.forEach((d) => { countByDate[d.date] = (countByDate[d.date] || 0) + 1; });

  const cellSlot = (dock, hour) => dayList.find((d) => d.dock === dock && slotHour(d.time) === hour);

  const openBookingCell = (dock, hour) => { setBooking({ dock, hour }); setForm({ supplier: "", poNumber: "", invoiceNo: "", itemId: ITEMS[0].id, expQty: "", plate: "", lines: [emptyLine()] }); };
  const updateLine = (idx, patch) => setForm((f) => ({ ...f, lines: f.lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)) }));
  const updateLineSynnex = (idx, id) => {
    const matched = ITEMS.find((item) => item.id === id.trim());
    updateLine(idx, { itemId: matched?.id || id });
  };
  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, emptyLine()] }));
  const removeLine = (idx) => setForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));

  const submitBooking = () => {
    if (!form.supplier || !form.poNumber) return;
    const id = `DK-${rand(1000, 9999)}`;
    const endHour = String(parseInt(booking.hour, 10) + 1).padStart(2, "0") + ":00";
    const lines = (form.lines?.length ? form.lines : [{ itemId: form.itemId, expQty: Number(form.expQty) || 0 }]).map((l) => ({ ...l, expQty: Number(l.expQty) || 0, actualQty: null, remark: "", status: "Pending" }));
    const expQty = lines.reduce((a, l) => a + l.expQty, 0);
    setDockSlots((list) => [...list, {
      id, date, time: `${booking.hour}–${endHour}`, dock: booking.dock, supplier: form.supplier, plate: form.plate || "-",
      status: "Booked", poNumber: form.poNumber, invoiceNo: form.invoiceNo || "-", itemId: lines[0]?.itemId, expQty, lines,
    }]);
    // sync into Receiving PO queue so the appointment flows straight into ASN-based receiving
    setPoList((list) => (list.some((p) => p.po === form.poNumber) ? list : [...list, {
      po: form.poNumber, supplier: form.supplier, itemId: lines[0]?.itemId, expQty, lines, dock: booking.dock, actualQty: null, remark: "", status: "Pending",
    }]));
    addTx({ type: "ASN", detail: `สร้าง Advance Shipment Notice ${form.poNumber} (${form.invoiceNo || "ไม่มีเลข Invoice"}) · จอง ${booking.dock} ${booking.hour} · ${lines.length} รายการ · ${expQty} หน่วย`, itemId: lines[0]?.itemId });
    setBooking(null);
  };

  const advanceStatus = (slot) => {
    const flow = ["Booked", "Arrived", "Receiving", "Completed"];
    const next = flow[flow.indexOf(slot.status) + 1];
    if (!next) return;
    setDockSlots((list) => list.map((d) => (d.id === slot.id ? { ...d, status: next } : d)));
    addTx({ type: "ASN", detail: `${slot.poNumber} (${slot.id}) เปลี่ยนสถานะ Appointment → ${next}`, itemId: slot.itemId });
    setDetail((d) => (d ? { ...d, status: next } : d));
  };

  const dockUtil = DOCKS.map((dk) => ({ dock: dk, used: dayList.filter((d) => d.dock === dk).length, total: TIME_SLOTS.length }));

  return (
    <>
      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card"><h3>นัดหมายวันนี้</h3><div className="kpi-val">{todayAll.length}</div></div>
        <div className="card"><h3>รถถึงแล้ว (Arrived)</h3><div className="kpi-val" style={{ color: "var(--amber)" }}>{todayAll.filter((d) => d.status === "Arrived").length}</div></div>
        <div className="card"><h3>กำลังรับสินค้า</h3><div className="kpi-val" style={{ color: "var(--teal)" }}>{todayAll.filter((d) => d.status === "Receiving").length}</div></div>
        <div className="card"><h3>เสร็จสิ้นแล้ว</h3><div className="kpi-val" style={{ color: "var(--success)" }}>{todayAll.filter((d) => d.status === "Completed").length}</div></div>
      </div>

      <div className="section-title">ปฏิทินสัปดาห์ — เลือกวันที่</div>
      <div className="calendar-grid" style={{ gridTemplateColumns: "repeat(7,1fr)", marginBottom: 20 }}>
        {WEEK_DATES.map((d) => (
          <div key={d} className={`cal-cell clickable ${date === d ? "sel" : ""}`} onClick={() => setDate(d)} style={{ cursor: "pointer", opacity: countByDate[d] ? 1 : 0.5 }}>
            <div className="d">{d.slice(-2)} ก.ค.</div>
            <div className="n">{countByDate[d] || "-"}</div>
          </div>
        ))}
      </div>

      <div className="section-title">ตารางลานโหลดสินค้า (Dock Schedule) — {date}</div>
      <div className="table-wrap" style={{ marginBottom: 20, overflowX: "auto" }}>
        <table>
          <thead><tr><th style={{ minWidth: 80 }}>Dock</th>{TIME_SLOTS.map((h) => <th key={h} className="mono" style={{ minWidth: 96, textAlign: "center" }}>{h}</th>)}</tr></thead>
          <tbody>
            {DOCKS.map((dk) => (
              <tr key={dk}>
                <td style={{ fontWeight: 600 }}>{dk}</td>
                {TIME_SLOTS.map((h) => {
                  const slot = cellSlot(dk, h);
                  return (
                    <td key={h} style={{ padding: 4, textAlign: "center" }}>
                      {slot ? (
                        <div className={`dock-cell ${slot.status}`} onClick={() => setDetail(slot)}>
                          <div style={{ fontWeight: 700 }}>{slot.poNumber}</div>
                          <div style={{ fontSize: 9.5, opacity: .85 }}>{slot.supplier.slice(0, 14)}</div>
                        </div>
                      ) : (
                        <div className="dock-cell empty" onClick={() => openBookingCell(dk, h)}>+ จอง</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">การใช้งานลาน (Dock Utilization วันนี้)</div>
      <div className="grid g3" style={{ marginBottom: 10 }}>
        {dockUtil.map((u) => (
          <div className="card" key={u.dock}>
            <h3>{u.dock}</h3>
            <div className="kpi-val" style={{ fontSize: 20 }}>{u.used}/{u.total}</div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(u.used / u.total) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      {booking && (
        <Modal onClose={() => setBooking(null)} width={760}>
          <h2>จองพื้นที่ส่งสินค้า (ASN)</h2>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>{booking.dock} · {booking.hour} · {date}</div>
          <div className="field"><label>Supplier</label><input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="ชื่อผู้จำหน่าย" /></div>
          <div className="field"><label>PO Number</label><input value={form.poNumber} onChange={(e) => setForm({ ...form, poNumber: e.target.value })} placeholder="PO-XXXXXXX" /></div>
          <div className="field"><label>Invoice Number</label><input value={form.invoiceNo} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} placeholder="INV-XXXX" /></div>
          <div className="kpi-sub" style={{ margin: "8px 0" }}>รายการสินค้าใน PO / ASN</div>
          {form.lines.map((l, idx) => (
            <div key={idx} className="card" style={{ padding: 12, marginBottom: 10 }}>
              <div className="grid g2">
                <div className="field"><label>SYNNEX ID</label><input value={l.itemId} onChange={(e) => updateLineSynnex(idx, e.target.value)} placeholder="เช่น 6425011001" /></div>
                <div className="field"><label>สินค้า</label><select value={l.itemId} onChange={(e) => updateLine(idx, { itemId: e.target.value })}>{ITEMS.map((i) => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}</select></div>
                <div className="field"><label>จำนวนที่คาดรับ</label><input type="number" value={l.expQty} onChange={(e) => updateLine(idx, { expQty: e.target.value })} /></div>
                <div className="field"><label>Tracking Level</label><select value={l.trackingLevel} onChange={(e) => updateLine(idx, { trackingLevel: e.target.value })}><option>Piece</option><option>Box</option><option>Pallet</option></select></div>
                <div className="field"><label>Traceability</label><select value={`${l.needSn ? "SN" : ""}${l.needImei ? "+IMEI" : ""}`} onChange={(e) => updateLine(idx, { needSn: e.target.value.includes("SN"), needImei: e.target.value.includes("IMEI") })}><option>SN+IMEI</option><option>SN</option><option>IMEI</option><option>ไม่บังคับ</option></select></div>
              </div>
              <button className="btn secondary" onClick={() => removeLine(idx)} disabled={form.lines.length === 1}><Trash2 size={12} /> ลบรายการ</button>
            </div>
          ))}
          <button className="btn secondary" style={{ marginBottom: 12 }} onClick={addLine}><PlusCircle size={12} /> เพิ่มรายการสินค้าใน PO</button>
          <div className="field"><label>ทะเบียนรถ</label><input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="70-XXXX" /></div>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={submitBooking}><CalendarClock size={13} /> ยืนยันการจอง + สร้าง ASN</button>
        </Modal>
      )}

      {detail && (
        <Modal onClose={() => setDetail(null)} width={460}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><FileText size={18} color="var(--amber)" /><h2 style={{ margin: 0 }}>Advance Shipment Notice</h2></div>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>{detail.id} · {detail.dock} · {detail.time} · {detail.date}</div>
          <div className="grid g2" style={{ marginBottom: 14 }}>
            <div className="mini-stat"><div className="lbl">PO Number</div><div className="val mono">{detail.poNumber}</div></div>
            <div className="mini-stat"><div className="lbl">Invoice No.</div><div className="val mono">{detail.invoiceNo}</div></div>
            <div className="mini-stat"><div className="lbl">Supplier</div><div className="val">{detail.supplier}</div></div>
            <div className="mini-stat"><div className="lbl">ทะเบียนรถ</div><div className="val mono">{detail.plate}</div></div>
            <div className="mini-stat"><div className="lbl">สินค้า</div><div className="val">{detail.lines?.length ? `${detail.lines.length} รายการ` : itemOf(detail.itemId)?.name}</div></div>
            <div className="mini-stat"><div className="lbl">จำนวนคาดรับ</div><div className="val mono">{detail.expQty}</div></div>
          </div>
          {detail.lines?.length && (
            <div className="table-wrap" style={{ marginBottom: 14 }}>
              <table>
                <thead><tr><th>Line</th><th>SYNNEX ID</th><th>Item Name</th><th>Expected</th><th>Level</th><th>Traceability</th></tr></thead>
                <tbody>{detail.lines.map((l, idx) => (
                  <tr key={idx}><td>{idx + 1}</td><td className="mono">{l.itemId}</td><td>{itemOf(l.itemId)?.name}</td><td>{l.expQty}</td><td>{l.trackingLevel || "Piece"}</td><td>{l.needSn ? "SN" : ""}{l.needSn && l.needImei ? " + " : ""}{l.needImei ? "IMEI" : ""}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div className="kpi-sub" style={{ marginBottom: 6 }}>สถานะ Appointment</div>
            <div className="scan-steps-row">
              {["Booked", "Arrived", "Receiving", "Completed"].map((s, i) => {
                const idx = ["Booked", "Arrived", "Receiving", "Completed"].indexOf(detail.status);
                return <span key={s} className={`scan-step ${i <= idx ? "done" : ""}`}>{i <= idx ? <CheckCircle2 size={11} /> : <Clock size={11} />} {s}</span>;
              })}
            </div>
          </div>
          {detail.status !== "Completed" && <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => advanceStatus(detail)}>เปลี่ยนสถานะขั้นต่อไป <ArrowRight size={13} /></button>}
          {detail.status === "Receiving" && <div className="kpi-sub" style={{ marginTop: 10, textAlign: "center" }}>ไปที่เมนู "รับสินค้าเข้า → รับด้วย Handheld" เพื่อดำเนินการรับสินค้าตาม PO นี้</div>}
        </Modal>
      )}
    </>
  );
}

/* ================================================================== */
/* RECEIVING                                                            */
/* ================================================================== */

function Receiving({ dockSlots, setDockSlots, poList, setPoList, setStock, addTx, serialUnits, setSerialUnits, notify = () => {} }) {
  const [tab, setTab] = useState("dock");
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({ supplier: "", time: "", dock: "Dock-1", plate: "" });

  const addSlot = () => {
    if (!form.supplier || !form.time) return;
    setDockSlots((s) => [...s, { id: `DK-${rand(1000, 9999)}`, date: "2569-07-08", time: form.time, dock: form.dock, supplier: form.supplier, plate: form.plate || "-", status: "Booked" }]);
    setBooking(false);
    setForm({ supplier: "", time: "", dock: "Dock-1", plate: "" });
  };

  const slotForPo = (po) => dockSlots.find((d) => d.poNumber === po.po)
    || dockSlots.find((d) => d.dock === po.dock && d.itemId === po.itemId && d.supplier === po.supplier);

  const receivingStep = (po, slot) => {
    if (po.status !== "Pending") return 5;
    if (!slot) return 0;
    if (slot.status === "Completed") return 3;
    if (slot.status === "Receiving") return 2;
    if (slot.status === "Arrived") return 1;
    return 0;
  };

  const advanceReceivingSlot = (po, slot) => {
    if (!slot) return;
    const flow = ["Booked", "Arrived", "Receiving", "Completed"];
    const current = flow.indexOf(slot.status);
    const next = flow[current + 1];
    if (!next) return;
    setDockSlots((list) => list.map((d) => (d.id === slot.id ? { ...d, status: next } : d)));
    addTx({ type: "Receive", detail: `${po.po}: อัปเดตสถานะรับเข้า ${slot.status} → ${next}`, itemId: po.itemId });
  };

  return (
    <>
      <div className="tabs">
        <span className={`tab ${tab === "dock" ? "active" : ""}`} onClick={() => setTab("dock")}>นัดหมายรถขนส่ง</span>
        <span className={`tab ${tab === "track" ? "active" : ""}`} onClick={() => setTab("track")}><ClipboardList size={13} style={{ marginRight: 4 }} />ติดตามสถานะ</span>
        <span className={`tab ${tab === "hh" ? "active" : ""}`} onClick={() => setTab("hh")}>รับสินค้าด้วย Handheld</span>
        <span className={`tab ${tab === "sum" ? "active" : ""}`} onClick={() => setTab("sum")}>สรุปการรับสินค้าวันนี้</span>
      </div>

      {tab === "dock" && (
        <>
          <div style={{ marginBottom: 14 }}><button className="btn" onClick={() => setBooking(true)}><Calendar size={13} /> จองคิวใหม่</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Slot ID</th><th>วันที่</th><th>เวลา</th><th>Dock</th><th>Supplier</th><th>ทะเบียนรถ</th><th>สถานะ</th></tr></thead>
              <tbody>
                {dockSlots.map((d) => (
                  <tr key={d.id}><td className="mono">{d.id}</td><td>{d.date}</td><td>{d.time}</td><td>{d.dock}</td><td>{d.supplier}</td><td className="mono">{d.plate}</td>
                    <td><span className={`tag-status ${d.status}`}>{d.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {booking && (
            <Modal onClose={() => setBooking(false)} width={420}>
              <h2>จองคิวรถขนส่งเข้ารับสินค้า</h2>
              <div className="field"><label>Supplier</label><input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="ชื่อผู้จำหน่าย" /></div>
              <div className="field"><label>ช่วงเวลา</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="เช่น 15:00–16:00" /></div>
              <div className="field"><label>Dock</label><select value={form.dock} onChange={(e) => setForm({ ...form, dock: e.target.value })}><option>Dock-1</option><option>Dock-2</option><option>Dock-3</option></select></div>
              <div className="field"><label>ทะเบียนรถ (ถ้ามี)</label><input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="70-XXXX" /></div>
              <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={addSlot}>ยืนยันการจอง</button>
            </Modal>
          )}
        </>
      )}
      {tab === "track" && (
        <>
          {poList.map((p) => {
            const slot = slotForPo(p);
            const step = receivingStep(p, slot);
            const isDone = p.status !== "Pending";
            const isIssue = isDone && p.status !== "รับครบ";
            return (
              <div className="card receiving-track-card" key={p.po} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
                      <span className="mono" style={{ color: "var(--amber)" }}>{p.po}</span> · {poLinesOf(p).length} รายการ · {poExpectedQty(p)} หน่วย
                    </div>
                    <div className="kpi-sub" style={{ marginTop: 4 }}>
                      {p.supplier} · {slot?.dock || p.dock} · {slot?.time || "ยังไม่ระบุเวลา"} · {slot?.plate || "ไม่พบทะเบียนรถ"}
                    </div>
                  </div>
                  <div className="mono kpi-sub">{slot?.date || "2569-07-08"}</div>
                </div>

                <div className="scan-steps-row" style={{ marginTop: 16 }}>
                  {RECEIVING_STEPS.map((s, i) => (
                    <span
                      key={s}
                      className={`scan-step ${i < step || (isDone && i <= step) ? "done" : ""}`}
                      style={i === step && !isDone ? { color: "var(--amber)", background: "rgba(62,126,224,0.12)" } : {}}
                    >
                      {i < step || (isDone && i <= step) ? <CheckCircle2 size={11} /> : <Clock size={11} />} {s}
                    </span>
                  ))}
                </div>

                {isDone ? (
                  <div className="kpi-sub" style={{ marginTop: 12 }}>
                    ผลการรับสินค้า: <b style={{ color: isIssue ? "var(--danger)" : "var(--success)" }}>{p.status}</b>
                    <span> · รับจริง {poActualQty(p)}/{poExpectedQty(p)} หน่วย</span>
                    {p.remark && <span> · {p.remark}</span>}
                  </div>
                ) : (
                  <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {slot && slot.status !== "Completed" && (
                      <button className="btn secondary" onClick={() => advanceReceivingSlot(p, slot)}>
                        ดำเนินการขั้นต่อไป <ArrowRight size={13} />
                      </button>
                    )}
                    {(slot?.status === "Receiving" || slot?.status === "Completed") && (
                      <button className="btn" onClick={() => setTab("hh")}>
                        เปิด Handheld รับสินค้า <Smartphone size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
      {tab === "hh" && <HandheldReceiving poList={poList} setPoList={setPoList} setStock={setStock} addTx={addTx} serialUnits={serialUnits} setSerialUnits={setSerialUnits} notify={notify} />}
      {tab === "sum" && <ReceivingSummary poList={poList} serialUnits={serialUnits} />}
    </>
  );
}

function HandheldReceiving({ poList, setPoList, setStock, addTx, serialUnits, setSerialUnits, notify = () => {} }) {
  const [active, setActive] = useState(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [qty, setQty] = useState("");
  const [remark, setRemark] = useState("ครบถ้วน");
  const [trackingLevel, setTrackingLevel] = useState("Piece");
  const [scanText, setScanText] = useState("");
  const [requireSerial, setRequireSerial] = useState(true);
  const [receiveDate, setReceiveDate] = useState("2569-07-23");
  const [mfgDate, setMfgDate] = useState("2569-06-01");
  const [printed, setPrinted] = useState(false);
  const activeLine = active ? poLinesOf(active)[lineIdx] : null;
  const activeItem = itemOf(activeLine?.itemId || active?.itemId);
  const ageCheck = active ? receivingAgeCheck(activeItem, mfgDate, receiveDate) : { ok: true, ageDays: 0, rule: receivingAgeRuleOf(activeItem), message: "" };
  const openPo = (po) => {
    const first = poLinesOf(po)[0];
    setActive(po); setLineIdx(0); setQty(String(first?.expQty || po.expQty)); setRemark("ครบถ้วน");
    setTrackingLevel(first?.trackingLevel || "Piece"); setRequireSerial(first?.needSn || first?.needImei || false); setScanText(""); setReceiveDate("2569-07-23"); setMfgDate("2569-06-01"); setPrinted(false);
  };
  const switchLine = (idx) => {
    const line = poLinesOf(active)[idx];
    setLineIdx(idx); setQty(String(line?.expQty || 0)); setTrackingLevel(line?.trackingLevel || "Piece"); setRequireSerial(line?.needSn || line?.needImei || false); setScanText(""); setReceiveDate("2569-07-23"); setMfgDate("2569-06-01"); setPrinted(false);
  };

  const parseScans = (actual, itemId, lpn) => {
    if (!requireSerial) {
      return [{ unitId: `UNIT-${rand(100000, 999999)}`, po: active.po, itemId, level: trackingLevel, lpn, sn: "", imei: "", qty: actual, loc: "RECV-DOCK", status: "Received" }];
    }
    const rows = scanText.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
    if (!rows.length) {
      return [{ unitId: `UNIT-${rand(100000, 999999)}`, po: active.po, itemId, level: trackingLevel, lpn, sn: `SN-${active.po}-${itemId.slice(-4)}-AUTO`, imei: `IMEI-${rand(100000000000000, 999999999999999)}`, qty: actual, loc: "RECV-DOCK", status: "Received" }];
    }
    return rows.map((row, idx) => {
      const [snRaw, imeiRaw, levelRaw, qtyRaw] = row.split(/[,\t|]/).map((x) => x?.trim());
      return {
        unitId: `UNIT-${Date.now()}-${idx}`,
        po: active.po,
        itemId,
        level: levelRaw || trackingLevel,
        lpn,
        sn: snRaw || `SN-${active.po}-${idx + 1}`,
        imei: imeiRaw || "",
        qty: Number(qtyRaw) || (trackingLevel === "Piece" ? 1 : actual),
        loc: "RECV-DOCK",
        status: "Received",
      };
    });
  };

  const confirm = () => {
    const actual = parseInt(qty || "0", 10);
    const line = activeLine;
    const expected = Number(line?.expQty || active.expQty || 0);
    const itemId = line?.itemId || active.itemId;
    const item = itemOf(itemId);
    const currentAgeCheck = receivingAgeCheck(item, mfgDate, receiveDate);
    const isAgeReject = !currentAgeCheck.ok;
    const status = isAgeReject ? "ปฏิเสธรับ" : actual >= expected ? "รับครบ" : actual === 0 ? "ปฏิเสธรับ" : "รับไม่ครบ";
    const finalRemark = isAgeReject ? `Reject อายุสินค้า: ${currentAgeCheck.message}` : remark;
    setPoList((list) => list.map((p) => {
      if (p.po !== active.po) return p;
      const lines = poLinesOf(p).map((l, i) => (i === lineIdx ? { ...l, actualQty: isAgeReject ? 0 : actual, receiveDate, mfgDate, receivingAgeDays: currentAgeCheck.ageDays, receivingAgeRule: currentAgeCheck.rule, remark: finalRemark, status, trackingLevel, needSn: requireSerial ? l.needSn : false, needImei: requireSerial ? l.needImei : false } : l));
      const allDone = lines.every((l) => l.status && l.status !== "Pending");
      const totalActual = lines.reduce((a, l) => a + (Number(l.actualQty) || 0), 0);
      return { ...p, lines, actualQty: totalActual, remark: allDone ? "รับครบทุก Line" : "รับบาง Line", status: allDone ? (lines.every((l) => l.status === "รับครบ") ? "รับครบ" : "รับไม่ครบ") : "Pending" };
    }));
    if (isAgeReject) {
      addTx({ type: "Receive Reject", detail: `${active.po} · ${item?.name} ถูก Reject ตอนรับเข้า: ${currentAgeCheck.message} · Receive ${receiveDate} · MFG ${mfgDate}`, itemId, lot: `RCV-${active.po}`, fromLoc: active.dock || "INBOUND-DOCK", toLoc: "REJECT", loc: "REJECT" });
      notify("Handheld Reject รับสินค้า", `${active.po} · ${item?.name}: ${currentAgeCheck.message}`, "danger");
    }
    if (!isAgeReject && actual > 0 && remark !== "ปฏิเสธรับ (Reject)") {
      const stockStatus = remark === "สินค้าเสียหาย" ? "DMG" : "QC";
      const lpn = `LPN-${rand(20000, 99999)}`;
      const stagingLoc = stockStatus === "QC" ? "STAGING-QC" : "RECV-DOCK";
      setStock((list) => [...list, { key: Date.now() + Math.random(), itemId, batch: `RCV-${active.po}`, lpn, loc: stagingLoc, qty: actual, status: stockStatus, age: currentAgeCheck.ageDays || 0, receiveDate, mfgDate, receivingAgeDays: currentAgeCheck.ageDays, receivingAgeRule: currentAgeCheck.rule }]);
      setSerialUnits((list) => [...parseScans(actual, itemId, lpn), ...list]);
      addTx({ type: "Receive", detail: `${active.po} · ${lpn} · ${itemOf(itemId)?.name} รับจริง ${actual}/${expected} · MFG ${mfgDate} · อายุ ${currentAgeCheck.ageDays} วัน → เข้า Staging Area ${stagingLoc} รอ QC/Putaway`, itemId, lpn, lot: `RCV-${active.po}`, fromLoc: active.dock || "INBOUND-DOCK", toLoc: stagingLoc, loc: stagingLoc });
    }
    setPrinted(true);
  };
  const pending = poList.filter((p) => p.status === "Pending");

  return (
    <div className="grid g2" style={{ alignItems: "flex-start" }}>
      <div>
        <div className="section-title" style={{ marginTop: 0 }}>PO รอรับสินค้า</div>
        {pending.length === 0 && <div className="kpi-sub">รับสินค้าครบทุกใบสำหรับวันนี้แล้ว</div>}
        {pending.map((p) => (
          <div className="po-row" key={p.po}>
            <ScanLine size={20} color="var(--teal)" />
            <div className="po-info"><div className="sup">{p.supplier} <span className="po-id">· {p.po}</span></div><div className="meta">{poLinesOf(p).length} รายการ · คาดรับ {poExpectedQty(p)} หน่วย · {p.dock} · Age Rule {receivingAgeRuleOf(itemOf(poLinesOf(p)[0]?.itemId || p.itemId)).minAgeDays}-{receivingAgeRuleOf(itemOf(poLinesOf(p)[0]?.itemId || p.itemId)).maxAgeDays} วัน</div></div>
            <button className="btn" onClick={() => openPo(p)}>เปิด Handheld <ArrowRight size={13} /></button>
          </div>
        ))}
        <div className="section-title">รับสินค้าแล้ววันนี้</div>
        {poList.filter((p) => p.status !== "Pending").map((p) => (
          <div className="po-row" key={p.po}>
            <PackageCheck size={18} color={p.status === "รับครบ" ? "var(--success)" : "var(--danger)"} />
            <div className="po-info"><div className="sup">{p.supplier} <span className="po-id">· {p.po}</span></div><div className="meta">รับจริง {poActualQty(p)}/{poExpectedQty(p)} · {p.remark}</div></div>
            <span className={`tag-status ${p.status === "รับครบ" ? "Arrived" : "Hold"}`}>{p.status}</span>
          </div>
        ))}
      </div>

      <div className="handheld">
        <div className="handheld-screen">
          {!active && <div className="kpi-sub" style={{ textAlign: "center", padding: "60px 10px" }}><Smartphone size={28} style={{ marginBottom: 10 }} /><br />เลือก PO ทางซ้ายเพื่อเริ่มสแกนรับสินค้าด้วย Handheld</div>}
          {active && !printed && (
            <>
              <div className="kpi-sub" style={{ marginBottom: 4 }}>สแกน Barcode สำเร็จ</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {poLinesOf(active).map((l, i) => <span key={i} className={`chip ${lineIdx === i ? "active" : ""}`} onClick={() => switchLine(i)}>Line {i + 1}</span>)}
              </div>
              <div className="item-heading"><ItemCell itemId={activeLine?.itemId} /></div>
              <div className="scan-step" style={{ display: "inline-flex", marginBottom: 10, color: "var(--amber)", background: "rgba(62,126,224,.12)" }}><ShieldAlert size={11} /> ตรวจอายุรับเข้า: รับได้ {ageCheck.rule.minAgeDays}-{ageCheck.rule.maxAgeDays} วัน นับจากวันผลิตถึงวันที่รับเข้า</div>
              <div className="field"><label>PO Number</label><input value={active.po} disabled /></div>
              <div className="field"><label>จำนวนที่คาดรับ</label><input value={activeLine?.expQty || 0} disabled /></div>
              <div className="field"><label>จำนวนที่รับจริง</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div className="grid g2 receiving-date-grid">
                <div className="field"><label>วันที่รับเข้า</label><input value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} placeholder="2569-07-23" /></div>
                <div className="field"><label>วันผลิตสินค้า (MFG Date)</label><input value={mfgDate} onChange={(e) => setMfgDate(e.target.value)} placeholder="2569-06-01" /></div>
              </div>
              <div className={`allocation-shortage`} style={{ color: ageCheck.ok ? "var(--success)" : "var(--danger)", background: ageCheck.ok ? "rgba(32,199,102,.10)" : "rgba(241,91,113,.12)", borderColor: ageCheck.ok ? "rgba(32,199,102,.25)" : "rgba(241,91,113,.35)" }}>
                {ageCheck.ok ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span>{ageCheck.message} · Rule: {ageCheck.rule.minAgeDays}-{ageCheck.rule.maxAgeDays} วัน</span>
              </div>
              <div className="field"><label>รับระดับ</label><select value={trackingLevel} onChange={(e) => setTrackingLevel(e.target.value)}><option>Piece</option><option>Box</option><option>Pallet</option></select></div>
              <label className="checkline"><input type="checkbox" checked={requireSerial} onChange={(e) => setRequireSerial(e.target.checked)} /> เปิดโหมดบังคับสแกน SN / IMEI สำหรับ PO Line นี้</label>
              <div className="field"><label>{requireSerial ? "SN / IMEI Scan Records" : "Scan Item only แล้วออก LPN"}</label><textarea rows={4} value={scanText} onChange={(e) => setScanText(e.target.value)} disabled={!requireSerial} placeholder={requireSerial ? "รูปแบบ: SN, IMEI, Level, Qty\nเช่น SN-A001, 356789123456789, Piece, 1\nหรือ BOX-001, , Box, 24" : "PO นี้ไม่บังคับ SN / IMEI: รับจำนวนจริงแล้วระบบจะออก LPN ให้ทันที"} /></div>
              <div className="field"><label>หมายเหตุ (หากไม่ครบ / เสียหาย / ปฏิเสธรับ)</label>
                <select value={remark} onChange={(e) => setRemark(e.target.value)}>
                  <option>ครบถ้วน</option><option>ขาดจำนวน</option><option>สินค้าเกิน</option><option>สินค้าเสียหาย</option><option>ปฏิเสธรับ (Reject)</option>
                </select>
              </div>
              <button className="btn" style={{ width: "100%", justifyContent: "center", background: ageCheck.ok ? undefined : "var(--danger)", color: ageCheck.ok ? undefined : "#FFFFFF" }} onClick={confirm}>{ageCheck.ok ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />} {ageCheck.ok ? "ยืนยันรับสินค้า" : "Reject รับสินค้า"}</button>
            </>
          )}
          {active && printed && (
            <div style={{ textAlign: "center", padding: "20px 6px" }}>
              <Printer size={30} color="var(--teal)" style={{ marginBottom: 10 }} />
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, marginBottom: 6 }}>ใบรับสินค้า (Receiving Slip)</div>
              <div className="kpi-sub">{active.po} · Line {lineIdx + 1} · {activeLine?.itemId} · {itemOf(activeLine?.itemId)?.name}</div>
              <div className="kpi-sub" style={{ margin: "8px 0" }}>รับจริง {ageCheck.ok ? qty : 0} / {activeLine?.expQty} หน่วย — {ageCheck.ok ? remark : `Reject: ${ageCheck.message}`}</div>
              <div className={`scan-step ${ageCheck.ok ? "done" : ""}`} style={{ display: "inline-flex", marginBottom: 8, color: ageCheck.ok ? undefined : "var(--danger)", background: ageCheck.ok ? undefined : "rgba(241,91,113,.10)" }}>{ageCheck.ok ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />} อายุสินค้า {ageCheck.ageDays ?? "-"} วัน · MFG {mfgDate} · รับเข้า {receiveDate}</div><br />
              {ageCheck.ok ? <><div className="scan-step done" style={{ display: "inline-flex", marginBottom: 8 }}><ShieldCheck size={11} /> บันทึก SN/IMEI แล้ว {serialUnits.filter((u) => u.po === active.po).length} record</div><br /><div className="scan-step done" style={{ display: "inline-flex", marginBottom: 14 }}><CheckCircle2 size={11} /> พิมพ์ LPN Label สำเร็จ</div><br /></> : <><div className="scan-step" style={{ display: "inline-flex", marginBottom: 14, color: "var(--danger)", background: "rgba(241,91,113,.10)" }}><ShieldAlert size={11} /> ไม่สร้าง LPN / ไม่รับเข้า Stock</div><br /></>}
              <button className="btn secondary" onClick={() => setActive(null)}>เสร็จสิ้น กลับสู่คิวงาน</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReceivingSummary({ poList, serialUnits = [] }) {
  const totalExp = poList.reduce((a, p) => a + poExpectedQty(p), 0);
  const totalAct = poList.reduce((a, p) => a + poActualQty(p), 0);
  const completed = poList.filter((p) => p.status !== "Pending").length;
  const fillRate = totalExp ? ((totalAct / totalExp) * 100).toFixed(1) : "0.0";
  return (
    <>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <div className="card"><h3>PO ทั้งหมดวันนี้</h3><div className="kpi-val">{poList.length}</div><div className="kpi-sub">ดำเนินการแล้ว {completed} ใบ</div></div>
        <div className="card"><h3>จำนวนที่คาดรับ</h3><div className="kpi-val">{totalExp.toLocaleString()}</div></div>
        <div className="card"><h3>จำนวนที่รับจริง</h3><div className="kpi-val">{totalAct.toLocaleString()}</div></div>
        <div className="card"><h3>Fill Rate</h3><div className="kpi-val">{fillRate}%</div><div className="progress-track"><div className="progress-fill" style={{ width: `${fillRate}%` }} /></div></div>
        <div className="card"><h3>SN/IMEI Records</h3><div className="kpi-val">{serialUnits.length}</div><div className="kpi-sub">Piece / Box / Pallet</div></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>PO</th><th>Supplier</th><th>Lines</th><th>คาดรับ</th><th>รับจริง</th><th>SN/IMEI</th><th>หมายเหตุ</th><th>สถานะ</th></tr></thead>
          <tbody>
            {poList.map((p) => (
              <tr key={p.po}><td className="mono">{p.po}</td><td>{p.supplier}</td><td>{poLinesOf(p).length}</td><td>{poExpectedQty(p)}</td><td>{poActualQty(p) || "—"}</td><td>{serialUnits.filter((u) => u.po === p.po).length}</td><td>{p.remark || "—"}</td>
                <td><span className={`tag-status ${p.status === "รับครบ" ? "Arrived" : p.status === "Pending" ? "Booked" : "Hold"}`}>{p.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================================================================== */
/* INVENTORY TRANSACTION                                                */
/* ================================================================== */

function InventoryTransaction({ stock, setStock, addTx, txLog, notify, confirmAction }) {
  const [moveRow, setMoveRow] = useState(null);
  const [toLoc, setToLoc] = useState("");
  const [moveQty, setMoveQty] = useState("");
  const [newStatus, setNewStatus] = useState("AVL");
  const [remark, setRemark] = useState("");
  const emptyFilters = { lpn: "", date: "", month: "", synnexId: "", itemName: "", lot: "", loc: "", brand: "", size: "", floor: "", plant: "" };
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const openMove = (row) => { setMoveRow(row); setToLoc(row.loc); setMoveQty(String(row.qty)); setNewStatus(row.status); setRemark(""); };
  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const txMatches = (l) => {
    const item = itemOf(l.itemId);
    const loc = locOf(l.loc || l.toLoc || l.fromLoc);
    const detail = String(l.detail || "");
    const dateText = l.t ? l.t.toISOString().slice(0, 10) : "";
    const monthText = dateText.slice(0, 7);
    const hay = `${detail} ${l.lpn || ""} ${l.lot || l.batch || ""} ${l.loc || l.fromLoc || ""} ${l.toLoc || ""} ${l.itemId || ""} ${item?.name || ""} ${item?.brand || ""} ${sizeGroupOf(item || {}).code || ""} ${floorOf(loc?.floor)?.name || ""} ${loc?.floor || ""} ${loc?.plant || ""} ${plantLabelOf(loc?.plant)}`.toLowerCase();
    return (!appliedFilters.lpn || hay.includes(appliedFilters.lpn.toLowerCase()))
      && (!appliedFilters.date || dateText === appliedFilters.date)
      && (!appliedFilters.month || monthText === appliedFilters.month)
      && (!appliedFilters.synnexId || String(l.itemId || "").includes(appliedFilters.synnexId))
      && (!appliedFilters.itemName || hay.includes(appliedFilters.itemName.toLowerCase()))
      && (!appliedFilters.lot || hay.includes(appliedFilters.lot.toLowerCase()))
      && (!appliedFilters.loc || hay.includes(appliedFilters.loc.toLowerCase()))
      && (!appliedFilters.brand || String(item?.brand || l.brand || "").toLowerCase().includes(appliedFilters.brand.toLowerCase()))
      && (!appliedFilters.size || sizeGroupOf(item || {}).code === appliedFilters.size)
      && (!appliedFilters.plant || loc?.plant === appliedFilters.plant)
      && (!appliedFilters.floor || hay.includes(appliedFilters.floor.toLowerCase()));
  };
  const filteredTx = txLog.filter(txMatches);
  const filteredTimeline = [...filteredTx].sort((a, b) => new Date(a.t) - new Date(b.t));
  const applyFilters = () => {
    setAppliedFilters(filters);
    notify("Filter Transaction แล้ว", filters.lpn ? `กำลังแสดง Timeline ของ ${filters.lpn}` : "กรอง Transaction ตามเงื่อนไขที่เลือก", "success");
  };
  const clearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };
  const filterByLpn = (lpn) => {
    const next = { ...emptyFilters, lpn };
    setFilters(next);
    setAppliedFilters(next);
    notify("Filter LPN แล้ว", `แสดงประวัติ Transaction ของ ${lpn}`, "success");
  };
  const lastTxForStock = (row) => txLog.find((l) => (
    (l.lpn && l.lpn === row.lpn)
    || (l.itemId === row.itemId && (l.lot === row.batch || l.detail?.includes(row.batch)) && (l.toLoc === row.loc || l.loc === row.loc || l.detail?.includes(row.loc)))
  ));
  const stockMatches = (r) => {
    const item = itemOf(r.itemId);
    const loc = locOf(r.loc);
    const size = sizeGroupOf(item || {}).code;
    const txForRow = txLog.filter((l) => (
      (r.lpn && l.lpn === r.lpn)
      || (l.itemId === r.itemId && (l.lot === r.batch || l.batch === r.batch || String(l.detail || "").includes(r.batch)))
      || String(l.detail || "").includes(r.lpn)
    ));
    const hasTxOnDate = !appliedFilters.date || txForRow.some((l) => l.t?.toISOString().slice(0, 10) === appliedFilters.date);
    const hasTxInMonth = !appliedFilters.month || txForRow.some((l) => l.t?.toISOString().slice(0, 7) === appliedFilters.month);
    const hay = `${r.lpn || ""} ${r.itemId || ""} ${item?.itemCode || ""} ${item?.name || ""} ${item?.brand || ""} ${r.batch || ""} ${r.loc || ""} ${loc?.zone || ""} ${loc?.floor || ""} ${floorOf(loc?.floor)?.name || ""} ${loc?.plant || ""} ${plantLabelOf(loc?.plant)} ${size} ${r.status}`.toLowerCase();
    return hasTxOnDate
      && hasTxInMonth
      && (!appliedFilters.lpn || hay.includes(appliedFilters.lpn.toLowerCase()))
      && (!appliedFilters.synnexId || String(r.itemId || "").includes(appliedFilters.synnexId))
      && (!appliedFilters.itemName || hay.includes(appliedFilters.itemName.toLowerCase()))
      && (!appliedFilters.lot || hay.includes(appliedFilters.lot.toLowerCase()))
      && (!appliedFilters.loc || hay.includes(appliedFilters.loc.toLowerCase()))
      && (!appliedFilters.brand || String(item?.brand || "").toLowerCase().includes(appliedFilters.brand.toLowerCase()))
      && (!appliedFilters.size || size === appliedFilters.size)
      && (!appliedFilters.plant || loc?.plant === appliedFilters.plant)
      && (!appliedFilters.floor || hay.includes(appliedFilters.floor.toLowerCase()));
  };
  const filteredStockRows = stock.filter(stockMatches);

  const submitMove = () => {
    const q = Math.min(parseInt(moveQty || "0", 10), moveRow.qty);
    if (q <= 0) return setMoveRow(null);
    setStock((list) => {
      let next = list.map((r) => (r.key === moveRow.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const existing = next.find((r) => r.itemId === moveRow.itemId && r.batch === moveRow.batch && r.loc === toLoc && r.status === newStatus);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + q } : r));
      else next = [...next, { key: Date.now(), itemId: moveRow.itemId, batch: moveRow.batch, lpn: moveRow.lpn, loc: toLoc, qty: q, status: newStatus, age: moveRow.age }];
      return next;
    });
    addTx({ type: moveRow.loc === toLoc ? "Adjust" : "Move", detail: `${itemOf(moveRow.itemId)?.name} · ${moveRow.batch} · ${q} หน่วย: ${moveRow.loc} (${moveRow.status}) → ${toLoc} (${newStatus})${remark ? " · " + remark : ""}`, itemId: moveRow.itemId, lpn: moveRow.lpn, lot: moveRow.batch, fromLoc: moveRow.loc, toLoc });
    notify("บันทึก Transaction สำเร็จ", `${moveRow.lpn} ถูกบันทึกเวลาและกิจกรรมแล้ว`, "success");
    setMoveRow(null);
  };

  return (
    <>
      <div className="section-title">สต็อกปัจจุบันแยกตาม Location</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="grid g3">
          <div className="field"><label>เลือกวันที่ของ Transaction</label><input type="date" value={filters.date} onChange={(e) => setFilter("date", e.target.value)} /></div>
          <div className="field"><label>เลือกเดือน</label><input type="month" value={filters.month} onChange={(e) => setFilter("month", e.target.value)} /></div>
          <div className="field"><label>LPN</label><input value={filters.lpn} onChange={(e) => setFilter("lpn", e.target.value)} placeholder="LPN-000231" /></div>
          <div className="field"><label>SYNNEX ID</label><input value={filters.synnexId} onChange={(e) => setFilter("synnexId", e.target.value)} placeholder="6425011001" /></div>
          <div className="field"><label>ชื่อสินค้า</label><input value={filters.itemName} onChange={(e) => setFilter("itemName", e.target.value)} placeholder="Notebook / Mouse" /></div>
          <div className="field"><label>Location</label><input value={filters.loc} onChange={(e) => setFilter("loc", e.target.value)} placeholder="A-03-12-B" /></div>
          <div className="field"><label>Lot</label><input value={filters.lot} onChange={(e) => setFilter("lot", e.target.value)} placeholder="LOT-1001-A" /></div>
          <div className="field"><label>Brand</label><input value={filters.brand} onChange={(e) => setFilter("brand", e.target.value)} placeholder="ASUS" /></div>
          <div className="field"><label>Size</label><select value={filters.size} onChange={(e) => setFilter("size", e.target.value)}><option value="">ทั้งหมด</option>{SIZE_GROUPS.map((s) => <option key={s.code}>{s.code}</option>)}</select></div>
          <div className="field"><label>Plant / WH</label><select value={filters.plant} onChange={(e) => setFilter("plant", e.target.value)}><option value="">ทุก Plant</option>{PLANTS.map((p) => <option key={p.id} value={p.id}>{p.erpCode} · {p.name}</option>)}</select></div>
          <div className="field"><label>Floor</label><input value={filters.floor} onChange={(e) => setFilter("floor", e.target.value)} placeholder="BKK1-1 / ชั้น 1" /></div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn" onClick={applyFilters}><Filter size={13} /> Filter ตารางด้านบน</button>
          <button className="btn secondary" onClick={clearFilters}><RefreshCw size={13} /> ล้าง Filter</button>
          <span className="scan-step"><ClipboardList size={11} /> แสดง {filteredStockRows.length} / {stock.length} LPN</span>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table>
          <thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Size</th><th>Sticker</th><th>Batch</th><th>Location</th><th>Last Activity Time</th><th>Last User</th><th>Plant / WH</th><th>Floor</th><th>คงเหลือ</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filteredStockRows.map((r) => {
              const l = locOf(r.loc);
              const lastTx = lastTxForStock(r);
              return (
                <tr key={r.key}>
                  <td><button className="link-btn mono" onClick={() => filterByLpn(r.lpn)}>{r.lpn}</button></td>
                  <td className="mono">{r.itemId}</td>
                  <td>{itemOf(r.itemId)?.name}</td>
                  <td><span className={sizeChipClass(sizeGroupOf(itemOf(r.itemId)).code)}>{sizeGroupOf(itemOf(r.itemId)).code}</span></td>
                  <td><span className={`scan-step ${stickerStateOfStock(r).ok ? "done" : "active"}`}>{stickerStateOfStock(r).label}</span></td>
                  <td className="mono">{r.batch}</td>
                  <td className="mono">{r.loc}</td>
                  <td className="mono">{lastTx?.t ? lastTx.t.toLocaleString("th-TH") : "—"}</td>
                  <td>{lastTx?.user || "seed"}</td>
                  <td>{plantLabelOf(l?.plant)}</td>
                  <td>{floorOf(l?.floor)?.name || "-"}</td>
                  <td>{r.qty.toLocaleString()}</td>
                  <td><StatusBadge code={r.status} /></td>
                  <td><button className="btn secondary" onClick={() => openMove(r)}><MoveRight size={12} /> ย้าย/ปรับสถานะ</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="section-title">Transaction ที่กำลังวิ่งอยู่ (Live Feed)</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="grid g3">
          <div className="field"><label>Filter by LPN</label><input value={filters.lpn} onChange={(e) => setFilter("lpn", e.target.value)} placeholder="เช่น LPN-000231" /></div>
          <div className="field"><label>Filter by Date</label><input type="date" value={filters.date} onChange={(e) => setFilter("date", e.target.value)} /></div>
          <div className="field"><label>Filter by Month</label><input type="month" value={filters.month} onChange={(e) => setFilter("month", e.target.value)} /></div>
          <div className="field"><label>Filter by SYNNEX ID</label><input value={filters.synnexId} onChange={(e) => setFilter("synnexId", e.target.value)} placeholder="6425011001" /></div>
          <div className="field"><label>Filter by Item Name</label><input value={filters.itemName} onChange={(e) => setFilter("itemName", e.target.value)} placeholder="Notebook / Mouse" /></div>
          <div className="field"><label>Filter by Lot</label><input value={filters.lot} onChange={(e) => setFilter("lot", e.target.value)} placeholder="LOT-1001-A" /></div>
          <div className="field"><label>Filter by Location</label><input value={filters.loc} onChange={(e) => setFilter("loc", e.target.value)} placeholder="A-03-12-B" /></div>
          <div className="field"><label>Filter by Brand</label><input value={filters.brand} onChange={(e) => setFilter("brand", e.target.value)} placeholder="ASUS" /></div>
          <div className="field"><label>Filter by Size</label><select value={filters.size} onChange={(e) => setFilter("size", e.target.value)}><option value="">ทั้งหมด</option>{SIZE_GROUPS.map((s) => <option key={s.code}>{s.code}</option>)}</select></div>
          <div className="field"><label>Filter by Plant / WH</label><select value={filters.plant} onChange={(e) => setFilter("plant", e.target.value)}><option value="">ทุก Plant</option>{PLANTS.map((p) => <option key={p.id} value={p.id}>{p.erpCode} · {p.name}</option>)}</select></div>
          <div className="field"><label>Filter by Floor</label><input value={filters.floor} onChange={(e) => setFilter("floor", e.target.value)} placeholder="BKK1-1 / ชั้น 1" /></div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn" onClick={applyFilters}><Filter size={13} /> Filter Transaction</button>
          <button className="btn secondary" onClick={clearFilters}><RefreshCw size={13} /> ล้าง Filter</button>
          {appliedFilters.lpn && <span className="scan-step done"><ClipboardList size={11} /> Timeline LPN: {appliedFilters.lpn}</span>}
        </div>
      </div>
      <div className="section-title">Transaction Timeline ราย LPN / เงื่อนไขที่เลือก</div>
      <div className="table-wrap" style={{ marginBottom: 14 }}>
        <table>
          <thead><tr><th>Timestamp</th><th>User</th><th>Activity</th><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Brand</th><th>Size</th><th>Sticker</th><th>Lot</th><th>From Location</th><th>To Location</th><th>Current Location</th><th>Plant / WH</th><th>รายละเอียด</th></tr></thead>
          <tbody>
            {filteredTimeline.length === 0 && <tr><td colSpan={15} className="kpi-sub">ไม่พบ Timeline ตามเงื่อนไขที่เลือก</td></tr>}
            {filteredTimeline.map((l, i) => {
              const item = itemOf(l.itemId);
              const txLoc = locOf(l.loc || l.toLoc || l.fromLoc);
              return (
                <tr key={`${l.t?.getTime?.() || i}-${i}`}>
                  <td className="mono">{l.t?.toLocaleString("th-TH") || "—"}</td>
                  <td>{l.user || "system"}</td>
                  <td><span className="sys-tag ASRS">{l.type}</span></td>
                  <td className="mono">{l.lpn || l.targetLpn || "—"}</td>
                  <td className="mono">{l.itemId || "—"}</td>
                  <td>{item?.name || "—"}</td>
                  <td>{item?.brand || l.brand || "—"}</td>
                  <td>{item ? <span className={sizeChipClass(sizeGroupOf(item).code)}>{sizeGroupOf(item).code}</span> : "—"}</td>
                  <td>{item ? stickerSizeForItem(item) : "—"}</td>
                  <td className="mono">{l.lot || l.batch || "—"}</td>
                  <td className="mono">{l.fromLoc || "—"}</td>
                  <td className="mono">{l.toLoc || "—"}</td>
                  <td className="mono">{l.loc || l.toLoc || "—"}</td>
                  <td>{plantLabelOf(txLoc?.plant)}</td>
                  <td>{l.detail}</td>
                </tr>
              );
            })}
            {filteredStockRows.length === 0 && <tr><td colSpan={15} className="kpi-sub">ไม่พบ Stock ตาม filter ที่เลือก</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="card">
        {filteredTx.length === 0 && <div className="kpi-sub">ไม่พบ Transaction ตามเงื่อนไขที่เลือก</div>}
        {filteredTx.map((l, i) => (
          <div className="log-item" key={i}>
            <div className={`log-ic ${l.type === "Move" || l.type === "Adjust" ? "robot" : l.type === "Receive" ? "system" : "ai"}`}>
              {l.type === "Move" || l.type === "Adjust" ? <MoveRight size={14} /> : l.type === "Receive" ? <ScanLine size={14} /> : <Gauge size={14} />}
            </div>
            <div><div className="log-text"><b style={{ color: "var(--teal)" }}>{l.type}</b> — {l.detail}</div><div className="log-time">{l.t.toLocaleString("th-TH")} · User {l.user || "system"}{l.lpn ? ` · LPN ${l.lpn}` : ""}{l.lot ? ` · Lot ${l.lot}` : ""}</div></div>
          </div>
        ))}
      </div>

      {moveRow && (
        <Modal onClose={() => setMoveRow(null)} width={440}>
          <h2>ย้ายสถานะ / โยกย้ายสินค้า</h2>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>{moveRow.itemId} · {itemOf(moveRow.itemId)?.name} · {moveRow.batch} · ต้นทาง {moveRow.loc}</div>
          <div className="field"><label>จำนวนที่ต้องการย้าย (สูงสุด {moveRow.qty})</label><input type="number" value={moveQty} onChange={(e) => setMoveQty(e.target.value)} /></div>
          <div className="field"><label>Location ปลา·ҧ</label><select value={toLoc} onChange={(e) => setToLoc(e.target.value)}>{LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.code}</option>)}</select></div>
          <div className="field"><label>Status ใหม่</label><select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
          <div className="field"><label>หมายเหตุ</label><input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="เช่น ย้ายเข้า QC หลังพบตำหนิ" /></div>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => confirmAction({ title: "ยืนยันการย้ายสินค้า", message: `ต้องการบันทึก Transaction ของ ${moveRow.lpn} หรือไม่`, onConfirm: submitMove })}>ยืนยันการย้าย</button>
        </Modal>
      )}
    </>
  );
}

/* ================================================================== */
/* INVENTORY CYCLE COUNT — blind Handheld counting + daily report      */
/* ================================================================== */

function CycleCount({ cycleCounts, setCycleCounts, stock, setStock, addTx }) {
  const [tab, setTab] = useState("today");
  const [countedQtyInput, setCountedQtyInput] = useState("");

  const pending = cycleCounts.filter((c) => c.status === "รอนับ");
  const current = pending[0];

  const submitCount = () => {
    if (!current) return;
    const counted = parseInt(countedQtyInput || "0", 10);
    const variance = counted - current.expectedQty;
    const counter = pick(["สมชาย ใจดี", "ธนกร ไพศาล", "อรุณี แสงทอง"]);
    setCycleCounts((list) => list.map((c) => (c.id === current.id ? { ...c, countedQty: counted, variance, status: variance === 0 ? "นับตรง" : "พบผลต่าง", countedBy: counter } : c)));
    addTx({ type: "CycleCount", detail: `${current.id} · ${itemOf(current.itemId)?.name} @ ${current.loc}: นับได้ ${counted} หน่วย (ระบบบันทึก ${current.expectedQty})${variance !== 0 ? ` — พบผลต่าง ${variance > 0 ? "+" : ""}${variance}` : ""}`, itemId: current.itemId });
    setCountedQtyInput("");
  };

  const adjustToCount = (task) => {
    setStock((list) => list.map((r) => (r.itemId === task.itemId && r.loc === task.loc && r.batch === task.batch ? { ...r, qty: task.countedQty } : r)));
    setCycleCounts((list) => list.map((c) => (c.id === task.id ? { ...c, adjusted: true } : c)));
    addTx({ type: "Adjust", detail: `ปรับปรุงสต็อกตามผล Cycle Count ${task.id}: ${task.loc} → ${task.countedQty} หน่วย`, itemId: task.itemId });
  };

  const counted = cycleCounts.filter((c) => c.status !== "รอนับ");
  const matched = counted.filter((c) => c.variance === 0).length;
  const accuracy = counted.length ? ((matched / counted.length) * 100).toFixed(1) : "0.0";
  const totalVariance = counted.reduce((a, c) => a + Math.abs(c.variance || 0), 0);

  return (
    <>
      <div className="tabs">
        <span className={`tab ${tab === "today" ? "active" : ""}`} onClick={() => setTab("today")}><ClipboardCheck size={13} style={{ marginRight: 4 }} />รอบนับวันนี้</span>
        <span className={`tab ${tab === "hh" ? "active" : ""}`} onClick={() => setTab("hh")}><Smartphone size={13} style={{ marginRight: 4 }} />นับด้วย Handheld</span>
        <span className={`tab ${tab === "report" ? "active" : ""}`} onClick={() => setTab("report")}><Gauge size={13} style={{ marginRight: 4 }} />Report สรุปรายวัน</span>
      </div>

      {tab === "today" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Task</th><th>Location</th><th>SYNNEX ID</th><th>Item Name</th><th>ABC</th><th>Batch</th><th>สถานะ</th></tr></thead>
            <tbody>
              {cycleCounts.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td><td className="mono">{c.loc}</td><td className="mono">{c.itemId}</td><td>{itemOf(c.itemId)?.name}</td>
                  <td><span className={`badge ${itemOf(c.itemId)?.abc}`}>{itemOf(c.itemId)?.abc}</span></td><td className="mono">{c.batch}</td>
                  <td><span className={`tag-status ${c.status === "รอนับ" ? "Booked" : c.status === "นับตรง" ? "Completed" : "Hold"}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "hh" && (
        <div className="handheld" style={{ margin: "0 auto" }}>
          <div className="handheld-screen">
            {!current && <div className="kpi-sub" style={{ textAlign: "center", padding: "60px 10px" }}><CheckCircle2 size={28} style={{ marginBottom: 10 }} /><br />นับสต็อกครบทุกรายการของวันนี้แล้ว</div>}
            {current && (
              <>
                <div className="kpi-sub">Blind Count — ไม่แสดงจำนวนในระบบ</div>
                <div className="item-heading"><ItemCell itemId={current.itemId} /></div>
                <div className="recall-row"><span>Location</span><span className="mono" style={{ color: "var(--teal)" }}>{current.loc}</span></div>
                <div className="recall-row"><span>Batch</span><span className="mono">{current.batch}</span></div>
                <div className="field" style={{ marginTop: 12 }}><label>จำนวนที่นับได้จริง</label><input type="number" value={countedQtyInput} onChange={(e) => setCountedQtyInput(e.target.value)} placeholder="สแกน/กรอกจำนวนที่นับได้" /></div>
                <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={submitCount}><CheckCircle2 size={13} /> ยืนยันผลการนับ</button>
                <div className="kpi-sub" style={{ textAlign: "center", marginTop: 10 }}>คงเหลือในรอบนับ {pending.length - 1} รายการ</div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "report" && (
        <>
          <div className="grid g4" style={{ marginBottom: 20 }}>
            <div className="card"><h3>รายการนับทั้งหมด</h3><div className="kpi-val">{cycleCounts.length}</div><div className="kpi-sub">นับแล้ว {counted.length} · รอนับ {pending.length}</div></div>
            <div className="card"><h3>ความแม่นยำการนับ</h3><div className="kpi-val" style={{ color: "var(--success)" }}>{accuracy}%</div></div>
            <div className="card"><h3>พบผลต่าง</h3><div className="kpi-val" style={{ color: "var(--danger)" }}>{counted.length - matched}</div><div className="kpi-sub">รายการ</div></div>
            <div className="card"><h3>ผลต่างสะสม (หน่วย)</h3><div className="kpi-val">{totalVariance}</div></div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Location</th><th>SYNNEX ID</th><th>Item Name</th><th>ระบบบันทึก</th><th>นับได้จริง</th><th>ผลต่าง</th><th>ผู้นับ</th><th>สถานะ</th><th></th></tr></thead>
              <tbody>
                {cycleCounts.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td><td className="mono">{c.loc}</td><td className="mono">{c.itemId}</td><td>{itemOf(c.itemId)?.name}</td>
                    <td>{c.expectedQty}</td><td>{c.countedQty ?? "—"}</td>
                    <td style={{ color: c.variance ? (c.variance > 0 ? "var(--amber)" : "var(--danger)") : "var(--muted)" }}>{c.variance != null ? (c.variance > 0 ? `+${c.variance}` : c.variance) : "—"}</td>
                    <td>{c.countedBy || "—"}</td>
                    <td><span className={`tag-status ${c.status === "รอนับ" ? "Booked" : c.status === "นับตรง" ? "Completed" : "Hold"}`}>{c.status}</span></td>
                    <td>{c.status === "พบผลต่าง" && !c.adjusted && <button className="btn secondary" onClick={() => adjustToCount(c)}>ปรับปรุงสต็อก</button>}{c.adjusted && <span className="kpi-sub">ปรับแล้ว</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

/* ================================================================== */
/* PUTAWAY & MOVE — Putaway to Location, Move to Location, LPN → LPN   */
/* ================================================================== */

function PutawayMove({ stock, setStock, stickerTasks = [], setStickerTasks = () => {}, addTx, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.() }) {
  const [tab, setTab] = useState("putaway");
  const [putRow, setPutRow] = useState(null);
  const [putForm, setPutForm] = useState({ toLoc: LOCATIONS[0].code, qty: "", toStatus: "AVL" });
  const [moveRow, setMoveRow] = useState(null);
  const [moveForm, setMoveForm] = useState({ toLoc: "", qty: "", toStatus: "AVL" });
  const [lpnForm, setLpnForm] = useState({ sourceKey: "", targetLpn: "", qty: "" });
  const [hh, setHh] = useState({ taskKey: "", from: "", item: "", to: "" });

  const stagingLocations = ["RECV-DOCK", "STAGING-QC"];
  const staging = stock.filter((r) => stagingLocations.includes(r.loc) && r.qty > 0);
  const preworkMoveOrders = stickerTasks.filter((t) => t.toLoc === "PREWORK" && t.moveStatus !== "Moved");
  const postStickerMoveOrders = stickerTasks.filter((t) => t.nextMoveStatus === "Pending");
  const handheldTasks = [
    ...staging.map((r) => ({ key: `PUT-${r.key}`, type: "PUTAWAY", title: "Putaway จาก Staging", fromLoc: r.loc, toLoc: "MZ-01-01-A", itemId: r.itemId, lpn: r.lpn, qty: r.qty, row: r, system: locOf(r.loc)?.system || "Manual" })),
    ...preworkMoveOrders.map((t) => ({ key: `PRE-${t.id}`, type: "PREWORK", title: t.system === "ASRS" ? "ASRS to Prework" : "Move to Prework", fromLoc: t.fromLoc, toLoc: "PREWORK", itemId: t.itemId, lpn: t.lpn, qty: t.qtyRequired, task: t, system: t.system || "Manual" })),
    ...postStickerMoveOrders.map((t) => ({ key: `OUT-${t.id}`, type: "POST_STICKER", title: t.nextMoveLabel || "Move from Prework", fromLoc: "PREWORK", toLoc: t.nextToLoc || "MZ-01-01-A", itemId: t.itemId, lpn: t.lpn, qty: t.qtyRequired, task: t, system: locOf(t.nextToLoc)?.system || "Manual" })),
  ];
  const selectedHandheldTask = handheldTasks.find((t) => t.key === hh.taskKey) || handheldTasks[0];

  const openPutaway = (row) => { setPutRow(row); setPutForm({ toLoc: LOCATIONS.find((l) => l.type !== "Staging")?.code || LOCATIONS[0].code, qty: String(row.qty), toStatus: row.status === "DMG" ? "DMG" : "AVL" }); };
  const performPutaway = (row, toLoc, qty, toStatus = "AVL") => {
    const q = Math.min(parseInt(String(qty || "0"), 10), row.qty);
    if (q <= 0) return false;
    setStock((list) => {
      let next = list.map((r) => (r.key === row.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const existing = next.find((r) => r.itemId === row.itemId && r.batch === row.batch && r.loc === toLoc && r.status === toStatus);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + q } : r));
      else next = [...next, { ...row, key: Date.now() + Math.random(), loc: toLoc, qty: q, status: toStatus }];
      return next;
    });
    addTx({ type: "Putaway", detail: `Putaway: ${itemOf(row.itemId)?.name} · ${row.lpn} · ${q} หน่วย จาก ${row.loc} → ${toLoc} (${toStatus})`, itemId: row.itemId, lpn: row.lpn, lot: row.batch, fromLoc: row.loc, toLoc });
    return true;
  };
  const submitPutaway = () => {
    performPutaway(putRow, putForm.toLoc, putForm.qty, putForm.toStatus);
    setPutRow(null);
  };

  const openMove = (row) => { setMoveRow(row); setMoveForm({ toLoc: row.loc, qty: String(row.qty), toStatus: row.status }); };
  const completePreworkMove = (task) => {
    const source = stock.find((r) => r.key === task.stockKey) || stock.find((r) => r.itemId === task.itemId && r.loc === task.fromLoc && r.lpn === task.lpn);
    if (!source) {
      notify("ไม่พบ Stock ต้นทาง", `${task.id}: ไม่พบ LPN ${task.lpn || "-"} ที่ ${task.fromLoc}`, "danger");
      return;
    }
    const q = Math.min(task.qtyRequired, source.qty);
    setStock((list) => {
      let next = list.map((r) => (r.key === source.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const existing = next.find((r) => r.itemId === task.itemId && r.batch === source.batch && r.loc === "PREWORK" && r.preworkBill === task.id);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + q, stickerStatus: "IN_PROGRESS" } : r));
      else next = [...next, { ...source, key: Date.now() + Math.random(), loc: "PREWORK", qty: q, status: "AVL", stickerStatus: "IN_PROGRESS", preworkBill: task.id }];
      return next;
    });
    setStickerTasks((list) => list.map((t) => (t.id === task.id ? { ...t, moveStatus: "Moved", status: "At Prework", movedAt: new Date().toISOString() } : t)));
    addTx({ type: task.system === "ASRS" ? "ASRS to Prework Move" : "Prework Move", detail: `${task.id}: พนักงาน Scan Move ${task.fromLoc} → PREWORK · ${task.itemId} · ${q} ชิ้น`, itemId: task.itemId, lpn: task.lpn, lot: source.batch, fromLoc: task.fromLoc, toLoc: "PREWORK", loc: "PREWORK" });
    notify("Move Order สำเร็จ", `${task.id} ย้ายสินค้าเข้า PREWORK แล้ว`, "success");
  };
  const completePostStickerMove = (task) => {
    const toLoc = task.nextToLoc || "MZ-01-01-A";
    const source = stock.find((r) => r.preworkBill === task.id && r.loc === "PREWORK") || stock.find((r) => r.itemId === task.itemId && r.loc === "PREWORK" && r.lpn === task.lpn);
    if (!source) {
      notify("ไม่พบสินค้าใน PREWORK", `${task.id}: ไม่พบ LPN ${task.lpn || "-"} สำหรับ Move ต่อ`, "danger");
      return;
    }
    const q = Math.min(task.qtyRequired, source.qty);
    setStock((list) => {
      let next = list.map((r) => (r.key === source.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const toStatus = toLoc === "PICK-PACK" ? "PICKED" : "AVL";
      const existing = next.find((r) => r.itemId === task.itemId && r.batch === source.batch && r.loc === toLoc && r.status === toStatus && r.preworkBill === task.id);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + q, stickerStatus: "DONE" } : r));
      else next = [...next, { ...source, key: Date.now() + Math.random(), loc: toLoc, qty: q, status: toStatus, stickerStatus: "DONE" }];
      return next;
    });
    setStickerTasks((list) => list.map((t) => (t.id === task.id ? { ...t, nextMoveStatus: "Moved", finalLoc: toLoc, status: "Completed & Moved", movedOutAt: new Date().toISOString() } : t)));
    addTx({ type: "Prework Out Move", detail: `${task.id}: Sticker Complete แล้ว Move PREWORK → ${toLoc} · ${task.itemId} · ${q} ชิ้น`, itemId: task.itemId, lpn: task.lpn, fromLoc: "PREWORK", toLoc, loc: toLoc });
    notify("Move หลังติดสติ๊กเกอร์สำเร็จ", `${task.id} ถูกย้ายจาก PREWORK ไป ${toLoc}`, "success");
  };
  const runHandheldCommand = () => {
    const task = selectedHandheldTask;
    if (!task) return;
    const scannedFrom = hh.from.trim().toUpperCase();
    const scannedItem = hh.item.trim().toUpperCase();
    const scannedTo = hh.to.trim().toUpperCase();
    if (scannedFrom !== task.fromLoc.toUpperCase()) return notify("Scan Location ต้นทางไม่ถูกต้อง", `ต้องสแกน ${task.fromLoc}`, "danger");
    if (![task.itemId, task.lpn].filter(Boolean).map((v) => String(v).toUpperCase()).includes(scannedItem)) return notify("Scan Item/LPN ไม่ถูกต้อง", `ต้องสแกน SYNNEX ID ${task.itemId} หรือ LPN ${task.lpn || "-"}`, "danger");
    if (scannedTo !== task.toLoc.toUpperCase()) return notify("Scan Location ปลายทางไม่ถูกต้อง", `ต้องสแกน ${task.toLoc}`, "danger");
    if (task.type === "PUTAWAY") {
      if (performPutaway(task.row, task.toLoc, task.qty, task.row.status === "DMG" ? "DMG" : "AVL")) notify("Handheld Putaway สำเร็จ", `${task.lpn} ถูก Putaway ไป ${task.toLoc}`, "success");
    } else if (task.type === "PREWORK") {
      completePreworkMove(task.task);
    } else {
      completePostStickerMove(task.task);
    }
    setHh({ taskKey: "", from: "", item: "", to: "" });
  };
  const submitMove = () => {
    const q = Math.min(parseInt(moveForm.qty || "0", 10), moveRow.qty);
    if (q <= 0) return setMoveRow(null);
    setStock((list) => {
      let next = list.map((r) => (r.key === moveRow.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const existing = next.find((r) => r.itemId === moveRow.itemId && r.batch === moveRow.batch && r.loc === moveForm.toLoc && r.status === moveForm.toStatus);
      if (existing) next = next.map((r) => (r === existing ? { ...r, qty: r.qty + q } : r));
      else next = [...next, { ...moveRow, key: Date.now() + Math.random(), loc: moveForm.toLoc, qty: q, status: moveForm.toStatus }];
      return next;
    });
    addTx({ type: "Move", detail: `Move to Location: ${itemOf(moveRow.itemId)?.name} · ${q} หน่วย: ${moveRow.loc} → ${moveForm.toLoc} (${moveForm.toStatus})`, itemId: moveRow.itemId, lpn: moveRow.lpn, lot: moveRow.batch, fromLoc: moveRow.loc, toLoc: moveForm.toLoc });
    setMoveRow(null);
  };

  const sourceRow = stock.find((r) => r.key === Number(lpnForm.sourceKey) || String(r.key) === lpnForm.sourceKey);
  const submitLpnTransfer = () => {
    if (!sourceRow || !lpnForm.targetLpn) return;
    const q = Math.min(parseInt(lpnForm.qty || "0", 10), sourceRow.qty);
    if (q <= 0) return;
    setStock((list) => {
      let next = list.map((r) => (r.key === sourceRow.key ? { ...r, qty: r.qty - q } : r)).filter((r) => r.qty > 0);
      const existingTarget = next.find((r) => r.lpn === lpnForm.targetLpn);
      if (existingTarget) next = next.map((r) => (r === existingTarget ? { ...r, qty: r.qty + q } : r));
      else next = [...next, { ...sourceRow, key: Date.now() + Math.random(), lpn: lpnForm.targetLpn, qty: q }];
      return next;
    });
    addTx({ type: "LPN Transfer", detail: `ย้าย ${itemOf(sourceRow.itemId)?.name} ${q} หน่วย จาก LPN ${sourceRow.lpn} → LPN ${lpnForm.targetLpn}`, itemId: sourceRow.itemId, lpn: sourceRow.lpn, targetLpn: lpnForm.targetLpn, lot: sourceRow.batch, loc: sourceRow.loc });
    setLpnForm({ sourceKey: "", targetLpn: "", qty: "" });
  };

  return (
    <>
      <div className="tabs">
        <span className={`tab ${tab === "putaway" ? "active" : ""}`} onClick={() => setTab("putaway")}><ArrowDownToLine size={13} style={{ marginRight: 4 }} />Putaway to Location</span>
        <span className={`tab ${tab === "prework" ? "active" : ""}`} onClick={() => setTab("prework")}><ClipboardCheck size={13} style={{ marginRight: 4 }} />Prework Move Order</span>
        <span className={`tab ${tab === "handheld" ? "active" : ""}`} onClick={() => setTab("handheld")}><Smartphone size={13} style={{ marginRight: 4 }} />Handheld Command</span>
        <span className={`tab ${tab === "move" ? "active" : ""}`} onClick={() => setTab("move")}><MoveRight size={13} style={{ marginRight: 4 }} />Move to Location</span>
        <span className={`tab ${tab === "lpn" ? "active" : ""}`} onClick={() => setTab("lpn")}><ArrowLeftRight size={13} style={{ marginRight: 4 }} />Move LPN → LPN</span>
      </div>

      {tab === "putaway" && (
        <>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>สินค้าที่รับเข้าแล้วรออยู่ที่ Staging Area: RECV-DOCK / STAGING-QC ({staging.length} รายการ) — เลือก Location ปลายทางเพื่อ Putaway เข้าที่จัดเก็บจริง</div>
          {staging.length === 0 && <div className="card kpi-sub" style={{ textAlign: "center", padding: 30 }}>ไม่มีสินค้ารอ Putaway ในขณะนี้</div>}
          {staging.map((r) => (
            <div className="po-row" key={r.key}>
              <ArrowDownToLine size={18} color="var(--teal)" />
              <div className="po-info"><div className="sup"><span className="mono">{r.itemId}</span> · {itemOf(r.itemId)?.name} <span className="po-id">· {r.lpn}</span></div><div className="meta">Batch {r.batch} · {r.qty} หน่วย · <StatusBadge code={r.status} /></div></div>
              <button className="btn" onClick={() => openPutaway(r)}>Putaway <ArrowRight size={13} /></button>
            </div>
          ))}
        </>
      )}

      {tab === "prework" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>Move Order ไปห้อง Prework</h3>
              <div className="kpi-sub">งานที่ถูกสร้างจากหน้า Sticker Bill เช่น ASRS → PREWORK หรือ Onfloor → PREWORK เพื่อให้ Handheld แสดงคำสั่งเดินไป Scan Move</div>
            </div>
            <span className="scan-step"><ClipboardCheck size={11} /> รอ Move {preworkMoveOrders.length + postStickerMoveOrders.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Move Order</th><th>Source</th><th>From</th><th>To</th><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Qty</th><th>คำสั่งระบบ</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {[...preworkMoveOrders, ...postStickerMoveOrders].map((t) => (
                  <tr key={t.id}>
                    <td className="mono">{t.id}</td><td>{t.nextMoveStatus === "Pending" ? "หลังติดสติ๊กเกอร์" : t.source}</td><td className="mono">{t.nextMoveStatus === "Pending" ? "PREWORK" : t.fromLoc}</td><td className="mono">{t.nextMoveStatus === "Pending" ? t.nextToLoc : "PREWORK"}</td><td className="mono">{t.lpn || "-"}</td><td className="mono">{t.itemId}</td><td>{itemOf(t.itemId)?.name}</td><td>{t.qtyRequired}</td>
                    <td>{t.system === "ASRS" ? <span className="robot-step active"><Bot size={11} /> API Command Sent</span> : <span className="robot-step"><Smartphone size={11} /> Manual Handheld Move</span>}</td>
                    <td><span className="tag-status Booked">{t.nextMoveStatus === "Pending" ? t.nextMoveLabel : t.moveStatus || "Pending Move"}</span></td>
                    <td><button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Move", message: `ยืนยันว่า Scan Move ${t.nextMoveStatus === "Pending" ? "PREWORK" : t.fromLoc} → ${t.nextMoveStatus === "Pending" ? t.nextToLoc : "PREWORK"} สำหรับ ${t.id} แล้วหรือไม่`, onConfirm: () => t.nextMoveStatus === "Pending" ? completePostStickerMove(t) : completePreworkMove(t) })}><MoveRight size={12} /> ยืนยัน Move</button></td>
                  </tr>
                ))}
                {preworkMoveOrders.length + postStickerMoveOrders.length === 0 && <tr><td colSpan={11} className="kpi-sub">ไม่มี Move Order ค้างอยู่</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "handheld" && (
        <div className="handheld-shell">
          <div className="handheld-phone">
            <div className="handheld-top"><Smartphone size={15} /> WMS Handheld</div>
            <div className="field"><label>เลือกคำสั่งงาน</label>
              <select value={hh.taskKey || selectedHandheldTask?.key || ""} onChange={(e) => setHh({ taskKey: e.target.value, from: "", item: "", to: "" })}>
                {handheldTasks.map((t) => <option key={t.key} value={t.key}>{t.title} · {t.lpn || t.itemId} · {t.fromLoc} → {t.toLoc}</option>)}
              </select>
            </div>
            {selectedHandheldTask ? (
              <>
                <div className="handheld-job-card">
                  <b>{selectedHandheldTask.title}</b>
                  <span>{selectedHandheldTask.itemId} · {itemOf(selectedHandheldTask.itemId)?.name}</span>
                  <span>LPN {selectedHandheldTask.lpn || "-"} · Qty {selectedHandheldTask.qty}</span>
                  <em>{selectedHandheldTask.fromLoc} → {selectedHandheldTask.toLoc}</em>
                </div>
                <div className="scan-steps-row" style={{ marginBottom: 10 }}>
                  <span className={`scan-step ${hh.from.trim().toUpperCase() === selectedHandheldTask.fromLoc.toUpperCase() ? "done" : ""}`}><MapPinned size={11} /> Scan From</span>
                  <span className={`scan-step ${[selectedHandheldTask.itemId, selectedHandheldTask.lpn].filter(Boolean).map((v) => String(v).toUpperCase()).includes(hh.item.trim().toUpperCase()) ? "done" : ""}`}><ScanLine size={11} /> Scan Item/LPN</span>
                  <span className={`scan-step ${hh.to.trim().toUpperCase() === selectedHandheldTask.toLoc.toUpperCase() ? "done" : ""}`}><MapPinned size={11} /> Scan To</span>
                </div>
                <div className="field"><label>1. Scan From Location</label><input className="text-input" value={hh.from} onChange={(e) => setHh({ ...hh, from: e.target.value })} placeholder={selectedHandheldTask.fromLoc} /></div>
                <div className="field"><label>2. Scan LPN หรือ SYNNEX ID</label><input className="text-input" value={hh.item} onChange={(e) => setHh({ ...hh, item: e.target.value })} placeholder={`${selectedHandheldTask.lpn || selectedHandheldTask.itemId}`} /></div>
                <div className="field"><label>3. Scan To Location</label><input className="text-input" value={hh.to} onChange={(e) => setHh({ ...hh, to: e.target.value })} placeholder={selectedHandheldTask.toLoc} /></div>
                <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => confirmAction({ title: "ยืนยันคำสั่งจาก Handheld", message: `ยืนยัน ${selectedHandheldTask.title}: ${selectedHandheldTask.fromLoc} → ${selectedHandheldTask.toLoc} หรือไม่`, onConfirm: runHandheldCommand })}><CheckCircle2 size={13} /> Confirm Scan Move</button>
              </>
            ) : <div className="kpi-sub">ไม่มีคำสั่งงานสำหรับ Handheld ตอนนี้</div>}
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 10 }}>คิวคำสั่งจาก Handheld</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Type</th><th>LPN</th><th>SYNNEX ID</th><th>From</th><th>To</th><th>Qty</th><th>System</th></tr></thead>
                <tbody>
                  {handheldTasks.map((t) => <tr key={t.key}><td>{t.title}</td><td className="mono">{t.lpn || "-"}</td><td className="mono">{t.itemId}</td><td className="mono">{t.fromLoc}</td><td className="mono">{t.toLoc}</td><td>{t.qty}</td><td>{t.system}</td></tr>)}
                  {handheldTasks.length === 0 && <tr><td colSpan={7} className="kpi-sub">ไม่มีคำสั่งงานค้าง</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "move" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Batch</th><th>Location</th><th>คงเหลือ</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {stock.map((r) => (
                <tr key={r.key}>
                  <td className="mono">{r.lpn}</td><td className="mono">{r.itemId}</td><td>{itemOf(r.itemId)?.name}</td><td className="mono">{r.batch}</td><td className="mono">{r.loc}</td><td>{r.qty.toLocaleString()}</td><td><StatusBadge code={r.status} /></td>
                  <td><button className="btn secondary" onClick={() => openMove(r)}><MoveRight size={12} /> ย้าย</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "lpn" && (
        <div className="card" style={{ maxWidth: 520 }}>
          <div className="field"><label>LPN ต้นทาง</label>
            <select value={lpnForm.sourceKey} onChange={(e) => setLpnForm({ ...lpnForm, sourceKey: e.target.value, qty: "" })}>
              <option value="">— เลือก LPN —</option>
              {stock.map((r) => <option key={r.key} value={r.key}>{r.lpn} · {r.itemId} · {itemOf(r.itemId)?.name} · {r.loc} · คงเหลือ {r.qty}</option>)}
            </select>
          </div>
          {sourceRow && (
            <>
              <div className="field"><label>จำนวนที่ต้องการย้าย (สูงสุด {sourceRow.qty})</label><input type="number" value={lpnForm.qty} onChange={(e) => setLpnForm({ ...lpnForm, qty: e.target.value })} /></div>
              <div className="field"><label>LPN ปลา·ҧ (พิมพ์ LPN ใหม่ หรือ LPN เดิมที่มีอยู่เพื่อรวม)</label><input value={lpnForm.targetLpn} onChange={(e) => setLpnForm({ ...lpnForm, targetLpn: e.target.value })} placeholder="เช่น LPN-000999" /></div>
              <div className="kpi-sub" style={{ marginBottom: 10 }}>ย้ายจาก Location เดิม ({sourceRow.loc}) — สินค้าจะยังอยู่ Location เดิม เปลี่ยนแค่ LPN</div>
            </>
          )}
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={!sourceRow} onClick={submitLpnTransfer}>ยืนยันย้าย LPN</button>
        </div>
      )}

      {putRow && (
        <Modal onClose={() => setPutRow(null)} width={420}>
          <h2>Putaway to Location</h2>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>{putRow.itemId} · {itemOf(putRow.itemId)?.name} · {putRow.lpn} · จาก {putRow.loc}</div>
          <div className="field"><label>จำนวน (สูงสุด {putRow.qty})</label><input type="number" value={putForm.qty} onChange={(e) => setPutForm({ ...putForm, qty: e.target.value })} /></div>
          <div className="field"><label>Location ปลา·ҧ</label><select value={putForm.toLoc} onChange={(e) => setPutForm({ ...putForm, toLoc: e.target.value })}>{LOCATIONS.filter((l) => l.type !== "Staging").map((l) => <option key={l.code} value={l.code}>{l.code} ({l.system})</option>)}</select></div>
          <div className="field"><label>Status ปลา·ҧ</label><select value={putForm.toStatus} onChange={(e) => setPutForm({ ...putForm, toStatus: e.target.value })}>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={submitPutaway}>ยืนยัน Putaway</button>
        </Modal>
      )}
      {moveRow && (
        <Modal onClose={() => setMoveRow(null)} width={420}>
          <h2>Move to Location</h2>
          <div className="kpi-sub" style={{ marginBottom: 14 }}>{moveRow.itemId} · {itemOf(moveRow.itemId)?.name} · {moveRow.lpn} · จาก {moveRow.loc}</div>
          <div className="field"><label>จำนวน (สูงสุด {moveRow.qty})</label><input type="number" value={moveForm.qty} onChange={(e) => setMoveForm({ ...moveForm, qty: e.target.value })} /></div>
          <div className="field"><label>Location ปลา·ҧ</label><select value={moveForm.toLoc} onChange={(e) => setMoveForm({ ...moveForm, toLoc: e.target.value })}>{LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.code}</option>)}</select></div>
          <div className="field"><label>Status ปลา·ҧ</label><select value={moveForm.toStatus} onChange={(e) => setMoveForm({ ...moveForm, toStatus: e.target.value })}>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={submitMove}>ยืนยันย้าย</button>
        </Modal>
      )}
    </>
  );
}

/* ================================================================== */
/* REPLENISHMENT — requests (ASRS/Miniload/Manual) + strategy setup    */
/* ================================================================== */

function Replenishment({ replenishRules, setReplenishRules, stock, setStock, addTx }) {
  const [tab, setTab] = useState("requests");
  const [jobs, setJobs] = useState([]);
  const [ruleModal, setRuleModal] = useState(null); // rule being edited, or {} for new

  const qtyAt = (itemId, loc) => stock.filter((s) => s.itemId === itemId && s.loc === loc && s.status === "AVL").reduce((a, r) => a + r.qty, 0);

  const trigger = (rule) => {
    const current = qtyAt(rule.itemId, rule.pickLoc);
    const suggested = Math.max(0, rule.max - current);
    const sourceAvail = qtyAt(rule.itemId, rule.sourceLoc);
    const take = Math.min(suggested, sourceAvail);
    const system = locOf(rule.pickLoc)?.system || "Manual";
    const steps = system === "Manual" ? ["มอบหมายพนักงาน", "เติมสินค้าสำเร็จ"] : ["ส่งคำสั่งไปยัง Controller", "กำลังเคลื่อนย้าย", "เติมสินค้าสำเร็จ"];
    setJobs((js) => [...js.filter((j) => j.ruleId !== rule.id), { ruleId: rule.id, system, stepIdx: 0, steps, take, suggested }]);
    let i = 0;
    const tick = () => {
      i++;
      setJobs((js) => js.map((j) => (j.ruleId === rule.id ? { ...j, stepIdx: i } : j)));
      if (i < steps.length - 1) setTimeout(tick, 1300);
      else {
        if (take > 0) moveStockQty(setStock, { itemId: rule.itemId, fromLoc: rule.sourceLoc, toLoc: rule.pickLoc, qty: take, toStatus: "AVL", batchPrefix: "REPL" });
        addTx({ type: "Replenish", detail: `${rule.id}: เติม ${itemOf(rule.itemId)?.name} ${take} หน่วย จาก ${rule.sourceLoc} → ${rule.pickLoc}${take < suggested ? ` (ขาด ${suggested - take} ต้องสั่งซื้อเพิ่ม)` : ""}`, itemId: rule.itemId });
      }
    };
    setTimeout(tick, 1300);
  };

  const requests = replenishRules.map((rule) => {
    const current = qtyAt(rule.itemId, rule.pickLoc);
    const needs = current < rule.min;
    const suggested = Math.max(0, rule.max - current);
    const sourceAvail = qtyAt(rule.itemId, rule.sourceLoc);
    const job = jobs.find((j) => j.ruleId === rule.id);
    return { rule, current, needs, suggested, sourceAvail, job };
  });

  const saveRule = (form) => {
    if (form.id) setReplenishRules((list) => list.map((r) => (r.id === form.id ? form : r)));
    else setReplenishRules((list) => [...list, { ...form, id: `RP-${rand(90, 99)}` }]);
    setRuleModal(null);
  };

  return (
    <>
      <div className="tabs">
        <span className={`tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}><RefreshCw size={13} style={{ marginRight: 4 }} />คำขอเติมสินค้า</span>
        <span className={`tab ${tab === "setup" ? "active" : ""}`} onClick={() => setTab("setup")}><Settings2 size={13} style={{ marginRight: 4 }} />Setup กลยุทธ์การเติมสินค้า</span>
      </div>

      {tab === "requests" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>SYNNEX ID</th><th>Item Name</th><th>Pick Location</th><th>ระบบ</th><th>คงเหลือ</th><th>Min</th><th>Max</th><th>แนะนำเติม</th><th>Source (พร้อมจ่าย)</th><th>สถานะ</th><th></th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.rule.id}>
                  <td className="mono">{r.rule.itemId}</td>
                  <td>{itemOf(r.rule.itemId)?.name}</td>
                  <td className="mono">{r.rule.pickLoc}</td>
                  <td><span className={`sys-tag ${locOf(r.rule.pickLoc)?.system}`}>{locOf(r.rule.pickLoc)?.system}</span></td>
                  <td style={{ color: r.needs ? "var(--danger)" : "inherit" }}>{r.current}</td>
                  <td>{r.rule.min}</td><td>{r.rule.max}</td>
                  <td>{r.needs ? r.suggested : "—"}</td>
                  <td className="mono">{r.rule.sourceLoc} ({r.sourceAvail})</td>
                  <td>
                    {r.job ? <span className="robot-step active">{r.job.steps[r.job.stepIdx]}</span> : r.needs ? <span className="robot-step" style={{ color: "var(--danger)" }}>ต้องเติม</span> : <span className="robot-step done"><CheckCircle2 size={11} /> เพียงพอ</span>}
                  </td>
                  <td>{r.needs && !r.job && <button className="btn secondary" onClick={() => trigger(r.rule)}><PlayCircle size={12} /> เรียกเติมสินค้า</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "setup" && (
        <>
          <div style={{ marginBottom: 14 }}><button className="btn" onClick={() => setRuleModal({ itemId: ITEMS[0].id, pickLoc: LOCATIONS[0].code, min: 100, max: 500, sourceLoc: LOCATIONS[1].code, strategy: "Min-Max Trigger" })}><PlusCircle size={13} /> เพิ่มกฎการเติมสินค้า</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rule</th><th>SYNNEX ID</th><th>Item Name</th><th>Pick Location</th><th>Min</th><th>Max</th><th>Source</th><th>กลยุทธ์</th><th></th></tr></thead>
              <tbody>
                {replenishRules.map((r) => (
                  <tr key={r.id}>
                    <td className="mono">{r.id}</td><td className="mono">{r.itemId}</td><td>{itemOf(r.itemId)?.name}</td><td className="mono">{r.pickLoc}</td><td>{r.min}</td><td>{r.max}</td><td className="mono">{r.sourceLoc}</td><td>{r.strategy}</td>
                    <td><button className="btn secondary" onClick={() => setRuleModal(r)}><Edit3 size={12} /> แก้ไข</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {ruleModal && <ReplenishRuleModal rule={ruleModal} onClose={() => setRuleModal(null)} onSave={saveRule} />}
    </>
  );
}

function ReplenishRuleModal({ rule, onClose, onSave }) {
  const [form, setForm] = useState(rule);
  return (
    <Modal onClose={onClose} width={460}>
      <h2>{rule.id ? "แก้ไขกฎการเติมสินค้า" : "เพิ่มกฎการเติมสินค้าใหม่"}</h2>
      <div className="field"><label>สินค้า</label><select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })}>{ITEMS.map((i) => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}</select></div>
      <div className="grid g2">
        <div className="field"><label>Pick Location</label><select value={form.pickLoc} onChange={(e) => setForm({ ...form, pickLoc: e.target.value })}>{LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.code}</option>)}</select></div>
        <div className="field"><label>Source Location</label><select value={form.sourceLoc} onChange={(e) => setForm({ ...form, sourceLoc: e.target.value })}>{LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.code}</option>)}</select></div>
        <div className="field"><label>Min Qty</label><input type="number" value={form.min} onChange={(e) => setForm({ ...form, min: Number(e.target.value) })} /></div>
        <div className="field"><label>Max Qty</label><input type="number" value={form.max} onChange={(e) => setForm({ ...form, max: Number(e.target.value) })} /></div>
      </div>
      <div className="field"><label>กลยุทธ์การเติมสินค้า</label><select value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })}>{REPLENISH_STRATEGIES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onSave(form)}><Save size={13} /> บันทึก</button>
    </Modal>
  );
}

/* ================================================================== */
/* ALLOCATION ORDER — Allocate ⇄ Un-Allocate, then Release → Pick       */
/* ================================================================== */

function AllocationOrder({ allocOrders, setAllocOrders, stock, setStock, pickTasks, setPickTasks, robotJobs, setRobotJobs, applyPick, addTx, notify, confirmAction }) {
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ customer: "", priority: "Normal", channel: "B2B", route: "BKK-01", region: "Bangkok", salesSentAt: "2569-07-10 11:00", shipSeq: 9, lines: [{ itemId: ITEMS[0].id, qty: 1 }] });
  const [filters, setFilters] = useState({ q: "", priority: "ALL", channel: "ALL", route: "ALL", region: "ALL", customer: "ALL", sortBy: "salesSentAt", sortDir: "asc" });
  const [detailOrderId, setDetailOrderId] = useState("");
  const [sourcePick, setSourcePick] = useState({});
  const [sourceChecked, setSourceChecked] = useState({});

  const readyForSale = (row) => row.status === "AVL" && stickerStateOfStock(row).ok;
  const availRows = (itemId) => stock.filter((s) => s.itemId === itemId && readyForSale(s));
  const stickerBlockedRows = (itemId) => stock.filter((s) => s.itemId === itemId && s.status === "AVL" && !stickerStateOfStock(s).ok);
  const availableQty = (itemId) => availRows(itemId).reduce((a, r) => a + r.qty, 0);
  const stockKeyOf = (row) => String(row?.key || `${row?.itemId || ""}|${row?.loc || ""}|${row?.lpn || ""}|${row?.batch || ""}|${row?.status || ""}|${row?.allocatedFor || ""}`);
  const sourcePickKey = (orderId, itemId, row) => `${orderId}|${itemId}|${stockKeyOf(row)}`;
  const locUtil = (loc) => {
    const l = locOf(loc);
    const cap = Number(l?.capacity || 0);
    const used = stock.filter((s) => s.loc === loc).reduce((a, r) => a + Number(r.qty || 0), 0);
    return { used, cap, pct: cap ? Math.min(100, Math.round((used / cap) * 100)) : 0 };
  };
  const palletOrBasketState = (row) => {
    const l = locOf(row?.loc);
    const cap = Number(l?.capacity || 0);
    const pct = cap ? (Number(row?.qty || 0) / cap) * 100 : 0;
    const unit = ["ASRS", "Miniload", "Bin"].includes(l?.system) || l?.type === "Bin" ? "ตะกร้า" : "พาเลท";
    return `${pct >= 90 ? "เต็ม" : "ไม่เต็ม"}${unit}`;
  };
  const onhandRowsForOrder = (order) => {
    const wanted = new Set(orderLinesOf(order || {}).map((l) => l.itemId));
    const grouped = new Map();
    stock
      .filter((r) => wanted.has(r.itemId) && ((r.status === "AVL") || (r.status === "ALLOC" && r.allocatedFor === order?.id)))
      .forEach((r) => {
        const groupKey = `${r.itemId}|${r.loc || ""}|${r.lpn || ""}|${r.batch || ""}`;
        const prev = grouped.get(groupKey) || { ...r, qty: 0, onhandQty: 0, allocatedQty: 0, sourceKeys: [], allocKeys: [] };
        if (r.status === "AVL") {
          prev.qty += Number(r.qty || 0);
          prev.onhandQty += Number(r.qty || 0);
          if (readyForSale(r)) prev.sourceKeys.push(stockKeyOf(r));
          prev.key = prev.key || r.key;
          prev.canAllocate = Boolean(prev.canAllocate || readyForSale(r));
          if (!readyForSale(r)) prev.blockReason = stickerStateOfStock(r).required && !stickerStateOfStock(r).ok ? "รอติดสติ๊กเกอร์" : "ไม่พร้อมขาย";
        }
        if (r.status === "ALLOC" && r.allocatedFor === order?.id) {
          prev.allocatedQty += Number(r.qty || 0);
          prev.allocKeys.push(stockKeyOf(r));
          // Preserve sticker fields from allocated row when the AVL remainder is zero.
          Object.assign(prev, { stickerStatus: prev.stickerStatus || r.stickerStatus, stickerLot: prev.stickerLot || r.stickerLot });
        }
        grouped.set(groupKey, prev);
      });
    return [...grouped.values()].map((r) => {
      const util = locUtil(r.loc);
      return {
        ...r,
        originalOnhandQty: Number(r.onhandQty || 0) + Number(r.allocatedQty || 0),
        remainingQty: Number(r.onhandQty || 0),
        canAllocate: Boolean(r.canAllocate),
        blockReason: r.blockReason || "",
        system: locOf(r.loc)?.system || "Manual",
        type: locOf(r.loc)?.type || "-",
        plant: locOf(r.loc)?.plant || "-",
        floor: locOf(r.loc)?.floor || "-",
        utilPct: util.pct,
        utilUsed: util.used,
        utilCap: util.cap,
        palletState: palletOrBasketState(r),
      };
    });
  };
  const selectedSourcePlan = (order) => {
    const rows = onhandRowsForOrder(order).filter((r) => r.status === "AVL" && r.canAllocate);
    return rows.reduce((acc, r) => {
      const key = sourcePickKey(order.id, r.itemId, r);
      if (!sourceChecked[key]) return acc;
      const qty = Math.min(Number(sourcePick[key] || 0), Number(r.qty || 0));
      if (qty > 0) acc[r.itemId] = [...(acc[r.itemId] || []), { rowKey: stockKeyOf(r), sourceKeys: r.sourceKeys || [stockKeyOf(r)], qty }];
      return acc;
    }, {});
  };
  const selectedSourceQty = (order) => Object.values(selectedSourcePlan(order)).flat().reduce((a, r) => a + Number(r.qty || 0), 0);
  const setSourceQty = (orderId, itemId, row, qty) => {
    const max = row.canAllocate ? Number(row.onhandQty ?? row.qty ?? 0) : 0;
    const clean = Math.max(0, Math.min(Number(qty || 0), max));
    const key = sourcePickKey(orderId, itemId, row);
    setSourcePick((prev) => ({ ...prev, [key]: clean }));
    setSourceChecked((prev) => ({ ...prev, [key]: clean > 0 }));
  };
  const toggleSource = (order, row, checked) => {
    const key = sourcePickKey(order.id, row.itemId, row);
    setSourceChecked((prev) => ({ ...prev, [key]: checked }));
    const max = row.canAllocate ? Number(row.onhandQty ?? row.qty ?? 0) : 0;
    setSourcePick((prev) => ({ ...prev, [key]: checked ? Math.max(1, Number(prev[key] || Math.min(max, orderLinesOf(order).find((l) => l.itemId === row.itemId)?.qty || max))) : 0 }));
  };

  useEffect(() => {
    const order = allocOrders.find((o) => o.id === detailOrderId);
    if (!order || order.status !== "Pending") return;
    const existingKeys = Object.keys(sourcePick).filter((k) => k.startsWith(`${order.id}|`));
    if (existingKeys.length) return;
    const nextPick = {};
    const nextChecked = {};
    const rows = onhandRowsForOrder(order).filter((r) => r.status === "AVL" && r.canAllocate);
    orderLinesOf(order).forEach((line) => {
      let need = Number(line.qty || 0);
      rows.filter((r) => r.itemId === line.itemId).forEach((r) => {
        if (need <= 0) return;
        const take = Math.min(need, Number(r.onhandQty || r.qty || 0));
        if (take <= 0) return;
        const key = sourcePickKey(order.id, r.itemId, r);
        nextPick[key] = take;
        nextChecked[key] = true;
        need -= take;
      });
    });
    if (Object.keys(nextPick).length) {
      setSourcePick((prev) => ({ ...prev, ...nextPick }));
      setSourceChecked((prev) => ({ ...prev, ...nextChecked }));
    }
  }, [detailOrderId, allocOrders, stock]);

  const advanceJob = (jobId, steps, onDone) => {
    let i = 0;
    const tick = () => {
      i++;
      setRobotJobs((jobs) => jobs.map((j) => (j.id === jobId ? { ...j, status: steps[i] } : j)));
      if (i < steps.length - 1) setTimeout(tick, 1400);
      else if (onDone) onDone();
    };
    setTimeout(tick, 1400);
  };

  // ALLOCATE — reserve stock from AVL → ALLOC (tagged to this order). No robot/pick dispatch yet.
  const allocate = (order, sourcePlan = {}) => {
    const selectedModeAtStart = Object.keys(sourcePlan || {}).some((itemId) => (sourcePlan[itemId] || []).some((s) => Number(s.qty || 0) > 0));
    const allocatableQtyAtStart = order.items.reduce((sum, it) => {
      if (selectedModeAtStart) {
        const selectedRows = sourcePlan[it.itemId] || [];
        const selectedReadyQty = selectedRows.reduce((a, sel) => {
          const readyQty = (sel.sourceKeys || [sel.rowKey]).reduce((s, rowKey) => {
            const row = stock.find((r) => stockKeyOf(r) === rowKey && r.itemId === it.itemId && readyForSale(r));
            return s + Number(row?.qty || 0);
          }, 0);
          return a + Math.min(Number(sel.qty || 0), readyQty);
        }, 0);
        return sum + Math.min(Number(it.qty || 0), selectedReadyQty);
      }
      return sum + Math.min(Number(it.qty || 0), availRows(it.itemId).reduce((a, r) => a + Number(r.qty || 0), 0));
    }, 0);
    if (allocatableQtyAtStart <= 0) {
      const needQty = order.items.reduce((a, it) => a + Number(it.qty || 0), 0);
      notify("สินค้าไม่เพียงพอต่อคำสั่งซื้อ", `ไม่สามารถ Allocate ได้ เพราะไม่มีสินค้า Available พร้อมจ่ายสำหรับ Order นี้ · ต้องการ ${needQty} หน่วย`, "danger");
      addTx({ type: "Allocate Blocked", detail: `${order.id}: Block Allocate เพราะสินค้า Available ไม่เพียงพอ / ไม่มี stock พร้อมจ่าย`, itemId: null });
      return;
    }
    const lines = [];
    const blockedWarnings = [];
    setStock((stockList) => {
      let next = [...stockList];
      order.items.forEach((it) => {
        let need = it.qty;
        const blockedQty = next.filter((r) => r.itemId === it.itemId && r.status === "AVL" && !stickerStateOfStock(r).ok).reduce((a, r) => a + r.qty, 0);
        if (blockedQty > 0) blockedWarnings.push({ itemId: it.itemId, qty: blockedQty });
        const availableNow = next.filter((r) => r.itemId === it.itemId && readyForSale(r));
        const selectedRows = sourcePlan[it.itemId] || [];
        const selectedMode = selectedRows.length > 0;
        const candidates = selectedMode
          ? selectedRows.flatMap((sel) => (sel.sourceKeys || [sel.rowKey]).map((rowKey) => ({ rowKey, limit: Number(sel.qty || 0) }))).filter((sel) => sel.limit > 0)
          : availableNow.map((r) => ({ rowKey: stockKeyOf(r), limit: Number(r.qty || 0) }));
        const sources = [];
        for (const candidate of candidates) {
          if (need <= 0) break;
          const r = next.find((row) => stockKeyOf(row) === candidate.rowKey && row.itemId === it.itemId && readyForSale(row));
          if (!r) continue;
          const take = Math.min(need, Number(r.qty || 0), Number(candidate.limit || 0));
          if (take <= 0) continue;
          sources.push({ loc: r.loc || "PICK-PACK", system: locOf(r.loc)?.system || "Manual", qty: take, pickedQty: 0, lpn: r.lpn || "-", warehouse: locOf(r.loc)?.plant || "BKK1", onhandBefore: r.qty, utilPct: locUtil(r.loc).pct });
          need -= take;
          next = next.map((row) => (row === r ? { ...row, qty: row.qty - take } : row));
          next = [...next, { ...r, key: Date.now() + Math.random(), qty: take, status: "ALLOC", allocatedFor: order.id }];
          candidate.limit -= take;
        }
        lines.push({ itemId: it.itemId, qty: it.qty, available: availableNow.reduce((a, r) => a + Number(r.qty || 0), 0), sources, shortfall: need, stickerBlockedQty: blockedQty, allocationMode: selectedMode ? "Manual Location" : "Auto" });
      });
      return next.filter((r) => r.qty > 0);
    });
    const allOk = lines.every((l) => l.shortfall <= 0);
    const noneOk = lines.every((l) => l.sources.length === 0);
    const status = allOk ? "Allocated" : noneOk ? "Backorder" : "Partial";
    const allocatedQty = lines.reduce((a, l) => a + l.sources.reduce((s, src) => s + src.qty, 0), 0);
    const shortQty = lines.reduce((a, l) => a + l.shortfall, 0);
    const event = { t: new Date().toISOString(), type: status === "Partial" ? "Partial Allocate" : status, detail: `Allocated ${allocatedQty} / Short ${shortQty}` };
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status, lines, originalItems: o.originalItems || o.items, orderEvents: [...(o.orderEvents || []), event] } : o)));
    setSourcePick((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${order.id}|`))));
    setSourceChecked((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${order.id}|`))));
    addTx({ type: "Allocate", detail: `${order.id}: จองสต็อกสำเร็จ (${status}) — Allocated ${allocatedQty} หน่วย / Short ${shortQty} หน่วย (${Object.keys(sourcePlan).length ? "Manual location selection" : "Auto allocation"})`, itemId: null });
    if (blockedWarnings.length) {
      const blockedText = blockedWarnings.map((b) => `${b.itemId} · ${itemOf(b.itemId)?.name} ค้างติดสติ๊กเกอร์ ${b.qty}`).join(", ");
      notify("ของพร้อมขายแต่ยังไม่ได้ติดสติ๊กเกอร์", blockedText, "danger");
      addTx({ type: "Sticker Block Allocate", detail: `${order.id}: ${blockedText}`, itemId: blockedWarnings[0]?.itemId || null });
    }
    if (!allOk) {
      const shortText = lines.filter((l) => l.shortfall > 0).map((l) => `${l.itemId} · ${itemOf(l.itemId)?.name} ขาด ${l.shortfall}`).join(", ");
      notify("Inventory not enough", `สินค้ามีไม่เพียงพอต่อการขาย: ${shortText}`, "danger");
    } else notify("Allocate สำเร็จ", `${order.id} จองสต็อกครบตามคำสั่งซื้อ`, "success");
  };

  // UN-ALLOCATE — release the reservation, ALLOC → back to AVL. Only before Release.
  const unallocate = (order) => {
    setStock((stockList) => {
      let next = [...stockList];
      (order.lines || []).forEach((l) => {
        l.sources.forEach((s) => {
          const allocRow = next.find((r) => r.itemId === l.itemId && r.loc === s.loc && r.status === "ALLOC" && r.allocatedFor === order.id);
          if (!allocRow) return;
          next = next.filter((r) => r !== allocRow);
          const existingAvl = next.find((r) => r.itemId === l.itemId && r.loc === s.loc && r.status === "AVL" && r.batch === allocRow.batch);
          if (existingAvl) next = next.map((r) => (r === existingAvl ? { ...r, qty: r.qty + allocRow.qty } : r));
          else next = [...next, { ...allocRow, status: "AVL", allocatedFor: undefined }];
        });
      });
      return next;
    });
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: "Pending", lines: undefined } : o)));
    addTx({ type: "Un-Allocate", detail: `${order.id}: ยกเลิกการจองสต็อก — คืนสถานะ Inventory เป็น Available`, itemId: null });
  };

  const remainingItemsOf = (order) => (order.lines || [])
    .filter((l) => l.shortfall > 0)
    .map((l) => ({ itemId: l.itemId, qty: l.shortfall }));

  const releaseSources = (order, sourcesMode = "all") => {
    const releasedLines = (order.lines || []).filter((l) => l.sources?.length > 0);
    releasedLines.forEach((l) => {
      l.sources.forEach((s) => {
        if (s.released) return;
        if (s.system === "ASRS" || s.system === "Miniload") {
          const jobId = `RB-${rand(1000, 9999)}`;
          setRobotJobs((jobs) => [...jobs, { id: jobId, orderId: order.id, itemId: l.itemId, loc: s.loc, system: s.system, qty: s.qty, status: "Command Sent" }]);
          advanceJob(jobId, ["Command Sent", "Retrieving", "Delivered to Station"], () => applyPick({ orderId: order.id, itemId: l.itemId, loc: s.loc, qty: s.qty }));
          addTx({ type: "Release", detail: `${order.id}: Release ${sourcesMode === "partial" ? "Partial" : "Order"} → ส่งคำสั่งไปยัง ${s.system} Controller ดึง ${itemOf(l.itemId)?.name} ${s.qty} หน่วย จาก ${s.loc}`, itemId: l.itemId });
        } else {
          const taskId = `PT-${rand(6000, 9999)}`;
          setPickTasks((list) => [...list, { id: taskId, order: order.id, itemId: l.itemId, qty: s.qty, loc: s.loc, strategy: "Person-to-Goods (PTG)", status: "Assigned", assignee: "รอมอบหมาย", released: true, releasedAt: new Date().toISOString() }]);
          addTx({ type: "Release", detail: `${order.id}: Release ${sourcesMode === "partial" ? "Partial" : "Order"} → สร้าง Pick Task ${taskId} ให้พนักงานหยิบ ${itemOf(l.itemId)?.name} ${s.qty} หน่วย ที่ ${s.loc}`, itemId: l.itemId });
        }
      });
    });
  };

  const releasePartial = (order) => {
    releaseSources(order, "partial");
    const remainingItems = remainingItemsOf(order);
    const releasedQty = (order.lines || []).reduce((a, l) => a + l.sources.reduce((s, src) => s + src.qty, 0), 0);
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? {
      ...o,
      status: remainingItems.length ? "Partial Released" : "Released",
      items: remainingItems.length ? remainingItems : o.items,
      remainingItems,
      lines: (o.lines || []).map((l) => ({ ...l, sources: l.sources.map((s) => ({ ...s, released: true })) })),
      orderEvents: [...(o.orderEvents || []), { t: new Date().toISOString(), type: "Partial Released", detail: `ส่งออกบางส่วน ${releasedQty} หน่วย / ค้าง allocate ${remainingItems.reduce((a, i) => a + i.qty, 0)} หน่วย` }],
    } : o)));
    notify("Release Partial สำเร็จ", `${order.id} ส่งสินค้าที่มีออกก่อน และคงค้างส่วนที่ขาดไว้ Re-Allocate`, "success");
  };

  const reallocateShortage = (order) => {
    const remaining = order.remainingItems?.length ? order.remainingItems : remainingItemsOf(order);
    if (!remaining.length) return;
    const retryOrder = { ...order, items: remaining, lines: undefined, status: "Pending" };
    allocate(retryOrder);
  };

  const cancelShortage = (order) => {
    const shortQty = (order.remainingItems?.length ? order.remainingItems : remainingItemsOf(order)).reduce((a, i) => a + i.qty, 0);
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? {
      ...o,
      status: "Partial Closed",
      remainingItems: [],
      items: o.originalItems || o.items,
      orderEvents: [...(o.orderEvents || []), { t: new Date().toISOString(), type: "Cancel Shortage", detail: `ตัดรายการที่ขาด ${shortQty} หน่วยออกจาก Order` }],
    } : o)));
    addTx({ type: "Cancel Shortage", detail: `${order.id}: ตัดรายการที่ขาด ${shortQty} หน่วยออกจาก Order และปิดงานบางส่วน`, itemId: null });
    notify("Cancel Shortage สำเร็จ", `${order.id} ตัดรายการขาดออกและบันทึก Transaction แล้ว`, "success");
  };

  const cancelOrder = (order) => {
    unallocate(order);
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? {
      ...o,
      status: "Cancelled",
      orderEvents: [...(order.orderEvents || []), { t: new Date().toISOString(), type: "Cancel Order", detail: "ยกเลิก Order ที่ Allocate ไม่ได้ / ไม่ต้องการจัดส่ง" }],
    } : o)));
    addTx({ type: "Cancel Order", detail: `${order.id}: ยกเลิก Order และคืนสต็อกที่จองไว้`, itemId: null });
    notify("Cancel Order สำเร็จ", `${order.id} ถูกยกเลิกและบันทึกประวัติแล้ว`, "success");
  };

  // RELEASE ORDER — dispatch to Robot (ASRS/Miniload) or create Pick Task (Manual)
  const release = (order) => {
    releaseSources(order, "all");
    setAllocOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: "Released", lines: (o.lines || []).map((l) => ({ ...l, sources: (l.sources || []).map((s) => ({ ...s, released: true })) })), orderEvents: [...(o.orderEvents || []), { t: new Date().toISOString(), type: "Released", detail: "Release ครบทั้ง Order" }] } : o)));
  };

  const addManualLine = () => setManualForm((f) => ({ ...f, lines: [...f.lines, { itemId: ITEMS[0].id, qty: 1 }] }));
  const removeManualLine = (idx) => setManualForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));
  const updateManualLine = (idx, field, val) => setManualForm((f) => ({ ...f, lines: f.lines.map((l, i) => (i === idx ? { ...l, [field]: val } : l)) }));
  const submitManual = () => {
    if (!manualForm.customer) return;
    const id = `MO-${rand(9000, 9999)}`;
    setAllocOrders((list) => [...list, { id, customer: manualForm.customer, priority: manualForm.priority, channel: manualForm.channel, route: manualForm.route, region: manualForm.region, salesSentAt: manualForm.salesSentAt, shipSeq: Number(manualForm.shipSeq) || list.length + 1, items: manualForm.lines.map((l) => ({ itemId: l.itemId, qty: Number(l.qty) || 1 })), status: "Pending", source: "Manual" }]);
    addTx({ type: "Order", detail: `สร้าง Order Manual ${id} (${manualForm.customer}) เพื่อ Allocate`, itemId: null });
    notify("สร้าง Order สำเร็จ", `${id} ถูกสร้างและรอ Allocate`, "success");
    setManualOpen(false); setManualForm({ customer: "", priority: "Normal", channel: "B2B", route: "BKK-01", region: "Bangkok", salesSentAt: "2569-07-10 11:00", shipSeq: 9, lines: [{ itemId: ITEMS[0].id, qty: 1 }] });
  };

  const statusTagClass = (s) => (["Picked", "Partial Closed"].includes(s) ? "Completed" : ["Backorder", "Partial", "Cancelled"].includes(s) ? "Hold" : ["Released", "Partial Released"].includes(s) ? "Receiving" : "Booked");
  const metaOf = (o, idx = 0) => ({
    channel: o.channel || (o.source === "Manual" ? "Manual" : "B2B"),
    route: o.route || ["BKK-01", "NORTH-02", "EAST-01", "SOUTH-01"][idx % 4],
    region: o.region || ["Bangkok", "North", "East", "South"][idx % 4],
    salesSentAt: o.salesSentAt || `2569-07-10 ${String(8 + idx).padStart(2, "0")}:00`,
    shipSeq: Number(o.shipSeq || idx + 1),
    customer: o.customer || "-",
  });
  const uniq = (key) => [...new Set(allocOrders.map((o, idx) => metaOf(o, idx)[key]).filter(Boolean))].sort();
  const priorityRank = { "SLA Risk": 1, VIP: 2, Normal: 3 };
  const filteredOrders = allocOrders
    .map((o, idx) => ({ ...o, _meta: metaOf(o, idx), _idx: idx }))
    .filter((o) => {
      const q = filters.q.trim().toLowerCase();
      if (q && !`${o.id} ${o.customer} ${o.priority} ${o._meta.channel} ${o._meta.route} ${o._meta.region}`.toLowerCase().includes(q)) return false;
      return (filters.priority === "ALL" || o.priority === filters.priority)
        && (filters.channel === "ALL" || o._meta.channel === filters.channel)
        && (filters.route === "ALL" || o._meta.route === filters.route)
        && (filters.region === "ALL" || o._meta.region === filters.region)
        && (filters.customer === "ALL" || o.customer === filters.customer);
    })
    .sort((a, b) => {
      const dir = filters.sortDir === "desc" ? -1 : 1;
      const valueOf = (o) => {
        if (filters.sortBy === "priority") return priorityRank[o.priority] || 9;
        if (filters.sortBy === "shipSeq") return o._meta.shipSeq;
        if (filters.sortBy === "salesSentAt") return o._meta.salesSentAt;
        if (filters.sortBy === "channel") return o._meta.channel;
        if (filters.sortBy === "route") return o._meta.route;
        if (filters.sortBy === "region") return o._meta.region;
        if (filters.sortBy === "customer") return o.customer;
        return o._idx;
      };
      return String(valueOf(a)).localeCompare(String(valueOf(b)), "th", { numeric: true }) * dir;
    });
  const detailOrder = filteredOrders.find((o) => o.id === detailOrderId);
  const normalizedLinesOf = (order) => {
    const rawLines = order?.lines?.length ? order.lines : orderLinesOf(order).map((l) => ({ ...l, sources: [] }));
    const lineMap = new Map();
    rawLines.forEach((l) => {
      const lineKey = l.itemId;
      const existing = lineMap.get(lineKey) || { ...l, qty: Number(l.qty || 0), sources: [] };
      existing.qty = Math.max(Number(existing.qty || 0), Number(l.qty || 0));
      const sourceMap = new Map(existing.sources.map((s) => [`${s.loc}|${s.lpn || ""}|${s.system || ""}`, { ...s }]));
      (l.sources || []).forEach((s) => {
        const key = `${s.loc}|${s.lpn || ""}|${s.system || ""}`;
        const prev = sourceMap.get(key);
        if (prev) sourceMap.set(key, { ...prev, qty: Math.max(Number(prev.qty || 0), Number(s.qty || 0)), pickedQty: Math.max(Number(prev.pickedQty || 0), Number(s.pickedQty || 0)), released: prev.released || s.released });
        else sourceMap.set(key, { ...s });
      });
      existing.sources = [...sourceMap.values()];
      lineMap.set(lineKey, existing);
    });
    return [...lineMap.values()];
  };
  const orderProgress = (order) => {
    const lines = normalizedLinesOf(order);
    const originalQty = (order.originalItems || order.items || lines).reduce((a, i) => a + Number(i.qty || 0), 0);
    const allocatedQty = lines.reduce((a, l) => a + (l.sources || []).reduce((s, src) => s + Number(src.qty || 0), 0), 0);
    const releasedQty = lines.reduce((a, l) => a + (l.sources || []).filter((s) => s.released).reduce((s, src) => s + Number(src.qty || 0), 0), 0);
    const pickedQty = lines.reduce((a, l) => a + (l.sources || []).reduce((s, src) => s + Math.min(Number(src.qty || 0), Number(src.pickedQty || 0)), 0), 0);
    const openRemaining = (order.remainingItems?.length ? order.remainingItems : remainingItemsOf(order)).reduce((a, i) => a + Number(i.qty || 0), 0);
    const cancelledQty = order.status === "Partial Closed" ? openRemaining : 0;
    const remainingQty = order.status === "Partial Closed" ? 0 : openRemaining;
    return { originalQty, allocatedQty, releasedQty, pickedQty: originalQty > 0 ? Math.min(pickedQty, originalQty) : pickedQty, remainingQty, cancelledQty };
  };
  const allocationLineRows = filteredOrders.flatMap((o) => {
    const lines = normalizedLinesOf(o);
    return lines.flatMap((l) => (l.sources?.length ? l.sources : [{ loc: "-", qty: l.qty || 0, system: "-", lpn: "-", pickedQty: 0 }]).map((s) => ({
      orderId: o.id, customer: o.customer, priority: o.priority, status: o.status, itemId: l.itemId, itemName: itemOf(l.itemId)?.name || "-", loc: s.loc, lpn: s.lpn || "-", qty: s.qty, picked: s.pickedQty || 0, worker: s.system === "ASRS" || s.system === "Miniload" ? s.system : (pickTasks.find((t) => t.order === o.id && t.itemId === l.itemId)?.assignee || "Manual Picker"), system: s.system,
    })));
  });

  return (
    <>
      <div className="section-title">คำสั่งซื้อรอจัดสรรสต็อก (Real-Time Inventory Allocation)</div>
      <div className="kpi-sub" style={{ marginBottom: 12 }}>
        1) <b>Allocate</b> จองสต็อก (AVL → Allocated) — สามารถ <b>Un-Allocate</b> คืนสต็อกได้ก่อน Release · 2) <b>Release Order</b> จึงจะส่งคำสั่งให้ Robot (ASRS/Miniload) หรือสร้าง Pick Task ให้พนักงาน · 3) เมื่อ Pick/Scan สำเร็จ สถานะสินค้าเปลี่ยนเป็น <b>Picked</b> พร้อมส่ง Pack Station
      </div>
      <div style={{ marginBottom: 16 }}><button className="btn secondary" onClick={() => setManualOpen(true)}><PlusCircle size={13} /> สร้าง Order Manual เพื่อ Allocate</button></div>

      <div className="allocation-filter-panel">
        <div className="search-box allocation-search"><Search size={15} color="var(--muted)" /><input placeholder="ค้นหา Order / ลูกค้า / ช่องทาง / สายส่ง / ภูมิภาค" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} /></div>
        <div className="allocation-filter-grid">
          <div className="field"><label>Priority</label><select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="ALL">ทั้งหมด</option><option>VIP</option><option>SLA Risk</option><option>Normal</option></select></div>
          <div className="field"><label>ช่องทางขาย</label><select value={filters.channel} onChange={(e) => setFilters({ ...filters, channel: e.target.value })}><option value="ALL">ทั้งหมด</option>{uniq("channel").map((v) => <option key={v}>{v}</option>)}</select></div>
          <div className="field"><label>สายการจัดส่ง</label><select value={filters.route} onChange={(e) => setFilters({ ...filters, route: e.target.value })}><option value="ALL">ทั้งหมด</option>{uniq("route").map((v) => <option key={v}>{v}</option>)}</select></div>
          <div className="field"><label>ภูมิภาค</label><select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}><option value="ALL">ทั้งหมด</option>{uniq("region").map((v) => <option key={v}>{v}</option>)}</select></div>
          <div className="field"><label>ลูกค้า</label><select value={filters.customer} onChange={(e) => setFilters({ ...filters, customer: e.target.value })}><option value="ALL">ทั้งหมด</option>{uniq("customer").map((v) => <option key={v}>{v}</option>)}</select></div>
          <div className="field"><label>เรียงตาม</label><select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
            <option value="salesSentAt">เวลาทีมขายส่ง Order</option>
            <option value="shipSeq">ลำดับการส่งออก</option>
            <option value="priority">ความด่วนของ Order</option>
            <option value="channel">ช่องทางการขาย</option>
            <option value="route">สายการจัดส่ง</option>
            <option value="region">ภูมิภาค</option>
            <option value="customer">ลูกค้า</option>
          </select></div>
          <div className="field"><label>ทิศทาง</label><select value={filters.sortDir} onChange={(e) => setFilters({ ...filters, sortDir: e.target.value })}><option value="asc">น้อยไปมาก / เก่าก่อน</option><option value="desc">มากไปน้อย / ใหม่ก่อน</option></select></div>
        </div>
        <div className="kpi-sub">แสดง {filteredOrders.length} จาก {allocOrders.length} Order · ใช้สำหรับจัดลำดับงาน Allocate ก่อนปล่อยไป Pick / Robot</div>
      </div>
      <div className="section-title">Order Queue for Allocation</div>
      <div className="table-wrap" style={{ marginBottom: 14 }}>
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Priority</th><th>Channel</th><th>Route</th><th>Region</th><th>Sales Sent</th><th>Ship Seq</th><th>Lines</th><th>Total Qty</th><th>Status</th><th>Stock Check</th><th>Order Progress</th><th></th></tr></thead>
          <tbody>
            {filteredOrders.map((o) => {
              const lines = orderLinesOf(o);
              const p = orderProgress(o);
              const progress = Math.min(100, Math.round((p.pickedQty / Math.max(p.originalQty, 1)) * 100));
              const stockCheck = p.remainingQty > 0 || o.status === "Backorder" || o.status === "Partial" ? `ไม่พอ ${p.remainingQty}` : p.allocatedQty > 0 ? "เพียงพอ" : "ยังไม่ Allocate";
              return (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td><td>{o.customer || "-"}</td><td>{o.priority || "Normal"}</td><td>{o._meta.channel}</td><td>{o._meta.route}</td><td>{o._meta.region}</td><td className="mono">{o._meta.salesSentAt}</td><td>{o._meta.shipSeq}</td><td>{lines.length}</td><td>{p.originalQty || lines.reduce((a, l) => a + Number(l.qty || 0), 0)}</td><td><OrderStatusPill status={o.status} /></td><td>{stockCheck}</td><td>{utilizationBar(progress)}</td><td><button className="btn secondary" onClick={() => setDetailOrderId(o.id)}><ArrowRight size={12} /> รายละเอียด / Allocate</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="section-title">Allocation Line Overview</div>
      <div className="table-wrap" style={{ marginBottom: 14 }}>
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Priority</th><th>SYNNEX ID</th><th>Item Name</th><th>Location</th><th>LPN</th><th>Qty to Pick</th><th>Picked</th><th>Picker / System</th><th>Status</th></tr></thead>
          <tbody>{allocationLineRows.map((r, idx) => <tr key={`${r.orderId}-${r.itemId}-${r.loc}-${idx}`}><td className="mono">{r.orderId}</td><td>{r.customer}</td><td>{r.priority}</td><td className="mono">{r.itemId}</td><td>{r.itemName}</td><td className="mono">{r.loc}</td><td className="mono">{r.lpn}</td><td>{r.qty}</td><td>{r.picked}</td><td>{r.worker}</td><td><OrderStatusPill status={r.status} /></td></tr>)}</tbody>
        </table>
      </div>

      {false && filteredOrders.map((o) => (
        <div className="card" key={o.id} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <span className="mono" style={{ color: "var(--teal)", fontWeight: 600 }}>{o.id}</span> — {o.customer}
              <span className={`prio ${o.priority === "VIP" ? "vip" : o.priority === "SLA Risk" ? "sla" : "normal"}`}> · {o.priority}</span>
              {o.source === "Manual" && <span className="sys-tag Manual" style={{ marginLeft: 8 }}>Manual Order</span>}
              <div className="allocation-meta">
                <span><Clock size={11} /> {o._meta.salesSentAt}</span>
                <span><Truck size={11} /> Ship Seq {o._meta.shipSeq}</span>
                <span><ShoppingBag size={11} /> {o._meta.channel}</span>
                <span><Route size={11} /> {o._meta.route}</span>
                <span><MapPinned size={11} /> {o._meta.region}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {o.status !== "Pending" && <span className={`tag-status ${statusTagClass(o.status)}`}>{o.status}</span>}
              {o.status === "Pending" && <button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Allocate", message: `ต้องการจองสต็อกให้ ${o.id} หรือไม่`, onConfirm: () => allocate(o) })}><Lock size={12} /> Allocate</button>}
              {o.status === "Allocated" && (
                <>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "ยืนยัน Un-Allocate", message: `คืนสต็อกของ ${o.id} กลับเป็น Available หรือไม่`, onConfirm: () => { unallocate(o); notify("Un-Allocate สำเร็จ", `${o.id} คืนสต็อกแล้ว`, "success"); } })}><Unlock size={12} /> Un-Allocate</button>
                  <button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Release Order", message: `ปล่อยคำสั่ง ${o.id} ไป Pick/Robot หรือไม่`, onConfirm: () => { release(o); notify("Release สำเร็จ", `${o.id} ถูกส่งเข้า Pick/Robot แล้ว`, "success"); } })}><Send size={12} /> Release Order</button>
                </>
              )}
              {o.status === "Partial" && (
                <>
                  <span className="scan-step" style={{ color: "var(--danger)", background: "rgba(241,91,113,.12)" }}><AlertTriangle size={11} /> Partial Allocated</span>
                  <button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Release Partial", message: `ส่งสินค้าที่ Allocate ได้ของ ${o.id} ไปก่อน และคงค้างส่วนที่ขาดไว้หรือไม่`, onConfirm: () => releasePartial(o) })}><Send size={12} /> Release Partial</button>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "ยืนยัน Un-Allocate", message: `คืนสต็อกของ ${o.id} กลับเป็น Available หรือไม่`, onConfirm: () => { unallocate(o); notify("Un-Allocate สำเร็จ", `${o.id} คืนสต็อกแล้ว`, "success"); } })}><Unlock size={12} /> Un-Allocate</button>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "Cancel Order", message: `ยกเลิก ${o.id} ทั้ง Order และคืนสต็อกที่จองไว้หรือไม่`, kind: "danger", onConfirm: () => cancelOrder(o) })}><Trash2 size={12} /> Cancel Order</button>
                </>
              )}
              {o.status === "Partial Released" && (
                <>
                  <span className="scan-step done"><Send size={11} /> ส่งบางส่วนแล้ว</span>
                  <button className="btn" onClick={() => confirmAction({ title: "Re-Allocate Shortage", message: `ลอง Allocate ส่วนที่ค้างของ ${o.id} อีกครั้งหรือไม่`, onConfirm: () => reallocateShortage(o) })}><RefreshCw size={12} /> Re-Allocate Shortage</button>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "Cancel Shortage", message: `ตัดรายการที่ยังขาดของ ${o.id} ออกจาก Order หรือไม่`, onConfirm: () => cancelShortage(o) })}><Trash2 size={12} /> Cancel Shortage</button>
                </>
              )}
              {o.status === "Backorder" && (
                <>
                  <span className="scan-step" style={{ color: "var(--danger)", background: "rgba(241,91,113,.12)" }}><AlertTriangle size={11} /> Backorder</span>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "Re-Allocate Backorder", message: `ลอง Allocate ${o.id} อีกครั้งหลังเติมสต็อกหรือไม่`, onConfirm: () => reallocateShortage(o) })}><RefreshCw size={12} /> Re-Allocate</button>
                  <button className="btn secondary" onClick={() => confirmAction({ title: "Cancel Order", message: `ยกเลิก ${o.id} ทั้ง Order หรือไม่`, kind: "danger", onConfirm: () => cancelOrder(o) })}><Trash2 size={12} /> Cancel Order</button>
                </>
              )}
            </div>
          </div>

          {o.orderEvents?.length > 0 && (
            <div className="allocation-progress-strip">
              {(() => {
                const p = orderProgress(o);
                return (
                  <>
                    <div><span>Original Order</span><b>{p.originalQty}</b></div>
                    <div><span>Allocated Now</span><b>{p.allocatedQty}</b></div>
                    <div><span>Released / Sent</span><b>{p.releasedQty}</b></div>
                    <div><span>Pending Re-Allocate</span><b>{p.remainingQty}</b></div>
                    <div><span>Cancelled / Cut</span><b>{p.cancelledQty}</b></div>
                  </>
                );
              })()}
            </div>
          )}

          {o.lines ? (
            o.lines.map((l, idx) => (
              <div key={idx} style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12.5, marginBottom: 6 }}><span className="mono" style={{ color: "var(--teal)", fontWeight: 800 }}>{l.itemId}</span> · {itemOf(l.itemId)?.name} — ต้องการ {l.qty} · จองได้ {l.qty - l.shortfall} {l.shortfall > 0 && <span style={{ color: "var(--danger)" }}>(ขาด {l.shortfall})</span>}</div>
                {l.shortfall > 0 && (
                  <div className="allocation-shortage">
                    <AlertTriangle size={14} />
                    <span>Inventory not enough: มีพร้อมขาย {l.available} แต่ Order ต้องการ {l.qty} จึงขาด {l.shortfall} หน่วย</span>
                  </div>
                )}
                {l.stickerBlockedQty > 0 && (
                  <div className="allocation-shortage" style={{ background: "rgba(245,168,60,.12)", borderColor: "rgba(245,168,60,.35)", color: "var(--amber)" }}>
                    <AlertTriangle size={14} />
                    <span>ของพร้อมขายแต่ยังไม่ได้ติดสติ๊กเกอร์: {l.stickerBlockedQty} หน่วย ต้องเรียกเข้า Prework ก่อน Allocate / Release</span>
                  </div>
                )}
                {l.sources.length > 0 && (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Location</th><th>ระบบ</th><th>จำนวนที่จอง</th><th>สถานะการดำเนินการ</th></tr></thead>
                      <tbody>
                        {l.sources.map((s, si) => {
                          const job = robotJobs.find((j) => j.orderId === o.id && j.itemId === l.itemId && j.loc === s.loc);
                          const task = pickTasks.find((t) => t.order === o.id && t.itemId === l.itemId && t.loc === s.loc);
                          const picked = (s.pickedQty || 0) >= s.qty;
                          return (
                            <tr key={si}>
                              <td className="mono">{s.loc}</td>
                              <td><span className={`sys-tag ${s.system}`}>{s.system}</span></td>
                              <td>{s.qty}{s.pickedQty > 0 && <span className="kpi-sub"> (หยิบแล้ว {s.pickedQty})</span>}</td>
                              <td>
                                {picked ? <span className="robot-step done"><CheckCircle2 size={11} /> Picked — พร้อมส่ง Pack Station</span> : job ? (
                                  <span className={`robot-step ${job.status === "Delivered to Station" ? "done" : "active"}`}><Bot size={11} /> {job.status}</span>
                                ) : task ? (
                                  <span className={`robot-step ${task.status === "Completed" ? "done" : "active"}`}><Smartphone size={11} /> {task.status === "Completed" ? "พนักงานหยิบสำเร็จ" : `รอพนักงานหยิบ (${task.id})`}</span>
                                ) : (
                                  <span className="robot-step">รอ Release Order</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="table-wrap" style={{ marginTop: 12 }}>
              <table>
                <thead><tr><th>SYNNEX ID</th><th>Item Name</th><th>จำนวนที่สั่ง</th><th>สต็อกพร้อมจ่าย</th><th>รอติด Sticker</th></tr></thead>
                <tbody>{o.items.map((l, idx) => (<tr key={idx}><td className="mono">{l.itemId}</td><td>{itemOf(l.itemId)?.name}</td><td>{l.qty}</td><td>{availableQty(l.itemId)}</td><td>{stickerBlockedRows(l.itemId).reduce((a, r) => a + r.qty, 0)}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          {o.orderEvents?.length > 0 && (
            <div className="allocation-event-log">
              <div className="kpi-sub" style={{ fontWeight: 700, marginBottom: 6 }}>Order Transaction / Allocation Report</div>
              {o.orderEvents.slice().reverse().map((ev, idx) => (
                <div className="allocation-event" key={`${ev.t}-${idx}`}>
                  <span className="mono">{new Date(ev.t).toLocaleString("th-TH")}</span>
                  <b>{ev.type}</b>
                  <em>{ev.detail}</em>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {detailOrder && (
        <Modal onClose={() => setDetailOrderId("")} width={1280}>
          {(() => {
            const lines = normalizedLinesOf(detailOrder);
            const onhandRows = onhandRowsForOrder(detailOrder);
            const p = orderProgress(detailOrder);
            const progress = Math.min(100, Math.round((p.pickedQty / Math.max(p.originalQty, 1)) * 100));
            const hasShortage = p.remainingQty > 0 || detailOrder.status === "Backorder" || detailOrder.status === "Partial";
            const partialReadyText = p.allocatedQty > 0
              ? `Allocate ได้ ${p.allocatedQty} จาก ${p.originalQty} หน่วย · ขาด ${p.remainingQty} หน่วย · สามารถ Release Partial เพื่อส่งบางส่วนก่อนได้`
              : `Allocate ได้ 0 จาก ${p.originalQty} หน่วย · ขาด ${p.remainingQty || p.originalQty} หน่วย · ยังไม่มีสินค้าพร้อมส่งบางส่วน`;
            const selectedQty = selectedSourceQty(detailOrder);
            const selectableOnhand = onhandRows.filter((r) => r.status === "AVL" && r.canAllocate).reduce((a, r) => a + Number(r.onhandQty || 0), 0);
            const blockedOnhand = onhandRows.filter((r) => r.status === "AVL" && !r.canAllocate).reduce((a, r) => a + Number(r.onhandQty || 0), 0);
            const orderNeedQty = Math.max(0, Number(p.originalQty || 0) - Number(p.allocatedQty || 0));
            const orderQtyByItem = Object.fromEntries(orderLinesOf(detailOrder).map((l) => [l.itemId, Number(l.qty || 0)]));
            const stockCheckText = p.allocatedQty > 0
              ? (hasShortage ? partialReadyText : `สินค้าเพียงพอสำหรับ Order นี้ · Allocate ได้ ${p.allocatedQty} / ${p.originalQty} หน่วย`)
              : selectedQty > 0
                ? `เลือก Allocate ได้ ${selectedQty} จาก ${p.originalQty} หน่วย${blockedOnhand ? ` · มีสินค้า ${blockedOnhand} หน่วยที่ยังไม่พร้อมขาย/รอติดสติ๊กเกอร์` : ""}`
                : blockedOnhand > 0
                  ? `มี Stock ${blockedOnhand} หน่วย แต่ยังไม่พร้อมขาย/รอติดสติ๊กเกอร์ จึง Allocate ไม่ได้`
                  : "ยังไม่ได้ Allocate";
            const firstSource = lines.flatMap((l) => (l.sources || []).map((s) => ({ ...s, itemId: l.itemId }))).find(Boolean);
            const toteCount = Math.min(10, Math.max(1, Number(firstSource?.qty || 10)));
            const toteRows = Array.from({ length: toteCount }, (_, i) => ({
              tote: `TOTE-${String(i + 1).padStart(3, "0")}`,
              fromLpn: firstSource?.lpn || stock.find((s) => s.itemId === firstSource?.itemId)?.lpn || "LPN-PALLET",
              box: `BOX-${String(i + 1).padStart(2, "0")}`,
              itemId: firstSource?.itemId || lines[0]?.itemId || "-",
              order: i < 4 ? detailOrder.id : `SO-SHARE-${i + 1}`,
            }));
            return (
              <>
                <h2>Allocate Order Detail · <span className="mono">{detailOrder.id}</span></h2>
                <div className="grid g4" style={{ marginBottom: 12 }}>
                  <div className="mini-stat"><div className="lbl">Customer</div><div className="val">{detailOrder.customer || "-"}</div></div>
                  <div className="mini-stat"><div className="lbl">Status</div><div className="val"><OrderStatusPill status={detailOrder.status} /></div></div>
                  <div className="mini-stat"><div className="lbl">Original Qty</div><div className="val">{p.originalQty}</div></div>
                  <div className="mini-stat"><div className="lbl">Allocated / Picked</div><div className="val">{p.allocatedQty} / {p.pickedQty}</div></div>
                  <div className="mini-stat"><div className="lbl">Short / Backlog</div><div className="val" style={{ color: hasShortage ? "var(--danger)" : "var(--success)" }}>{hasShortage ? (p.remainingQty || p.originalQty) : 0}</div></div>
                </div>
                <div className={`allocation-shortage`} style={{ marginBottom: 12, color: hasShortage ? "var(--danger)" : "var(--success)", background: hasShortage ? "rgba(241,91,113,.12)" : "rgba(32,199,102,.10)", borderColor: hasShortage ? "rgba(241,91,113,.35)" : "rgba(32,199,102,.25)" }}><AlertTriangle size={14} /><span>{stockCheckText}</span></div>
                <div style={{ marginBottom: 14 }}>{utilizationBar(progress)}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {detailOrder.status === "Pending" && <>
                    <button className="btn secondary" onClick={() => confirmAction({ title: "ยืนยัน Auto Allocate", message: `ให้ระบบเลือก Location อัตโนมัติสำหรับ ${detailOrder.id} หรือไม่`, onConfirm: () => allocate(detailOrder) })}><Lock size={12} /> Auto Allocate</button>
                    <button className="btn" onClick={() => {
                      const plan = selectedSourcePlan(detailOrder);
                      if (!selectedQty && selectableOnhand <= 0) return notify("สินค้าไม่เพียงพอต่อคำสั่งซื้อ", `มีสินค้าให้ Allocate เพิ่มได้ 0 / ต้องการเพิ่ม ${orderNeedQty || p.originalQty} หน่วย · กรุณาเติม Stock หรือทำ Backorder`, "danger");
                      if (!selectedQty) return notify("ยังไม่ได้เลือก Location", "กรุณาติ๊กเลือก Location และใส่จำนวนในช่อง Allocate Qty ก่อน", "danger");
                      confirmAction({ title: "ยืนยัน Allocate ตาม Location", message: `จองสต็อกจาก Location ที่เลือก รวม ${selectedQty} หน่วย สำหรับ ${detailOrder.id} หรือไม่`, onConfirm: () => allocate(detailOrder, plan) });
                    }}><MapPinned size={12} /> Allocate Selected Location ({selectedQty})</button>
                  </>}
                  {detailOrder.status === "Allocated" && <><button className="btn secondary" onClick={() => confirmAction({ title: "ยืนยัน Un-Allocate", message: `คืนสต็อกของ ${detailOrder.id} กลับเป็น Available หรือไม่`, onConfirm: () => { unallocate(detailOrder); notify("Un-Allocate สำเร็จ", `${detailOrder.id} คืนสต็อกแล้ว`, "success"); } })}><Unlock size={12} /> Un-Allocate</button><button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Release Order", message: `ปล่อยคำสั่ง ${detailOrder.id} ไป Pick/Robot หรือไม่`, onConfirm: () => { release(detailOrder); notify("Release สำเร็จ", `${detailOrder.id} ถูกส่งเข้า Pick/Robot แล้ว`, "success"); } })}><Send size={12} /> Release Pick / Pack / Ship</button></>}
                  {detailOrder.status === "Partial" && <><button className="btn" onClick={() => confirmAction({ title: "ยืนยัน Release Partial", message: `ส่งสินค้าที่ Allocate ได้ของ ${detailOrder.id} ไปก่อนหรือไม่`, onConfirm: () => releasePartial(detailOrder) })}><Send size={12} /> Release Partial</button><button className="btn secondary" onClick={() => confirmAction({ title: "Cancel Order", message: `ยกเลิก ${detailOrder.id} ทั้ง Order หรือไม่`, kind: "danger", onConfirm: () => cancelOrder(detailOrder) })}><Trash2 size={12} /> Cancel Order</button></>}
                  {["Partial Released", "Backorder"].includes(detailOrder.status) && <><button className="btn" onClick={() => confirmAction({ title: "Re-Allocate Shortage", message: `ลอง Allocate ส่วนที่ค้างของ ${detailOrder.id} อีกครั้งหรือไม่`, onConfirm: () => reallocateShortage(detailOrder) })}><RefreshCw size={12} /> Re-Allocate Shortage</button><button className="btn secondary" onClick={() => confirmAction({ title: "Cancel Shortage", message: `ตัดรายการที่ยังขาดของ ${detailOrder.id} ออกจาก Order หรือไม่`, onConfirm: () => cancelShortage(detailOrder) })}><Trash2 size={12} /> Cancel Shortage</button></>}
                </div>
                <div className="section-title" style={{ marginTop: 0 }}>Onhand by Location / เลือกแหล่งจ่าย</div>
                <div className="kpi-sub" style={{ marginBottom: 10 }}>แสดง Stock ทุก Location ของสินค้าใน Order นี้ โดย Onhand Qty คือจำนวนที่เหลือให้จ่ายได้หลังหักยอดที่ Allocate ให้ Order นี้แล้ว</div>
                <div className="table-wrap" style={{ marginBottom: 14 }}>
                  <table>
                    <thead><tr><th>เลือก</th><th>Allocate Qty</th><th>SYNNEX ID</th><th>Item Name</th><th>Plant</th><th>Floor</th><th>Location</th><th>LPN</th><th>Onhand Qty</th><th>Order Qty</th><th>Allocated This Order</th><th>Remaining</th><th>System</th><th>Pallet/Basket</th><th>Utilize</th><th>Sticker</th></tr></thead>
                    <tbody>
                      {onhandRows.map((r) => {
                        const canPick = r.status === "AVL" && r.canAllocate;
                        const pickKey = sourcePickKey(detailOrder.id, r.itemId, r);
                        return (
                          <tr key={pickKey}>
                            <td style={{ textAlign: "center", minWidth: 54 }}>
                              {canPick ? <input type="checkbox" checked={!!sourceChecked[pickKey]} onChange={(e) => toggleSource(detailOrder, r, e.target.checked)} /> : r.status === "ALLOC" ? <span className="scan-step done">จองแล้ว</span> : <span className="scan-step" style={{ color: "var(--danger)", background: "rgba(241,91,113,.10)" }}>{r.blockReason || "Block"}</span>}
                            </td>
                            <td style={{ minWidth: 92 }}>{canPick ? <input type="number" min="0" max={r.qty} value={sourcePick[pickKey] || ""} placeholder="0" disabled={!sourceChecked[pickKey]} onChange={(e) => setSourceQty(detailOrder.id, r.itemId, r, e.target.value)} style={{ width: 72 }} /> : "-"}</td>
                            <td className="mono">{r.itemId}</td><td>{itemOf(r.itemId)?.name || "-"}</td><td>{r.plant}</td><td>{r.floor}</td><td className="mono">{r.loc}</td><td className="mono">{r.lpn || "-"}</td><td>{r.onhandQty}</td><td>{orderQtyByItem[r.itemId] || 0}</td><td>{r.allocatedQty}</td><td>{r.remainingQty}</td><td><span className={`sys-tag ${r.system}`}>{r.system}</span></td><td>{r.palletState}</td><td>{utilizationBar(r.utilPct)}</td><td>{stickerStatusBadge(r)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="section-title" style={{ marginTop: 0 }}>Allocated Source / แหล่งจ่ายที่ถูกจองแล้ว</div>
                <div className="table-wrap" style={{ marginBottom: 14 }}>
                  <table>
                    <thead><tr><th>SYNNEX ID</th><th>Item Name</th><th>Order Qty</th><th>Location</th><th>LPN</th><th>Onhand Before</th><th>Location Util.</th><th>Source System</th><th>Allocated Qty</th><th>Picked</th><th>Worker / Robot</th></tr></thead>
                    <tbody>
                      {lines.flatMap((l) => (l.sources?.length ? l.sources : [{ loc: "-", qty: 0, system: "-", lpn: "-", pickedQty: 0, shortQty: l.shortfall || l.qty || 0 }]).map((s, idx) => (
                        <tr key={`${l.itemId}-${s.loc}-${idx}`}><td className="mono">{l.itemId}</td><td>{itemOf(l.itemId)?.name || "-"}</td><td>{l.qty}</td><td className="mono">{s.loc}</td><td className="mono">{s.lpn || stock.find((r) => r.itemId === l.itemId && r.loc === s.loc)?.lpn || "-"}</td><td>{s.onhandBefore ?? "-"}</td><td>{utilizationBar(s.utilPct || locUtil(s.loc).pct)}</td><td>{s.system}</td><td>{s.qty}</td><td>{s.pickedQty || 0}</td><td>{s.system === "ASRS" || s.system === "Miniload" ? s.system : (pickTasks.find((t) => t.order === detailOrder.id && t.itemId === l.itemId)?.assignee || "Manual Picker")}</td></tr>
                      )))}
                    </tbody>
                  </table>
                </div>
                <div className="section-title" style={{ marginTop: 0 }}>LPN Dissolve / Split to Tote</div>
                <div className="kpi-sub" style={{ marginBottom: 10 }}>รองรับการละลาย 1 LPN = 1 Pallet ไปเป็นหลาย Tote เช่น 10 กล่อง = 10 Tote No. จากนั้นตอนหยิบจาก Tote ให้สแกนตัวสินค้าเพื่อ Pick ได้เลย และยังเห็นได้ว่า LPN เดิมถูกหยิบไปหลาย Order หลายครั้ง</div>
                <div className="table-wrap">
                  <table><thead><tr><th>Original LPN</th><th>Tote No.</th><th>Box</th><th>SYNNEX ID</th><th>Linked Order</th><th>Pick Scan Mode</th></tr></thead><tbody>{toteRows.map((t) => <tr key={t.tote}><td className="mono">{t.fromLpn}</td><td className="mono">{t.tote}</td><td className="mono">{t.box}</td><td className="mono">{t.itemId}</td><td className="mono">{t.order}</td><td>Scan Item only from Tote</td></tr>)}</tbody></table>
                </div>
              </>
            );
          })()}
        </Modal>
      )}

      {manualOpen && (
        <Modal onClose={() => setManualOpen(false)} width={520}>
          <h2>สร้าง Order Manual</h2>
          <div className="grid g2">
            <div className="field"><label>ลูกค้า / อ้างอิง</label><input value={manualForm.customer} onChange={(e) => setManualForm({ ...manualForm, customer: e.target.value })} /></div>
            <div className="field"><label>Priority</label><select value={manualForm.priority} onChange={(e) => setManualForm({ ...manualForm, priority: e.target.value })}><option>Normal</option><option>VIP</option><option>SLA Risk</option></select></div>
            <div className="field"><label>ช่องทางการขาย</label><select value={manualForm.channel} onChange={(e) => setManualForm({ ...manualForm, channel: e.target.value })}><option>B2B</option><option>Lazada</option><option>Shopee</option><option>TikTok Shop</option><option>Manual</option></select></div>
            <div className="field"><label>สายการจัดส่ง</label><input value={manualForm.route} onChange={(e) => setManualForm({ ...manualForm, route: e.target.value })} placeholder="BKK-01" /></div>
            <div className="field"><label>ภูมิภาค</label><select value={manualForm.region} onChange={(e) => setManualForm({ ...manualForm, region: e.target.value })}><option>Bangkok</option><option>Central</option><option>North</option><option>East</option><option>South</option><option>North-East</option></select></div>
            <div className="field"><label>เวลาทีมขายส่ง Order</label><input value={manualForm.salesSentAt} onChange={(e) => setManualForm({ ...manualForm, salesSentAt: e.target.value })} placeholder="2569-07-10 11:00" /></div>
            <div className="field"><label>ลำดับการส่งออก</label><input type="number" value={manualForm.shipSeq} onChange={(e) => setManualForm({ ...manualForm, shipSeq: e.target.value })} /></div>
          </div>
          <div className="kpi-sub" style={{ margin: "4px 0 8px" }}>รายการสินค้า</div>
          {manualForm.lines.map((l, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
              <div className="field" style={{ flex: 2, marginBottom: 0 }}>
                <select value={l.itemId} onChange={(e) => updateManualLine(idx, "itemId", e.target.value)}>{ITEMS.map((i) => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}</select>
              </div>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}><input type="number" min={1} value={l.qty} onChange={(e) => updateManualLine(idx, "qty", e.target.value)} /></div>
              <button className="btn secondary" onClick={() => removeManualLine(idx)} disabled={manualForm.lines.length === 1}><Trash2 size={12} /></button>
            </div>
          ))}
          <button className="btn secondary" style={{ marginBottom: 16 }} onClick={addManualLine}><PlusCircle size={12} /> เพิ่มสินค้า</button>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={submitManual}>สร้าง Order</button>
        </Modal>
      )}
    </>
  );
}

/* ================================================================== */
/* PICKING STRATEGIES                                                   */
/* ================================================================== */

const SCAN_MODE_OPTIONS = [
  { id: "loose", label: "Loose item / No LPN", help: "Scan Location + SYNNEX ID, then enter qty or scan SN/IMEI one by one." },
  { id: "bulk", label: "Full box / Rapid SN-IMEI", help: "Scan SYNNEX ID once, then scan SN/IMEI continuously. System counts scanned units." },
  { id: "oneToOne", label: "1:1 SYNNEX+SN+IMEI", help: "Each unit must be scanned as SYNNEX ID + SN + IMEI pair." },
];
const serialLinesFrom = (text = "") => String(text).split(/\n|,|;|\s+/).map((v) => v.trim()).filter(Boolean);
const pairLinesFrom = (text = "") => String(text).split(/\n+/).map((line) => {
  const [itemId = "", sn = "", imei = ""] = line.split(/[,|\t]/).map((v) => v.trim());
  return { itemId, sn, imei };
}).filter((r) => r.itemId || r.sn || r.imei);
const serialBelongsToItem = (serialUnits = [], code = "", itemId = "") => {
  const needle = String(code || "").trim().toLowerCase();
  if (!needle) return true;
  const found = serialUnits.find((u) => [u.sn, u.imei, u.unitId, u.boxBarcode].some((v) => String(v || "").trim().toLowerCase() === needle));
  return !found || found.itemId === itemId;
};
const scannedQtyOf = (scan, fallbackQty = 0) => {
  if (scan.mode === "oneToOne") return pairLinesFrom(scan.pairs).length || (scan.item && (scan.sn || scan.imei) ? 1 : 0);
  const serialCount = serialLinesFrom(scan.serials).length + [scan.sn, scan.imei].filter(Boolean).length;
  return serialCount || Number(scan.qty || fallbackQty || 0);
};
const resetScanState = (mode = "loose") => ({ mode, loc: "", item: "", lpn: "", qty: "", sn: "", imei: "", serials: "", pairs: "", video: false, label: false });

function PickOps({ pickTasks = [], setPickTasks = () => {}, applyPick = () => {}, stock = [], serialUnits = [], addTx = () => {}, notify = () => {}, userSession }) {
  const visibleTasks = pickTasks.filter((t) => t.released && !["Completed", "Cancelled"].includes(t.status));
  const completedToday = pickTasks.filter((t) => t.released && t.status === "Completed").length;
  const [activeId, setActiveId] = useState(visibleTasks[0]?.id || "");
  const active = visibleTasks.find((t) => t.id === activeId) || visibleTasks[0];
  const source = active ? stock.find((s) => s.itemId === active.itemId && s.loc === active.loc && ["ALLOC", "AVL"].includes(s.status)) : null;
  const unit = active ? serialUnits.find((u) => u.itemId === active.itemId && (!u.orderId || u.orderId === active.order)) : null;
  const [scan, setScan] = useState(resetScanState("loose"));
  useEffect(() => {
    if (!visibleTasks.length) setActiveId("");
    else if (!visibleTasks.some((t) => t.id === activeId)) setActiveId(visibleTasks[0].id);
  }, [visibleTasks.length, activeId]);
  const setMode = (mode) => setScan(resetScanState(mode));
  const fillDemo = () => setScan((x) => ({ ...x, loc: active?.loc || "", item: active?.itemId || "", lpn: source?.lpn || "", qty: active?.qty || "", sn: unit?.sn || "", imei: unit?.imei || "", serials: unit ? `${unit.sn || ""}\n${unit.imei || ""}` : "", pairs: unit ? `${active?.itemId || ""},${unit.sn || ""},${unit.imei || ""}` : "" }));
  const validateSerialOwnership = () => {
    const codes = [...serialLinesFrom(scan.serials), scan.sn, scan.imei].filter(Boolean);
    const pairs = pairLinesFrom(scan.pairs);
    if (pairs.some((r) => r.itemId && r.itemId !== active.itemId)) return "1:1 scan has wrong SYNNEX ID for this order.";
    if ([...codes, ...pairs.flatMap((r) => [r.sn, r.imei]).filter(Boolean)].some((c) => !serialBelongsToItem(serialUnits, c, active.itemId))) return "Scanned SN/IMEI does not belong to this SYNNEX ID.";
    return "";
  };
  const validatePick = () => {
    if (!active) return;
    if ((scan.loc || "").trim().toUpperCase() !== active.loc.toUpperCase()) return notify("Wrong Location", `Must scan location ${active.loc}`, "danger");
    if ((scan.item || "").trim() !== active.itemId) return notify("Wrong Item", "Scanned code must be the order SYNNEX ID.", "danger");
    if (scan.mode !== "loose" && source?.lpn && scan.lpn && scan.lpn !== source.lpn) return notify("Wrong LPN", `Correct LPN is ${source.lpn}`, "danger");
    const serialError = validateSerialOwnership();
    if (serialError) return notify("Wrong SN/IMEI", serialError, "danger");
    const qty = scannedQtyOf(scan, scan.mode === "loose" ? scan.qty : 0);
    if (!qty || qty <= 0) return notify("Qty required", "Enter qty or scan at least one SN/IMEI.", "danger");
    if (qty < Number(active.qty || 0)) return notify("Qty incomplete", `Required ${active.qty}, scanned ${qty}.`, "danger");
    if (qty > Number(active.qty || 0)) return notify("Qty over order", `Required ${active.qty}, scanned ${qty}.`, "danger");
    applyPick({ orderId: active.order, itemId: active.itemId, loc: active.loc, qty });
    setPickTasks((list) => list.map((t) => t.id === active.id ? { ...t, status: "Completed", pickedQty: qty, pickedBy: userSession?.user || "system", pickedAt: new Date().toISOString(), scanMode: scan.mode } : t));
    addTx({ type: "Pick Scan", detail: `${active.id}: ${SCAN_MODE_OPTIONS.find((m) => m.id === scan.mode)?.label} - Location + SYNNEX ID + ${qty} pcs validated`, itemId: active.itemId, lpn: scan.mode === "loose" ? "-" : source?.lpn, fromLoc: active.loc, toLoc: "PICK-PACK", qty, user: userSession?.user || "system" });
    notify("Pick completed", `${active.id} picked ${qty} pcs. Task is hidden from Handheld to prevent duplicate pick.`, "success");
    setScan(resetScanState(scan.mode));
  };
  const modeHelp = SCAN_MODE_OPTIONS.find((m) => m.id === scan.mode)?.help || "";
  return (
    <>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={Smartphone} label="Pick Tasks" value={visibleTasks.length} sub="Released and not completed" variant="plan" />
        <LpCard icon={CheckCircle2} label="Completed" value={completedToday} sub="Hidden from Handheld" variant="good" />
        <LpCard icon={AlertTriangle} label="Pending" value={visibleTasks.length} sub="Waiting pick" variant="plan" />
        <LpCard icon={MapPinned} label="Pick-Pack Zone" value="PICK-PACK" sub="Destination after pick" variant="info" />
      </div>
      {visibleTasks.length === 0 && <div className="card" style={{ marginBottom: 14 }}><div className="kpi-sub" style={{ textAlign: "center", padding: "18px" }}>No active Picking task. Completed tasks are hidden to prevent duplicate pick.</div></div>}
      <div className="handheld-shell">
        <div className="handheld-phone">
          <div className="handheld-top"><Smartphone size={16} /> Picking Handheld</div>
          <div className="field"><label>Pick Task</label><select value={active?.id || ""} onChange={(e) => setActiveId(e.target.value)}>{visibleTasks.map((t) => <option key={t.id} value={t.id}>{t.id} ? {t.order} ? {t.itemId}</option>)}</select></div>
          {active && <div className="handheld-job-card"><b>{active.order}</b><span>{itemOf(active.itemId)?.name}</span><em>{active.loc} ? {active.itemId} ? Qty {active.qty}</em></div>}
          <div className="field"><label>Scan Mode</label><select value={scan.mode} onChange={(e) => setMode(e.target.value)}>{SCAN_MODE_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select><div className="kpi-sub">{modeHelp}</div></div>
          {active && <div className="scan-steps-row"><span className="scan-step active">1 Scan Location</span><span className="scan-step active">2 Scan SYNNEX ID</span><span className="scan-step active">3 {scan.mode === "loose" ? "Qty / SN-IMEI" : scan.mode === "bulk" ? "Rapid SN/IMEI" : "SYNNEX+SN+IMEI"}</span></div>}
          <div className="field"><label>Scan Location</label><input className="text-input" value={scan.loc} onChange={(e) => setScan({ ...scan, loc: e.target.value })} /></div>
          <div className="field"><label>Scan SYNNEX ID</label><input className="text-input" value={scan.item} onChange={(e) => setScan({ ...scan, item: e.target.value })} /></div>
          {scan.mode !== "loose" && <div className="field"><label>Scan LPN / Box (optional)</label><input className="text-input" value={scan.lpn} onChange={(e) => setScan({ ...scan, lpn: e.target.value })} /></div>}
          {scan.mode === "loose" && <div className="field"><label>Loose Qty / No LPN</label><input type="number" min="1" className="text-input" value={scan.qty} onChange={(e) => setScan({ ...scan, qty: e.target.value })} /></div>}
          {scan.mode !== "oneToOne" && <div className="field"><label>Rapid SN / IMEI scan</label><textarea rows={4} value={scan.serials} onChange={(e) => setScan({ ...scan, serials: e.target.value })} placeholder="Scan SN/IMEI continuously, separated by line or space" /></div>}
          {scan.mode === "oneToOne" && <div className="field"><label>1:1 scan: SYNNEX ID,SN,IMEI</label><textarea rows={5} value={scan.pairs} onChange={(e) => setScan({ ...scan, pairs: e.target.value })} placeholder="6425011001,SN-NB-ASUS-0001,IMEI-356789100000001" /></div>}
          <div className="grid g2"><div className="field"><label>Single SN</label><input className="text-input" value={scan.sn} onChange={(e) => setScan({ ...scan, sn: e.target.value })} /></div><div className="field"><label>Single IMEI</label><input className="text-input" value={scan.imei} onChange={(e) => setScan({ ...scan, imei: e.target.value })} /></div></div>
          <div className="allocation-progress-strip" style={{ margin: "8px 0" }}><div><span>Required</span><b>{active?.qty || 0}</b></div><div><span>Scanned</span><b>{scannedQtyOf(scan)}</b></div></div>
          <button className="btn secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={fillDemo}><ScanLine size={13} /> Fill demo scan</button>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={validatePick}><ScanLine size={13} /> Confirm Pick Scan</button>
        </div>
        <div className="table-wrap" style={{ flex: 1 }}>
          <table><thead><tr><th>Task</th><th>Order</th><th>SYNNEX ID</th><th>Item Name</th><th>Location</th><th>LPN</th><th>Qty</th><th>Status</th></tr></thead><tbody>
            {visibleTasks.length === 0 && <tr><td colSpan={8} className="kpi-sub">No active Pick Task.</td></tr>}
            {visibleTasks.map((t) => { const s = stock.find((r) => r.itemId === t.itemId && r.loc === t.loc); return <tr key={t.id}><td className="mono">{t.id}</td><td>{t.order}</td><td className="mono">{t.itemId}</td><td>{itemOf(t.itemId)?.name || "-"}</td><td className="mono">{t.loc}</td><td className="mono">{t.lpn || s?.lpn || "-"}</td><td>{t.qty}</td><td><OrderStatusPill status={t.status} /></td></tr>; })}
          </tbody></table>
        </div>
      </div>
    </>
  );
}

function ConsoleOrder({ allocOrders = [], stock = [] }) {
  const rows = allocOrders.filter((o) => ["Allocated", "Partial Allocated", "Picked", "Packing"].includes(o.status)).slice(0, 16);
  return (
    <>
      <div className="section-title">Console Order - รวมสินค้าจากหลายชั้นไป Pack Zone ชั้น 1</div>
      <div className="console-hero">
        <div><h3>Consolidate to Floor 1 Pack Zone</h3><p>ติดตามว่าสินค้าแต่ละ order ถูก allocate จาก location ไหน อยู่ชั้นไหน ใครหยิบก่อน และตอนนี้เข้าจุด Pick-Pack แล้วหรือยัง</p></div>
        <div className="console-pack-target"><span>Console Target</span><b>ชั้น 1 · PICK-PACK</b><small>future: Conveyor command to Pack Zone</small></div>
      </div>
      <div className="grid g3" style={{ marginBottom: 14 }}>
        <LpCard icon={ArrowLeftRight} label="Console Orders" value={rows.length} sub="รอรวมสินค้า" variant="plan" />
        <LpCard icon={MapPinned} label="Pack Zone" value="Floor 1" sub="จุดรวมปลายทาง" variant="info" />
        <LpCard icon={Bot} label="Future Conveyor" value="Ready" sub="รองรับคำสั่ง Conveyor" variant="good" />
      </div>
      {rows.map((o) => {
        const lines = (o.lines?.length ? o.lines : (o.items || []).map((it) => ({ ...it, sources: stock.filter((s) => s.itemId === it.itemId).slice(0, 2).map((s) => ({ loc: s.loc, qty: Math.min(s.qty, it.qty), pickedQty: 0, system: locOf(s.loc)?.system || "Manual", lpn: s.lpn })) })));
        const floors = [...new Set(lines.flatMap((l) => (l.sources || []).map((s) => floorOf(locOf(s.loc)?.floor)?.name || locOf(s.loc)?.floor || "-")))];
        return (
          <div className="card console-order-card" key={o.id}>
            <div className="console-order-head"><div><b className="mono">{o.id}</b> · {o.customer || "-"} <span className={`prio ${o.priority === "VIP" ? "vip" : o.priority === "SLA Risk" ? "sla" : "normal"}`}>{o.priority || "Normal"}</span><div className="kpi-sub">{o.route || "-"} · Status {o.status}</div></div><StatusBadge code={o.status === "Picked" ? "PICKED" : "ALLOC"} /></div>
            <div className="console-flow">{floors.map((f) => <span className="console-floor-node" key={f}>{f}</span>)}<MoveRight size={16} color="var(--muted)" /><span className="console-floor-node target">ชั้น 1 · PICK-PACK</span></div>
            <div className="table-wrap"><table><thead><tr><th>SYNNEX ID</th><th>Item Name</th><th>LPN</th><th>From Location</th><th>From Floor</th><th>System</th><th>Qty</th><th>Picked</th><th>Current Zone</th><th>Picked By</th></tr></thead><tbody>
              {lines.flatMap((l) => (l.sources || []).map((s, idx) => ({ l, s, idx }))).map(({ l, s, idx }) => <tr key={`${o.id}-${l.itemId}-${s.loc}-${idx}`}><td className="mono">{l.itemId}</td><td>{itemOf(l.itemId)?.name || "-"}</td><td className="mono">{s.lpn || stock.find((r) => r.itemId === l.itemId && r.loc === s.loc)?.lpn || "-"}</td><td className="mono">{s.loc}</td><td>{floorOf(locOf(s.loc)?.floor)?.name || "-"}</td><td>{s.system || locOf(s.loc)?.system || "Manual"}</td><td>{s.qty}</td><td>{s.pickedQty || 0}</td><td>{(s.pickedQty || 0) >= s.qty ? "PICK-PACK" : s.loc}</td><td>{s.pickedBy || o.pickedBy || "-"}</td></tr>)}
            </tbody></table></div>
          </div>
        );
      })}
      <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Priority</th><th>Route</th><th>Source Floors</th><th>Console Target</th><th>Status</th></tr></thead><tbody>
        {rows.map((o) => {
          const itemIds = (o.lines || o.items || []).map((l) => l.itemId);
          const floors = [...new Set(stock.filter((s) => itemIds.includes(s.itemId)).map((s) => floorOf(locOf(s.loc)?.floor)?.name || locOf(s.loc)?.floor || "-"))];
          return <tr key={o.id}><td className="mono">{o.id}</td><td>{o.customer || "-"}</td><td>{o.priority || "Normal"}</td><td>{o.route || "-"}</td><td>{floors.join(", ") || "ชั้น 2, ชั้น 3"}</td><td>ชั้น 1 · Pack Zone</td><td><OrderStatusPill status={o.status} /></td></tr>;
        })}
      </tbody></table></div>
    </>
  );
}

function Packing({ allocOrders = [], setAllocOrders = () => {}, stock = [], pickTasks = [], setPickTasks = () => {}, serialUnits = [], addTx = () => {}, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.(), userSession }) {
  const rows = allocOrders.filter((o) => ["Picked", "Packing"].includes(o.status)).slice(0, 16);
  const packedCount = allocOrders.filter((o) => o.status === "Packed").length;
  const [activeId, setActiveId] = useState(rows[0]?.id || "");
  const active = rows.find((o) => o.id === activeId) || rows[0];
  useEffect(() => {
    if (!rows.length) setActiveId("");
    else if (!rows.some((o) => o.id === activeId)) setActiveId(rows[0].id);
  }, [rows.length, activeId]);
  const activeItems = active ? orderLinesOf(active) : [];
  const activeItemId = activeItems[0]?.itemId || stock.find((s) => s.allocatedFor === active?.id)?.itemId || "";
  const activeQty = activeItems.reduce((a, l) => a + Number(l.qty || 0), 0) || stock.filter((s) => s.allocatedFor === active?.id && s.status === "PICKED").reduce((a, s) => a + Number(s.qty || 0), 0) || 1;
  const boxLpn = active ? stock.find((s) => s.allocatedFor === active.id || s.status === "PICKED")?.lpn || `BOX-${active.id}` : "";
  const [scan, setScan] = useState(resetScanState("bulk"));
  const [invoiceQ, setInvoiceQ] = useState("");
  const invoiceRows = allocOrders.map((o) => ({
    invoice: `INV-${o.id.replace(/\D/g, "").slice(-5)}`,
    order: o,
    stockRows: stock.filter((s) => s.allocatedFor === o.id || (o.lines || o.items || []).some?.((l) => l.itemId === s.itemId)),
  })).filter((r) => !invoiceQ || `${r.invoice} ${r.order.id} ${r.order.customer}`.toLowerCase().includes(invoiceQ.toLowerCase()));
  const setMode = (mode) => setScan(resetScanState(mode));
  const fillPackDemo = () => {
    const unit = serialUnits.find((u) => u.itemId === activeItemId && (!u.orderId || u.orderId === active?.id || u.sampleOrder === active?.id));
    setScan((x) => ({ ...x, item: activeItemId, lpn: boxLpn, qty: activeQty, sn: unit?.sn || "", imei: unit?.imei || "", serials: unit ? `${unit.sn || ""}\n${unit.imei || ""}` : "", pairs: unit ? `${activeItemId},${unit.sn || ""},${unit.imei || ""}` : "" }));
  };
  const validatePackScan = () => {
    if (!active) return "";
    if (!scan.item) return "Scan SYNNEX ID before packing.";
    const validItem = activeItems.length ? activeItems.some((l) => l.itemId === scan.item) : scan.item === activeItemId;
    if (!validItem) return "Scanned SYNNEX ID is not in this order.";
    if (scan.mode !== "loose" && !scan.lpn) return "Scan box barcode or LPN before closing carton.";
    const pairs = pairLinesFrom(scan.pairs);
    if (pairs.some((r) => r.itemId && !activeItems.some((l) => l.itemId === r.itemId) && r.itemId !== activeItemId)) return "1:1 scan contains SYNNEX ID outside this order.";
    const codes = [...serialLinesFrom(scan.serials), scan.sn, scan.imei, ...pairs.flatMap((r) => [r.sn, r.imei])].filter(Boolean);
    if (codes.some((c) => !serialBelongsToItem(serialUnits, c, scan.item))) return "Scanned SN/IMEI does not belong to this SYNNEX ID.";
    const qty = scannedQtyOf(scan, scan.mode === "loose" ? scan.qty : 0);
    if (!qty || qty <= 0) return "Enter qty or scan at least one SN/IMEI.";
    if (qty < activeQty) return `Qty incomplete. Required ${activeQty}, scanned ${qty}.`;
    if (qty > activeQty) return `Qty over order. Required ${activeQty}, scanned ${qty}.`;
    return "";
  };
  const confirmPack = () => {
    if (!active) return;
    const err = validatePackScan();
    if (err) return notify("Pack scan failed", err, "danger");
    if (!scan.video) return notify("VDO required", "Confirm VDO recording before Packed.", "danger");
    if (!scan.label) return notify("Label required", "Print shipping label before closing order.", "danger");
    const qty = scannedQtyOf(scan, scan.qty);
    setAllocOrders((list) => list.map((o) => o.id === active.id ? { ...o, status: "Packed", packedAt: new Date().toISOString(), packedBy: userSession?.user || "system", packScanMode: scan.mode, packScanQty: qty } : o));
    addTx({ type: "Pack", detail: `${active.id}: ${SCAN_MODE_OPTIONS.find((m) => m.id === scan.mode)?.label} - Packed ${qty} pcs - LPN/Box ${scan.lpn || "-"} - VDO completed`, orderId: active.id, itemId: scan.item, lpn: scan.lpn || "-", loc: "PACK", qty, user: userSession?.user || "system" });
    notify("Pack completed", `${active.id} is Packed and hidden from Pack queue.`, "success");
    setScan(resetScanState(scan.mode));
  };
  const cancelPack = () => {
    if (!active) return;
    const assignees = pickTasks.filter((t) => t.order === active.id).map((t) => t.assignee).filter(Boolean);
    setAllocOrders((list) => list.map((o) => o.id === active.id ? { ...o, status: "Cancelled by Sales API", cancelledAt: new Date().toISOString(), cancelSource: "Sales API", cancelReason: "Sales cancelled before Ship" } : o));
    setPickTasks((list) => list.map((t) => t.order === active.id ? { ...t, status: "Cancelled", alert: "Sales API cancelled order. Stop Pick/Pack immediately." } : t));
    addTx({ type: "Cancel Pack", detail: `${active.id}: Sales API cancelled during Pick/Pack. Alerted ${assignees.join(", ") || "Packer"}.`, orderId: active.id, loc: "PACK", user: userSession?.user || "sales-api" });
    notify("Cancel Order alerted", `${active.id} cancelled and Pick/Pack team alerted.`, "danger");
  };
  return (
    <>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={Package} label="Waiting Pack" value={rows.length} sub="Not Packed" variant="plan" />
        <LpCard icon={PackageCheck} label="Packed" value={packedCount} sub="Hidden from Pack queue" variant="good" />
        <LpCard icon={Video} label="VDO Proof" value="Required" sub="Camera recording" variant="info" />
        <LpCard icon={Printer} label="Label" value="Print" sub="Shipping document" variant="plan" />
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Invoice / Order Location Search</h3>
        <div className="search-box" style={{ maxWidth: 520 }}><Search size={15} color="var(--muted)" /><input value={invoiceQ} onChange={(e) => setInvoiceQ(e.target.value)} placeholder="Search invoice, SO, customer" /></div>
        <div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Order</th><th>Customer</th><th>Current Status</th><th>Location / Zone</th><th>LPN</th><th>Item</th></tr></thead><tbody>{invoiceRows.slice(0, 6).map((r) => {
          const first = r.stockRows[0];
          const loc = first?.loc || (r.order.status === "Packed" ? "PACKED / LOAD-STAGING" : r.order.status === "Picked" ? "PICK-PACK" : "-");
          return <tr key={r.invoice}><td className="mono">{r.invoice}</td><td className="mono">{r.order.id}</td><td>{r.order.customer || "-"}</td><td><OrderStatusPill status={r.order.status} /></td><td className="mono">{loc}</td><td className="mono">{first?.lpn || "-"}</td><td>{first ? itemOf(first.itemId)?.name : (r.order.items || r.order.lines || [])[0]?.itemId || "-"}</td></tr>;
        })}</tbody></table></div>
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>Pack Station Scan</h3>
          <div className="field"><label>Order</label><select value={active?.id || ""} onChange={(e) => setActiveId(e.target.value)}>{rows.map((o) => <option key={o.id} value={o.id}>{o.id} ? {o.customer || "-"}</option>)}</select></div>
          {!active && <div className="kpi-sub" style={{ marginBottom: 12 }}>No active Pack task. Packed orders are hidden to prevent duplicate pack.</div>}
          <div className="field"><label>Scan Mode</label><select value={scan.mode} onChange={(e) => setMode(e.target.value)}>{SCAN_MODE_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select><div className="kpi-sub">{SCAN_MODE_OPTIONS.find((m) => m.id === scan.mode)?.help}</div></div>
          <div className="field"><label>Scan SYNNEX ID</label><input value={scan.item} onChange={(e) => setScan({ ...scan, item: e.target.value })} placeholder={activeItemId} /></div>
          {scan.mode !== "loose" && <div className="field"><label>Scan Box Barcode / LPN</label><input value={scan.lpn} onChange={(e) => setScan({ ...scan, lpn: e.target.value })} placeholder={boxLpn} /></div>}
          {scan.mode === "loose" && <div className="field"><label>Loose Qty / No LPN</label><input type="number" min="1" value={scan.qty} onChange={(e) => setScan({ ...scan, qty: e.target.value })} /></div>}
          {scan.mode !== "oneToOne" && <div className="field"><label>Rapid SN / IMEI scan</label><textarea rows={4} value={scan.serials} onChange={(e) => setScan({ ...scan, serials: e.target.value })} placeholder="Scan SN/IMEI continuously. System counts qty." /></div>}
          {scan.mode === "oneToOne" && <div className="field"><label>1:1 scan: SYNNEX ID,SN,IMEI</label><textarea rows={5} value={scan.pairs} onChange={(e) => setScan({ ...scan, pairs: e.target.value })} placeholder="6425011001,SN-NB-ASUS-0001,IMEI-356789100000001" /></div>}
          <div className="grid g2">
            <div className="field"><label>Single SN</label><input value={scan.sn} onChange={(e) => setScan({ ...scan, sn: e.target.value })} /></div>
            <div className="field"><label>Single IMEI</label><input value={scan.imei} onChange={(e) => setScan({ ...scan, imei: e.target.value })} /></div>
          </div>
          <div className="allocation-progress-strip" style={{ margin: "8px 0" }}><div><span>Required</span><b>{activeQty}</b></div><div><span>Scanned</span><b>{scannedQtyOf(scan)}</b></div></div>
          <label className="checkline"><input type="checkbox" checked={scan.video} onChange={(e) => setScan({ ...scan, video: e.target.checked })} /> VDO recording completed</label>
          <label className="checkline"><input type="checkbox" checked={scan.label} onChange={(e) => setScan({ ...scan, label: e.target.checked })} /> Shipping label printed</label>
          <button className="btn secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={fillPackDemo}><ScanLine size={13} /> Fill demo scan</button>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} disabled={!active} onClick={() => confirmAction({ title: "Confirm Pack", message: `Confirm Pack ${active?.id || ""}?`, onConfirm: confirmPack })}><PackageCheck size={13} /> Confirm Packed</button>
          <button className="btn secondary" style={{ width: "100%", justifyContent: "center", marginTop: 8, color: "var(--danger)" }} disabled={!active} onClick={() => confirmAction({ title: "Sales API Cancel Order", message: `Simulate Sales API cancellation for ${active?.id || ""}?`, kind: "danger", onConfirm: cancelPack })}><ShieldAlert size={13} /> Cancel Pack / Order</button>
        </div>
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>LPN / Box</th><th>Scan Required</th><th>Status</th><th>Packed By</th></tr></thead><tbody>{rows.length === 0 && <tr><td colSpan={6} className="kpi-sub">No active Pack task.</td></tr>}{rows.map((o) => <tr key={o.id}><td className="mono">{o.id}</td><td>{o.customer || "-"}</td><td className="mono">{stock.find((s) => s.allocatedFor === o.id)?.lpn || `BOX-${o.id}`}</td><td>SYNNEX / Qty / SN / IMEI / VDO</td><td><OrderStatusPill status={o.status} /></td><td>{o.packedBy || "-"}</td></tr>)}</tbody></table></div>
      </div>
    </>
  );
}

function Shipping({ allocOrders = [], setAllocOrders = () => {}, stock = [], setStock = () => {}, addTx = () => {}, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.(), userSession }) {
  const rows = allocOrders.filter((o) => ["Packed", "Shipping", "Shipped"].includes(o.status)).slice(0, 24);
  const [activeId, setActiveId] = useState(rows.find((o) => o.status !== "Shipped")?.id || rows[0]?.id || "");
  const active = rows.find((o) => o.id === activeId) || rows[0];
  const [scan, setScan] = useState({ awb: "", bill: "", po: "", truck: "TRUCK-BKK-01", seal: "" });
  const activePickedRows = active ? stock.filter((s) => s.allocatedFor === active.id && ["PICKED", "PACKED"].includes(s.status)) : [];
  const shipOrder = () => {
    if (!active) return;
    if (!scan.awb && !scan.bill && !scan.po) return notify("ยังไม่ได้ยิงเอกสาร", "ต้องสแกน AWB หรือ Bill หรือ PO ก่อนขึ้นรถ", "danger");
    setAllocOrders((list) => list.map((o) => o.id === active.id ? { ...o, status: "Shipped", shippedAt: new Date().toISOString(), shippedBy: userSession?.user || "system", awb: scan.awb, bill: scan.bill, shipPo: scan.po, truckNo: scan.truck, sealNo: scan.seal } : o));
    setStock((list) => list.filter((s) => !(s.allocatedFor === active.id && ["PICKED", "PACKED"].includes(s.status))));
    addTx({ type: "Ship", detail: `${active.id}: Ship to truck ${scan.truck} · AWB ${scan.awb || "-"} · Bill ${scan.bill || "-"} · PO ${scan.po || "-"} · ตัด Stock จบ Process Pick > Pack > Ship`, orderId: active.id, loc: "LOAD-STAGING", user: userSession?.user || "system" });
    notify("Ship สำเร็จ", `${active.id} ขึ้นรถและตัด Stock แล้ว`, "success");
    setScan({ awb: "", bill: "", po: "", truck: "TRUCK-BKK-01", seal: "" });
  };
  return (
    <>
      <div className="section-title">Shipping - Ship to Truck</div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={PackageCheck} label="Packed Ready" value={rows.filter((o) => o.status === "Packed").length} sub="รอขึ้นรถ" variant="good" />
        <LpCard icon={Truck} label="Shipping" value={rows.filter((o) => o.status === "Shipping").length} sub="กำลังโหลด" variant="info" />
        <LpCard icon={CheckCircle2} label="Shipped" value={rows.filter((o) => o.status === "Shipped").length} sub="ตัด Stock แล้ว" variant="plan" />
        <LpCard icon={ScanLine} label="Scan Doc" value="AWB/Bill/PO" sub="เอกสารขึ้นรถ" variant="plan" />
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>Scan AWB / Bill / PO ขึ้นรถ</h3>
          <div className="field"><label>เลือก Order</label><select value={active?.id || ""} onChange={(e) => setActiveId(e.target.value)}>{rows.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.customer || "-"} · {o.status}</option>)}</select></div>
          <div className="grid g2">
            <div className="field"><label>AWB</label><input value={scan.awb} onChange={(e) => setScan({ ...scan, awb: e.target.value })} placeholder="AWB-TH-000123" /></div>
            <div className="field"><label>Bill</label><input value={scan.bill} onChange={(e) => setScan({ ...scan, bill: e.target.value })} placeholder="BILL-256907-001" /></div>
            <div className="field"><label>PO / RO Ref</label><input value={scan.po} onChange={(e) => setScan({ ...scan, po: e.target.value })} placeholder="PO / RO" /></div>
            <div className="field"><label>Truck No.</label><input value={scan.truck} onChange={(e) => setScan({ ...scan, truck: e.target.value })} /></div>
            <div className="field"><label>Seal No.</label><input value={scan.seal} onChange={(e) => setScan({ ...scan, seal: e.target.value })} /></div>
          </div>
          <button className="btn secondary" style={{ marginRight: 8 }} onClick={() => setScan({ awb: `AWB-${rand(100000, 999999)}`, bill: `BILL-${rand(1000, 9999)}`, po: `RO-${rand(1000, 9999)}`, truck: "TRUCK-BKK-01", seal: `SEAL-${rand(100, 999)}` })}><ScanLine size={13} /> เติมค่าทดสอบ</button>
          <button className="btn" disabled={!active || active.status === "Shipped"} onClick={() => confirmAction({ title: "Confirm Ship to Truck", message: `ยืนยันยิงเอกสารขึ้นรถและตัด Stock ของ ${active?.id || ""}?`, onConfirm: shipOrder })}><Truck size={13} /> Ship to Truck</button>
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>AWB</th><th>Bill</th><th>Truck</th><th>Picked/Packed LPN</th></tr></thead><tbody>{rows.map((o) => <tr key={o.id}><td className="mono">{o.id}</td><td>{o.customer || "-"}</td><td><OrderStatusPill status={o.status} /></td><td className="mono">{o.awb || "-"}</td><td className="mono">{o.bill || "-"}</td><td>{o.truckNo || "-"}</td><td className="mono">{stock.filter((s) => s.allocatedFor === o.id).map((s) => s.lpn || "-").join(", ") || "-"}</td></tr>)}</tbody></table>
        </div>
      </div>
      {active && <div className="table-wrap" style={{ marginTop: 14 }}><table><thead><tr><th>SYNNEX ID</th><th>Item Name</th><th>LPN</th><th>Location</th><th>Qty</th><th>Status</th></tr></thead><tbody>{activePickedRows.map((s) => <tr key={s.key}><td className="mono">{s.itemId}</td><td>{itemOf(s.itemId)?.name || "-"}</td><td className="mono">{s.lpn || "-"}</td><td className="mono">{s.loc || "PICK-PACK"}</td><td>{s.qty}</td><td><OrderStatusPill status={s.status} /></td></tr>)}</tbody></table></div>}
    </>
  );
}

function InventoryWorkOrders({ stock = [], setStock = () => {}, addTx = () => {}, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.(), userSession }) {
  const [mode, setMode] = useState("Transfer");
  const first = stock[0] || {};
  const [form, setForm] = useState({ itemId: first.itemId || ITEMS[0].id, lpn: first.lpn || "", fromLoc: first.loc || "", toLoc: "CD-01-A", qty: first.qty || 1, reason: "เบิกไปให้ลูกค้ายืม", ref: "" });
  const [orders, setOrders] = useState([]);
  const candidates = stock.filter((s) => (!form.itemId || s.itemId === form.itemId) && (!form.lpn || (s.lpn || "").includes(form.lpn)) && s.status !== "PICKED");
  const selected = candidates.find((s) => (!form.fromLoc || s.loc === form.fromLoc)) || candidates[0];
  const createOrder = () => {
    const row = selected;
    if (!row) return notify("ไม่พบ Stock", "ต้องเลือก SYNNEX ID / LPN / Location ที่มีอยู่ในระบบ", "danger");
    const qty = Math.min(Number(form.qty || 0), Number(row.qty || 0));
    if (qty <= 0) return notify("จำนวนไม่ถูกต้อง", "จำนวนต้องมากกว่า 0", "danger");
    const id = `${mode === "Transfer" ? "TO" : mode === "Reservation" ? "RS" : "CS"}-${rand(10000, 99999)}`;
    if (mode === "Transfer") {
      setStock((list) => list.map((s) => s === row ? { ...s, loc: form.toLoc, status: "AVL", transferRef: id } : s));
      addTx({ type: "Transfer", detail: `${id}: ย้าย ${row.lpn || "-"} · ${row.itemId} จาก ${row.loc} ไป ${form.toLoc} (${locOf(form.toLoc)?.plant || "-"})`, itemId: row.itemId, lpn: row.lpn, fromLoc: row.loc, toLoc: form.toLoc, loc: form.toLoc, user: userSession?.user || "system" });
    } else if (mode === "Reservation") {
      setStock((list) => list.map((s) => s === row ? { ...s, status: "RESV", reservationReason: form.reason, reservationRef: id } : s));
      addTx({ type: "Reservation", detail: `${id}: กันสินค้า ${row.lpn || "-"} · ${row.itemId} ที่ ${row.loc} เพื่อ ${form.reason}`, itemId: row.itemId, lpn: row.lpn, loc: row.loc, user: userSession?.user || "system" });
    } else {
      setStock((list) => list.map((s) => s === row ? { ...s, loc: "X-QC-01", status: "HOLD", checkStockRef: id } : s));
      addTx({ type: "Check Stock", detail: `${id}: เบิก ${row.lpn || "-"} · ${row.itemId} จาก ${row.loc} มา Check Stock ที่ X-QC-01`, itemId: row.itemId, lpn: row.lpn, fromLoc: row.loc, toLoc: "X-QC-01", loc: "X-QC-01", user: userSession?.user || "system" });
    }
    setOrders((list) => [{ id, mode, itemId: row.itemId, itemName: itemOf(row.itemId)?.name, lpn: row.lpn || "-", fromLoc: row.loc, toLoc: mode === "Transfer" ? form.toLoc : mode === "Check Stock" ? "X-QC-01" : row.loc, qty, reason: form.reason, ref: form.ref || "-", by: userSession?.user || "system", t: new Date().toLocaleString("th-TH"), status: "Completed" }, ...list]);
    notify("สร้างคำสั่งสำเร็จ", `${id} ดำเนินการ ${mode} แล้ว`, "success");
  };
  return (
    <>
      <div className="section-title">Inventory Work Order - Transfer / Reservation / Check Stock</div>
      <div className="strategy-toolbar">
        {["Transfer", "Reservation", "Check Stock"].map((m) => <span key={m} className={`chip ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>{m}</span>)}
      </div>
      <div className="grid g2" style={{ marginBottom: 14 }}>
        <div className="card">
          <h3>{mode === "Transfer" ? "สร้าง Order Transfer ข้าม Warehouse" : mode === "Reservation" ? "สร้าง Reservation เบิกยืม / ทดลอง / QC" : "เบิกมา Check Stock"}</h3>
          <div className="grid g2">
            <div className="field"><label>SYNNEX ID</label><select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value, fromLoc: "" })}>{ITEMS.map((i) => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}</select></div>
            <div className="field"><label>LPN (ถ้ามี)</label><input value={form.lpn} onChange={(e) => setForm({ ...form, lpn: e.target.value })} placeholder="ค้นหา LPN หรือเว้นว่าง" /></div>
            <div className="field"><label>From Location</label><select value={form.fromLoc} onChange={(e) => setForm({ ...form, fromLoc: e.target.value })}><option value="">Auto จาก Stock</option>{candidates.map((s) => <option key={s.key} value={s.loc}>{s.loc} · {s.lpn || "No LPN"} · Qty {s.qty}</option>)}</select></div>
            {mode === "Transfer" && <div className="field"><label>To Warehouse / Location</label><select value={form.toLoc} onChange={(e) => setForm({ ...form, toLoc: e.target.value })}>{LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.code} · {PLANTS.find((p) => p.id === l.plant)?.name}</option>)}</select></div>}
            <div className="field"><label>Qty</label><input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
            <div className="field"><label>Ref / Ticket</label><input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} placeholder="CS / QC / Loan Ref" /></div>
            {mode !== "Transfer" && <div className="field"><label>Reason</label><select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}><option>เบิกไปให้ลูกค้ายืม</option><option>เบิกไปทดลอง</option><option>เบิกไป QC</option><option>เบิกมา Check Stock</option></select></div>}
          </div>
          <button className="btn" onClick={() => confirmAction({ title: `Confirm ${mode}`, message: `ยืนยันสร้างคำสั่ง ${mode} สำหรับ ${selected?.lpn || selected?.itemId || ""}?`, onConfirm: createOrder })}><ClipboardCheck size={13} /> สร้างคำสั่ง</button>
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Location</th><th>Warehouse</th><th>Qty</th><th>Status</th></tr></thead><tbody>{candidates.slice(0, 10).map((s) => <tr key={s.key}><td className="mono">{s.lpn || "-"}</td><td className="mono">{s.itemId}</td><td>{itemOf(s.itemId)?.name || "-"}</td><td className="mono">{s.loc || "PICK-PACK"}</td><td>{PLANTS.find((p) => p.id === locOf(s.loc)?.plant)?.name || "-"}</td><td>{s.qty}</td><td>{s.status}</td></tr>)}</tbody></table>
        </div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Order</th><th>Mode</th><th>SYNNEX ID</th><th>Item Name</th><th>LPN</th><th>From</th><th>To</th><th>Qty</th><th>Reason</th><th>User</th><th>Time</th><th>Status</th></tr></thead><tbody>{orders.map((o) => <tr key={o.id}><td className="mono">{o.id}</td><td>{o.mode}</td><td className="mono">{o.itemId}</td><td>{o.itemName}</td><td className="mono">{o.lpn}</td><td className="mono">{o.fromLoc}</td><td className="mono">{o.toLoc}</td><td>{o.qty}</td><td>{o.reason}</td><td>{o.by}</td><td>{o.t}</td><td>{o.status}</td></tr>)}</tbody></table></div>
    </>
  );
}

function PreworkStickers({ stickerTasks = [], setStickerTasks = () => {}, stickerStock = [], stock = [], allocOrders = [], platformOrders = [], addTx = () => {}, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.(), userSession }) {
  const orderLinesOf = (order) => {
    if (Array.isArray(order?.items)) return order.items;
    if (Array.isArray(order?.lines)) return order.lines;
    if (order?.items && typeof order.items === "object") return Object.values(order.items).flat().filter(Boolean);
    if (order?.lines && typeof order.lines === "object") return Object.values(order.lines).flat().filter(Boolean);
    return [];
  };
  const candidates = stock.filter((r) => itemOf(r.itemId)?.stickerRequired && r.stickerStatus !== "DONE").slice(0, 8).map((r, i) => {
    const item = itemOf(r.itemId);
    const waitingOrders = [...allocOrders, ...platformOrders].filter((o) => !statusHas(o.status, "Packed", "Shipped", "สำเร็จ")).filter((o) => orderLinesOf(o).some((l) => l.itemId === r.itemId));
    const urgent = waitingOrders.some((o) => o.priority === "SLA Risk" || o.priority === "VIP") || i === 0;
    const low = r.qty < (item?.dailySales || 10) * 5;
    const demandQty = waitingOrders.reduce((sum, o) => sum + orderLinesOf(o).filter((l) => l.itemId === r.itemId).reduce((a, l) => a + Number(l.qty || l.requestedQty || 0), 0), 0);
    return {
      ...r,
      item,
      stickerSize: stickerSizeForItem(item),
      waitingOrders,
      demandQty,
      reason: urgent ? `มี Order รอ ${waitingOrders.map((o) => o.id).slice(0, 2).join(", ") || "เร่งด่วน"} ต้องติดก่อน` : low ? "สินค้า Fast moving / Stock ต่ำ ควรเติมสต็อก" : "ต้องติดตาม Master ก่อนขาย",
      tone: urgent ? "risk" : low ? "warn" : "info",
      priorityLabel: urgent ? "ด่วนมาก: By pass to Picking" : low ? "ด่วนรอง: เติมสต็อก" : "ไม่ด่วน: ต้องทำ",
    };
  });
  const [selectedKey, setSelectedKey] = useState(candidates[0]?.key || "");
  const [machine, setMachine] = useState(STICKER_MACHINES[0]);
  const selected = candidates.find((r) => r.key === selectedKey) || candidates[0];
  const createBill = () => {
    if (!selected) return;
    const id = `PW-${Date.now().toString().slice(-5)}`;
    const qty = Math.min(selected.qty, Math.max(1, Math.ceil(selected.qty / 2)));
    const task = { id, order: selected.tone === "risk" ? (selected.waitingOrders[0]?.id || "URGENT-ORDER") : "PREWORK-BILL", itemId: selected.itemId, qtyRequired: qty, qtyDone: 0, source: locOf(selected.loc)?.system === "ASRS" ? "ASRS" : selected.loc.includes("STAGE") ? "Inbound Staging" : "Onfloor", machineNo: machine, workDate: new Date().toISOString().slice(0, 10), status: locOf(selected.loc)?.system === "ASRS" ? "ASRS Command Sent" : "Move Order Created", note: selected.reason, stockKey: selected.key, lpn: selected.lpn, fromLoc: selected.loc, toLoc: "PREWORK", system: locOf(selected.loc)?.system || "Manual", moveStatus: "Pending Move", stickerSize: selected.stickerSize, priorityTone: selected.tone, nextMoveLabel: selected.tone === "risk" ? "By pass move to picking station" : "Move to Putaway / Miniload", nextToLoc: selected.tone === "risk" ? "PICK-PACK" : "MZ-01-01-A" };
    setStickerTasks((list) => [task, ...list]);
    addTx({ type: "Sticker Bill", detail: `${id}: เรียก ${selected.lpn || selected.itemId} จาก ${selected.loc} ไป PREWORK · Machine ${machine}`, itemId: selected.itemId, lpn: selected.lpn, fromLoc: selected.loc, toLoc: "PREWORK", user: userSession?.user || "system" });
    notify("สร้าง Bill Prework สำเร็จ", `${id} ถูกสร้างเพื่อเรียกของไปติดสติ๊กเกอร์`, "success");
  };
  const closeTask = (task) => {
    setStickerTasks((list) => list.map((t) => t.id === task.id ? { ...t, status: "Completed", qtyDone: t.qtyRequired, confirmedAt: new Date().toISOString(), nextMoveStatus: "Pending", nextToLoc: t.nextToLoc || (t.priorityTone === "risk" ? "PICK-PACK" : "MZ-01-01-A") } : t));
    addTx({ type: "Sticker Completed", detail: `${task.id}: ${task.machineNo} ติดครบ ${task.qtyRequired} ชิ้น · Sticker ${task.stickerSize}`, itemId: task.itemId, lpn: task.lpn, loc: "PREWORK", user: userSession?.user || "system" });
    notify("จบงาน Prework", `${task.id} ติดสติ๊กเกอร์ครบแล้ว`, "success");
  };
  const machineRows = STICKER_MACHINES.map((m) => ({ machine: m, done: stickerTasks.filter((t) => t.machineNo === m).reduce((a, t) => a + Number(t.qtyDone || 0), 0), plan: stickerTasks.filter((t) => t.machineNo === m).reduce((a, t) => a + Number(t.qtyRequired || 0), 0) }));
  return (
    <>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={Tags} label="Prework Bills" value={stickerTasks.length} sub="ใบงานทั้งหมด" variant="plan" />
        <LpCard icon={CheckCircle2} label="Completed" value={stickerTasks.filter((t) => t.status === "Completed").length} sub="จบงานแล้ว" variant="good" />
        <LpCard icon={AlertTriangle} label="Urgent" value={candidates.filter((c) => c.tone === "risk").length} sub="ควรเรียกก่อน" variant="bad" />
        <LpCard icon={PackageSearch} label="Sticker Stock" value={stickerStock.reduce((a, s) => a + s.qty, 0).toLocaleString()} sub="ดวงคงเหลือ" variant="info" />
      </div>
      <div className="grid g2" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>AI Recommendation - เรียกสินค้ามา Prework</h3>
          <div className="field"><label>สินค้าแนะนำ</label><select value={selected?.key || ""} onChange={(e) => setSelectedKey(e.target.value)}>{candidates.map((r) => <option key={r.key} value={r.key}>{r.itemId} · {r.item?.name} · {r.reason}</option>)}</select></div>
          <div className="field"><label>Assign เครื่อง</label><select value={machine} onChange={(e) => setMachine(e.target.value)}>{STICKER_MACHINES.map((m) => <option key={m}>{m}</option>)}</select></div>
          {selected && <div className={`allocation-shortage prework-priority-row ${selected.tone === "risk" ? "urgent" : selected.tone === "warn" ? "replenish" : "normal"}`}><AlertTriangle size={14} /><span><b>{selected.priorityLabel}</b> · {selected.reason} · Demand {selected.demandQty || 0} · LPN {selected.lpn || "-"} · {selected.loc} · Sticker {selected.stickerSize} · Next {selected.tone === "risk" ? "PICK-PACK" : "Putaway/Miniload"}</span></div>}
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => confirmAction({ title: "สร้าง Bill Prework", message: `ยืนยันเรียก ${selected?.itemId || ""} ไป PREWORK?`, onConfirm: createBill })}><Send size={13} /> สร้าง Bill เรียกสินค้า</button>
        </div>
        <div className="lp-panel">
          <h3>Machine Performance</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={machineRows} margin={{ top: 12, right: 12, left: -18, bottom: 24 }}>
              <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
              <XAxis dataKey="machine" stroke="#8B96A8" tick={{ fontSize: 10 }} angle={-18} textAnchor="end" interval={0} />
              <YAxis stroke="#8B96A8" tick={{ fontSize: 10 }} />
              <Tooltip {...lightTooltip} />
              <Bar dataKey="done" name="Qty Done" fill="#20C766" radius={[6, 6, 0, 0]} />
              <Bar dataKey="plan" name="Qty Plan" fill="#2F67FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid g3" style={{ marginBottom: 14 }}>{stickerStock.map((s) => <div className="card" key={s.rollId}><h3>Sticker Size {s.size}</h3><div className="kpi-val">{Number(s.qty || 0).toLocaleString()}</div><div className="kpi-sub">{s.rollId} · {s.loc}</div></div>)}</div>
      <div className="table-wrap"><table><thead><tr><th>Bill</th><th>Priority</th><th>SYNNEX ID</th><th>Item Name</th><th>LPN</th><th>From</th><th>Machine</th><th>Sticker Size</th><th>Plan</th><th>Done</th><th>Status</th><th>Next Move</th><th></th></tr></thead><tbody>{stickerTasks.map((t) => <tr className={`prework-priority-row ${t.status === "Completed" ? "done" : t.priorityTone === "risk" ? "urgent" : t.priorityTone === "warn" ? "replenish" : "normal"}`} key={t.id}><td className="mono">{t.id}</td><td><span className={`prework-priority-badge ${t.status === "Completed" ? "done" : t.priorityTone === "risk" ? "urgent" : t.priorityTone === "warn" ? "replenish" : "normal"}`}>{t.status === "Completed" ? "เสร็จแล้ว" : t.priorityTone === "risk" ? "ด่วนมาก" : t.priorityTone === "warn" ? "เติมสต็อก" : "ต้องทำ"}</span></td><td className="mono">{t.itemId}</td><td>{itemOf(t.itemId)?.name || "-"}</td><td className="mono">{t.lpn || "-"}</td><td className="mono">{t.fromLoc || t.source}</td><td>{t.machineNo || "-"}</td><td>{t.stickerSize || stickerSizeForItem(itemOf(t.itemId))}</td><td>{Number(t.qtyRequired || 0).toLocaleString()}</td><td>{Number(t.qtyDone || 0).toLocaleString()}</td><td>{t.status}</td><td>{t.nextMoveLabel || t.nextToLoc || "-"}</td><td><button className="btn secondary" disabled={t.status === "Completed"} onClick={() => closeTask(t)}><CheckCircle2 size={12} /> จบงาน</button></td></tr>)}</tbody></table></div>
    </>
  );
}

function ReturnsManagement({ returnTickets = [], setReturnTickets = () => {}, addTx = () => {}, notify = () => {}, userSession }) {
  const [activeId, setActiveId] = useState(returnTickets[0]?.id || "");
  const active = returnTickets.find((t) => t.id === activeId) || returnTickets[0];
  const updateTicket = (id, patch) => setReturnTickets((list) => list.map((t) => t.id === id ? { ...t, ...patch } : t));
  const advance = (t) => {
    const step = Math.min(4, Number(t.step || 0) + 1);
    updateTicket(t.id, { step, pickupStep: Math.max(t.pickupStep || 0, 4) });
    addTx({ type: "Return", detail: `${t.id}: ${RETURN_STEPS[step]} by ${userSession?.user || "system"}`, itemId: t.itemId, orderId: t.order, loc: "RETURN-QC", user: userSession?.user || "system" });
    notify("อัปเดตรับคืนสำเร็จ", `${t.id} -> ${RETURN_STEPS[step]}`, "success");
  };
  const timelineFor = (t) => RETURN_TX_FLOW.map((f, i) => ({ ...f, done: i <= Math.min(RETURN_TX_FLOW.length - 1, (t.pickupStep || 0) + (t.step || 0)), time: `${t.date} ${f.offset}` }));
  return (
    <>
      <ReturnsSummaryCards returnTickets={returnTickets} />
      <div className="grid g2" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>Return Status Tracking</h3>
          <div className="field"><label>เลือก Ticket</label><select value={active?.id || ""} onChange={(e) => setActiveId(e.target.value)}>{returnTickets.map((t) => <option key={t.id} value={t.id}>{t.id} · {t.order} · {itemOf(t.itemId)?.name}</option>)}</select></div>
          {active && <div className="handheld-job-card" style={{ background: "#F8FBFF", borderColor: "var(--border)", color: "var(--text)" }}><b className="mono">{active.id} · {active.order}</b><span>{itemOf(active.itemId)?.name || "-"} · Qty {active.qty} · {active.reason}</span><em>{active.carrier} · {active.trackingNo}</em></div>}
          {active && <div className="return-steps">{RETURN_PICKUP_STEPS.map((s, i) => <span key={s} className={`scan-step ${i <= (active.pickupStep || 0) ? "done" : ""}`}>{i <= (active.pickupStep || 0) ? <CheckCircle2 size={11} /> : <Clock size={11} />}{s}</span>)}</div>}
          {active && <div className="return-steps" style={{ marginTop: 8 }}>{RETURN_STEPS.map((s, i) => <span key={s} className={`scan-step ${i <= (active.step || 0) ? "done" : ""}`}>{i <= (active.step || 0) ? <CheckCircle2 size={11} /> : <Clock size={11} />}{s}</span>)}</div>}
          {active && <div className="grid g2" style={{ marginTop: 12 }}><button className="btn secondary" onClick={() => updateTicket(active.id, { photo: "attached-photo.jpg" })}><ImagePlus size={13} /> แนบรูป</button><button className="btn secondary" onClick={() => updateTicket(active.id, { video: "attached-video.mp4" })}><Video size={13} /> แนบวิดีโอ</button></div>}
          {active && <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => advance(active)}><ArrowRight size={13} /> ดำเนินการขั้นต่อไป</button>}
        </div>
        <div className="card">
          <h3>Return Transaction Timeline</h3>
          {active && timelineFor(active).map((ev) => <div className="log-item" key={ev.key}><div className={`log-ic ${ev.done ? "system" : "ai"}`}>{ev.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}</div><div><div className="log-text"><b>{ev.phase}</b> - {ev.activity}</div><div className="log-time">{ev.time} · {ev.loc}</div></div></div>)}
        </div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Ticket</th><th>Order</th><th>SYNNEX ID</th><th>Item Name</th><th>Qty</th><th>Reason</th><th>Carrier</th><th>Tracking</th><th>Step</th><th>Photo/Video</th><th>Decision</th></tr></thead><tbody>{returnTickets.map((t) => <tr className={`clickable ${active?.id === t.id ? "sel-row" : ""}`} onClick={() => setActiveId(t.id)} key={t.id}><td className="mono"><button className="link-btn mono" onClick={(e) => { e.stopPropagation(); setActiveId(t.id); }}>{t.id}</button></td><td>{t.order}</td><td className="mono">{t.itemId}</td><td>{itemOf(t.itemId)?.name || "-"}</td><td>{t.qty}</td><td>{t.reason}</td><td>{t.carrier}</td><td className="mono">{t.trackingNo}</td><td>{RETURN_STEPS[t.step] || "-"}</td><td>{t.photo ? "รูป " : ""}{t.video ? "วิดีโอ" : "" || "-"}</td><td>{t.decision || "-"}</td></tr>)}</tbody></table></div>
    </>
  );
}

function CustomerService({ csCases = [], setCsCases = () => {}, setReturnTickets = () => {}, notify = () => {} }) {
  const [issue, setIssue] = useState(ISSUE_TYPES[0].label);
  const [owner, setOwner] = useState("Warehouse");
  const openReturn = () => {
    const id = `RT-${Date.now().toString().slice(-4)}`;
    const item = pick(ITEMS);
    setReturnTickets((list) => [{ id, order: `SO-${rand(88000, 88999)}`, itemId: item.id, qty: rand(1, 5), reason: issue, photo: null, video: null, pickupStep: 0, carrier: "Carrier Pending", trackingNo: `RET-${id}`, step: 0, grade: null, decision: null, note: "CS เปิด Ticket รับคืน", date: "2569-07-10" }, ...list]);
    notify("เปิด Ticket รับคืนแล้ว", `${id} ส่งงานให้ WMS/Returns`, "success");
  };
  const issueRows = ISSUE_TYPES.map((it) => ({ name: it.label, count: csCases.filter((c) => c.issueType === it.label).length }));
  return (
    <>
      <ServiceLevelDashboard csCases={csCases} platformOrders={PLATFORM_ORDERS_INIT} />
      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card"><h3>CS เปิด Ticket ไปรับสินค้าคืน</h3><div className="field"><label>ประเด็นปัญหา</label><select value={issue} onChange={(e) => setIssue(e.target.value)}>{ISSUE_TYPES.map((i) => <option key={i.label}>{i.label}</option>)}</select></div><div className="field"><label>ผู้รับผิดชอบเบื้องต้น</label><select value={owner} onChange={(e) => setOwner(e.target.value)}>{FAULT_OWNERS.map((o) => <option key={o}>{o}</option>)}</select></div><button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={openReturn}><Undo2 size={13} /> เปิด Return Ticket</button></div>
        <div className="lp-panel"><h3>Issue Case Matrix</h3><ResponsiveContainer width="100%" height={260}><BarChart data={issueRows} margin={{ top: 10, right: 14, left: -18, bottom: 32 }}><CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-18} textAnchor="end" interval={0} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip {...lightTooltip} /><Bar dataKey="count" fill="#2F67FF" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="table-wrap" style={{ marginTop: 14 }}><table><thead><tr><th>Case</th><th>Issue</th><th>Owner</th><th>KPI</th><th>SO</th><th>Customer</th><th>Date</th><th>Status</th></tr></thead><tbody>{csCases.map((c) => <tr key={c.id}><td className="mono">{c.id}</td><td>{c.issueType || c.type}</td><td>{c.faultOwner}</td><td>{c.kpiImpact}</td><td className="mono">{c.so}</td><td>{c.customer}</td><td>{c.date}</td><td>{c.status || "Open"}</td></tr>)}</tbody></table></div>
    </>
  );
}

function Picking() {
  const [group, setGroup] = useState("ALL");
  const [aiPick, setAiPick] = useState(null);
  const list = group === "ALL" ? STRATEGIES : STRATEGIES.filter((s) => s.g === group);
  const runAI = () => setAiPick(pick(list.length ? list : STRATEGIES));
  return (
    <>
      <div className="ai-box"><div className="row"><BrainCircuit size={22} color="var(--amber)" /><div style={{ flex: 1 }}><div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14 }}>AI Decision Engine - Picking Strategy</div><div className="kpi-sub">เลือกกลยุทธ์การหยิบและจำลองคำแนะนำจาก AI</div></div><button className="btn" onClick={runAI}><Sparkles size={13} /> วิเคราะห์</button></div>{aiPick && <div className="reason">AI แนะนำ: <b style={{ color: "var(--teal)" }}>{aiPick.name}</b> ({aiPick.th})</div>}</div>
      <div className="strategy-toolbar"><Filter size={14} color="var(--muted)" /><span className={`chip ${group === "ALL" ? "active" : ""}`} onClick={() => setGroup("ALL")}>ทั้งหมด</span>{Object.entries(GROUPS).map(([k, v]) => <span key={k} className={`chip ${group === k ? "active" : ""}`} onClick={() => setGroup(k)}>{k}. {v.label}</span>)}</div>
      <div className="strategy-grid">{list.map((s) => <div key={s.id} className={`s-card ${aiPick?.id === s.id ? "highlight" : ""}`}><div className="top"><span className="idn">#{String(s.id).padStart(2, "0")}</span><GroupPill g={s.g} /></div><div className="name">{s.name}</div><div className="th-name">{s.th}</div><Stars n={s.stars} /></div>)}</div>
    </>
  );
}

function Warehouse3D({ stock = [] }) {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return undefined;
    const mount = mountRef.current;
    const width = mount.clientWidth || 900;
    const height = 420;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f7fb);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 13, 18);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa7b8, 1.25));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(8, 12, 8);
    scene.add(dir);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.16, 14), new THREE.MeshStandardMaterial({ color: 0xe7eef8, roughness: 0.85 }));
    floor.position.y = -0.12;
    scene.add(floor);
    const grid = new THREE.GridHelper(22, 22, 0xb9c6d8, 0xd6dee8);
    grid.position.y = 0.02;
    scene.add(grid);

    const byLoc = Object.values(stock.reduce((m, r) => {
      const loc = r.loc || "UNKNOWN";
      m[loc] = m[loc] || { loc, qty: 0, status: r.status, floor: locOf(loc)?.floor };
      m[loc].qty += Number(r.qty || 0);
      if (r.status !== "AVL") m[loc].status = r.status;
      return m;
    }, {})).slice(0, 28);
    byLoc.forEach((r, i) => {
      const x = (i % 7) * 2.8 - 8.4;
      const z = Math.floor(i / 7) * 2.6 - 4.2;
      const h = Math.max(0.5, Math.min(4.2, r.qty / 420));
      const color = r.status === "HOLD" || r.status === "QC" ? 0xf5a83c : r.status === "DMG" ? 0xf15b71 : 0x3e7ee0;
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.7, h, 1.5), new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.04 }));
      box.position.set(x, h / 2, z);
      scene.add(box);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }));
      edge.position.copy(box.position);
      scene.add(edge);
    });
    let raf = 0;
    const tick = () => {
      scene.rotation.y += 0.0025;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();
    const onResize = () => {
      const w = mount.clientWidth || width;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement?.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [stock]);
  return (
    <>
      <div className="section-title">3D Warehouse Space</div>
      <div className="wh3d-shell">
        <div className="wh3d-canvas" ref={mountRef} />
        <div className="wh3d-legend"><span><i className="blue" />Available</span><span><i className="amber" />Hold / QC</span><span><i className="red" />Damage</span></div>
      </div>
      <div className="grid g3" style={{ marginTop: 14 }}>{stock.slice(0, 18).map((r) => <div className="card" key={r.key || `${r.loc}-${r.itemId}`}><h3>{r.loc}</h3><div className="kpi-val">{Number(r.qty || 0).toLocaleString()}</div><div className="kpi-sub">{r.itemId} · {itemOf(r.itemId)?.name || "-"}</div><StatusBadge code={r.status || "AVL"} /></div>)}</div>
    </>
  );
}

function inventoryRowsOf(stock) {
  return stock.map((r, i) => {
    const item = itemOf(r.itemId);
    const loc = locOf(r.loc);
    const size = sizeGroupOf(item);
    const palletCap = Math.max(1, (size.code === "S" ? 2400 : size.code === "M" ? 1200 : size.code === "L" ? 500 : 180));
    const util = Math.min(100, Math.round((Number(r.qty || 0) / palletCap) * 100));
    const sticker = stickerStateOfStock(r);
    return { ...r, item, locObj: loc, floorName: floorOf(loc?.floor)?.name || loc?.floor || "-", sizeCode: size.code, sticker, palletCap, util, days: Number(r.age ?? (5 + ((i * 11) % 120))) };
  });
}

function InventoryHoldOverview({ stock = [], setStock = () => {}, addTx = () => {}, notify = () => {}, confirmAction = ({ onConfirm }) => onConfirm?.(), userSession }) {
  const [filters, setFilters] = useState({ date: "", item: "", name: "", lpn: "", loc: "", size: "", floor: "", status: "", brand: "", plant: "" });
  const [row, setRow] = useState(null);
  const [status, setStatus] = useState("AVL");
  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const rows = inventoryRowsOf(stock).filter((r) =>
    (!filters.item || r.itemId.includes(filters.item)) &&
    (!filters.name || (r.item?.name || "").toLowerCase().includes(filters.name.toLowerCase())) &&
    (!filters.lpn || (r.lpn || "").toLowerCase().includes(filters.lpn.toLowerCase())) &&
    (!filters.loc || (r.loc || "").toLowerCase().includes(filters.loc.toLowerCase())) &&
    (!filters.size || r.sizeCode === filters.size) &&
    (!filters.plant || r.locObj?.plant === filters.plant) &&
    (!filters.floor || r.floorName.toLowerCase().includes(filters.floor.toLowerCase()) || (r.locObj?.floor || "").toLowerCase().includes(filters.floor.toLowerCase())) &&
    (!filters.status || r.status === filters.status) &&
    (!filters.brand || (r.item?.brand || "").toLowerCase().includes(filters.brand.toLowerCase()))
  );
  const submit = () => {
    if (!row) return;
    setStock((list) => list.map((r) => (r.key === row.key ? { ...r, status } : r)));
    addTx({ type: "Status Change", detail: `${row.lpn || row.key}: ${row.status} -> ${status} by ${userSession?.user || "system"}`, itemId: row.itemId, lpn: row.lpn, loc: row.loc, user: userSession?.user || "system" });
    notify("ปรับ Status สำเร็จ", `${row.lpn || row.itemId} เป็น ${status}`, "success");
    setRow(null);
  };
  return (
    <>
      <div className="section-title">Inventory Overview</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="grid g4">
          <div className="field"><label>SYNNEX ID</label><input value={filters.item} onChange={(e) => setF("item", e.target.value)} /></div>
          <div className="field"><label>Item Name</label><input value={filters.name} onChange={(e) => setF("name", e.target.value)} /></div>
          <div className="field"><label>LPN</label><input value={filters.lpn} onChange={(e) => setF("lpn", e.target.value)} /></div>
          <div className="field"><label>Location</label><input value={filters.loc} onChange={(e) => setF("loc", e.target.value)} /></div>
          <div className="field"><label>Size</label><select value={filters.size} onChange={(e) => setF("size", e.target.value)}><option value="">ทั้งหมด</option>{SIZE_GROUPS.map((s) => <option key={s.code}>{s.code}</option>)}</select></div>
          <div className="field"><label>Plant / WH</label><select value={filters.plant} onChange={(e) => setF("plant", e.target.value)}><option value="">ทุก Plant</option>{PLANTS.map((p) => <option key={p.id} value={p.id}>{p.erpCode} · {p.name}</option>)}</select></div>
          <div className="field"><label>Floor</label><input value={filters.floor} onChange={(e) => setF("floor", e.target.value)} /></div>
          <div className="field"><label>Status</label><select value={filters.status} onChange={(e) => setF("status", e.target.value)}><option value="">ทั้งหมด</option>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
          <div className="field"><label>Brand</label><input value={filters.brand} onChange={(e) => setF("brand", e.target.value)} /></div>
        </div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Brand</th><th>Size</th><th>Sticker</th><th>Lot</th><th>Location</th><th>Plant / WH</th><th>Floor</th><th>Qty</th><th>Status</th><th>Utilization / Pallet-Basket</th><th></th></tr></thead><tbody>
        {rows.map((r) => <tr key={r.key || `${r.loc}-${r.itemId}`}><td className="mono">{r.lpn || "-"}</td><td className="mono">{r.itemId}</td><td>{r.item?.name || "-"}</td><td>{r.item?.brand || "-"}</td><td><span className={sizeChipClass(r.sizeCode)}>{r.sizeCode}</span></td><td><span className={`scan-step ${r.sticker.ok ? "done" : "active"}`}>{r.sticker.label}</span></td><td className="mono">{r.batch || "-"}</td><td className="mono">{r.loc}</td><td>{plantLabelOf(r.locObj?.plant)}</td><td>{r.floorName}</td><td>{Number(r.qty || 0).toLocaleString()}</td><td><StatusBadge code={r.status || "AVL"} /></td><td>{utilizationBar(r.util)}<div className="kpi-sub">cap {r.palletCap}</div></td><td><button className="btn secondary" onClick={() => { setRow(r); setStatus(r.status || "AVL"); }}><Edit3 size={12} /> ปรับ Status</button></td></tr>)}
      </tbody></table></div>
      {row && <Modal onClose={() => setRow(null)} width={420}><h2>ปรับ Status ราย LPN</h2><div className="kpi-sub" style={{ marginBottom: 12 }}>{row.lpn || row.key} · {row.itemId} · {row.loc}</div><div className="field"><label>Status ใหม่</label><select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUS_LIST.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div><button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => confirmAction({ title: "ยืนยันปรับ Status", message: `ปรับ ${row.lpn || row.itemId} เป็น ${status}?`, onConfirm: submit })}>ยืนยัน</button></Modal>}
    </>
  );
}

function AgingReport({ stock = [] }) {
  const [q, setQ] = useState("");
  const rows = inventoryRowsOf(stock).filter((r) => `${r.lpn} ${r.itemId} ${r.item?.name} ${r.loc} ${r.batch} ${r.sizeCode} ${r.floorName}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.days - a.days);
  return <><div className="section-title">Aging</div><div className="search-box" style={{ maxWidth: 520 }}><Search size={15} color="var(--muted)" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหา วัน/เดือน/ปี, SYNNEX ID, ชื่อสินค้า, LPN, location, size, floor" /></div><div className="table-wrap"><table><thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Brand</th><th>Size</th><th>Sticker</th><th>Lot</th><th>Location</th><th>Floor</th><th>Qty</th><th>Aging Days</th><th>Status</th><th>Utilization</th></tr></thead><tbody>{rows.map((r) => { const age = ageBucket(r.days); return <tr key={r.key || `${r.loc}-${r.itemId}`}><td className="mono">{r.lpn || "-"}</td><td className="mono">{r.itemId}</td><td>{r.item?.name || "-"}</td><td>{r.item?.brand || "-"}</td><td><span className={sizeChipClass(r.sizeCode)}>{r.sizeCode}</span></td><td>{r.sticker.label}</td><td className="mono">{r.batch || "-"}</td><td className="mono">{r.loc}</td><td>{r.floorName}</td><td>{Number(r.qty || 0).toLocaleString()}</td><td><span className={`age-chip ${age.cls}`}>{r.days} วัน</span></td><td><StatusBadge code={r.status || "AVL"} /></td><td>{utilizationBar(r.util, `age-${age.cls === "ok" ? "ok" : age.cls === "warn" ? "warn" : "risk"}`)}</td></tr>; })}</tbody></table></div></>;
}

function StockCover({ stock = [] }) {
  const [q, setQ] = useState("");
  const rows = inventoryRowsOf(stock).map((r) => { const daily = Math.max(1, r.item?.dailySales || 10); return { ...r, daily, cover: Number(r.qty || 0) / daily }; }).filter((r) => `${r.lpn} ${r.itemId} ${r.item?.name} ${r.loc} ${r.batch} ${r.sizeCode} ${r.floorName}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.cover - b.cover);
  return <><div className="section-title">Stock Cover Day</div><div className="search-box" style={{ maxWidth: 520 }}><Search size={15} color="var(--muted)" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหา SYNNEX ID, ชื่อสินค้า, LPN, location, size, floor" /></div><div className="table-wrap"><table><thead><tr><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Brand</th><th>Size</th><th>Sticker</th><th>Location</th><th>Floor</th><th>Stock</th><th>Daily Sales</th><th>Cover Day</th><th>Status</th><th>Utilization</th></tr></thead><tbody>{rows.map((r) => <tr key={r.key || `${r.loc}-${r.itemId}`}><td className="mono">{r.lpn || "-"}</td><td className="mono">{r.itemId}</td><td>{r.item?.name || "-"}</td><td>{r.item?.brand || "-"}</td><td><span className={sizeChipClass(r.sizeCode)}>{r.sizeCode}</span></td><td>{r.sticker.label}</td><td className="mono">{r.loc}</td><td>{r.floorName}</td><td>{Number(r.qty || 0).toLocaleString()}</td><td>{r.daily}</td><td style={{ color: r.cover < 7 ? "var(--danger)" : r.cover < 14 ? "var(--amber)" : "var(--teal)", fontWeight: 800 }}>{r.cover.toFixed(1)}</td><td><StatusBadge code={r.status || "AVL"} /></td><td>{utilizationBar(r.util)}</td></tr>)}</tbody></table></div></>;
}

function genRecall(currentQty) { const received = [{ ref: "PO-256907-101", date: "2569-07-01", qty: currentQty + 120 }, { ref: "PO-256907-142", date: "2569-07-05", qty: 80 }]; const issued = [{ ref: "SO-88210", date: "2569-07-07", qty: 100 }, { ref: "SO-88291", date: "2569-07-08", qty: 100 }]; return { received, issued, totalReceived: received.reduce((a, r) => a + r.qty, 0), totalIssued: issued.reduce((a, r) => a + r.qty, 0) }; }

function TotalRecall({ stock = [] }) {
  const itemIds = [...new Set(stock.map((s) => s.itemId))]; const [itemId, setItemId] = useState(itemIds[0] || ITEMS[0]?.id || ""); const batches = stock.filter((s) => s.itemId === itemId).map((s) => s.batch); const [batch, setBatch] = useState(batches[0] || ""); const row = stock.find((s) => s.itemId === itemId && s.batch === batch) || stock.find((s) => s.itemId === itemId); const data = genRecall(Number(row?.qty || 0)); const selectedItem = itemOf(itemId);
  return <><div className="section-title">Total Recall Product - ตรวจสอบการรับเข้า / จ่ายออก ต่อสินค้าและ Batch</div><div className="grid g2" style={{ marginBottom: 10 }}><div className="field"><label>เลือกสินค้า</label><select value={itemId} onChange={(e) => setItemId(e.target.value)}>{itemIds.map((id) => <option key={id} value={id}>{id} · {itemOf(id)?.name}</option>)}</select></div><div className="field"><label>เลือก Batch</label><select value={batch} onChange={(e) => setBatch(e.target.value)}>{[...new Set(batches)].map((b) => <option key={b} value={b}>{b}</option>)}</select></div></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}><span className="profile-tag">SYNNEX ID: {selectedItem?.id}</span><span className="profile-tag">Brand: {selectedItem?.brand}</span><span className="profile-tag">Location: {row?.loc || "-"}</span></div><div className="recall-split"><div className="recall-col"><h4 style={{ color: "var(--success)" }}>รับเข้า (Receiving)</h4>{data.received.map((r) => <div className="recall-row" key={r.ref}><span>{r.ref} · {r.date}</span><span className="mono">+{r.qty}</span></div>)}<div className="recall-row" style={{ fontWeight: 700 }}><span>รวมรับเข้า</span><span className="mono">{data.totalReceived}</span></div></div><div className="recall-col"><h4 style={{ color: "var(--danger)" }}>จ่ายออก (Issue)</h4>{data.issued.map((r) => <div className="recall-row" key={r.ref}><span>{r.ref} · {r.date}</span><span className="mono">-{r.qty}</span></div>)}<div className="recall-row" style={{ fontWeight: 700 }}><span>รวมจ่ายออก</span><span className="mono">{data.totalIssued}</span></div></div></div><div className="card" style={{ marginTop: 16 }}><div className="recall-row"><span>คงเหลือคำนวณ</span><span className="mono">{data.totalReceived - data.totalIssued}</span></div><div className="recall-row"><span>คงเหลือจริงในระบบ (Location: {row?.loc || "-"})</span><span className="mono">{Number(row?.qty || 0).toLocaleString()}</span></div></div></>;
}

function TotalRecallPrework({ stickerTasks = [], stickerStock = [] }) {
  const tasks = stickerTasks.map((t) => {
    const item = itemOf(t.itemId);
    const stickerSize = t.stickerSize || stickerSizeForItem(item);
    return { ...t, item, stickerSize };
  });
  const stickerSizes = ["ALL", ...new Set([...stickerStock.map((s) => s.size), ...tasks.map((t) => t.stickerSize)].filter(Boolean))];
  const brands = ["ALL", ...new Set(tasks.map((t) => t.item?.brand).filter(Boolean))];
  const itemIds = ["ALL", ...new Set(tasks.map((t) => t.itemId).filter(Boolean))];
  const lpnList = ["ALL", ...new Set(tasks.map((t) => t.lpn).filter(Boolean))];
  const statuses = ["ALL", ...new Set(tasks.map((t) => t.status || "Pending").filter(Boolean))];

  const [q, setQ] = useState("");
  const [stickerSize, setStickerSize] = useState("ALL");
  const [stickerLot, setStickerLot] = useState("ALL");
  const [brand, setBrand] = useState("ALL");
  const [itemId, setItemId] = useState("ALL");
  const [lpn, setLpn] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const stickerLots = ["ALL", ...stickerStock.filter((s) => stickerSize === "ALL" || s.size === stickerSize).map((s) => s.rollId)];
  const taskStickerLots = (t) => {
    if (t.stickerLotsUsed?.length) return t.stickerLotsUsed;
    const fallbackLot = stickerStock.find((s) => s.size === t.stickerSize);
    return fallbackLot ? [{ rollId: fallbackLot.rollId, size: fallbackLot.size, qty: Number(t.qtyDone || t.qtyRequired || 0) }] : [];
  };

  const filtered = tasks.filter((t) => {
    const lots = taskStickerLots(t);
    const hay = `${t.id} ${t.order} ${t.itemId} ${t.lpn} ${t.machineNo} ${t.stickerSize} ${lots.map((lot) => lot.rollId).join(" ")} ${t.item?.brand} ${t.item?.name} ${t.note}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase())) &&
      (stickerSize === "ALL" || t.stickerSize === stickerSize) &&
      (stickerLot === "ALL" || lots.some((lot) => lot.rollId === stickerLot)) &&
      (brand === "ALL" || t.item?.brand === brand) &&
      (itemId === "ALL" || t.itemId === itemId) &&
      (lpn === "ALL" || t.lpn === lpn) &&
      (status === "ALL" || (t.status || "Pending") === status);
  });

  const receivingLots = stickerStock
    .filter((s) => (stickerSize === "ALL" || s.size === stickerSize) && (stickerLot === "ALL" || s.rollId === stickerLot))
    .map((s) => {
      const issued = filtered.reduce((sum, t) => sum + taskStickerLots(t).filter((lot) => lot.rollId === s.rollId).reduce((a, lot) => a + Number(lot.qty || t.qtyDone || 0), 0), 0);
      return { ...s, receivedQty: Number(s.receivedQty || s.qty || 0) + issued, issuedQty: issued, balance: Number(s.qty || 0), loc: s.loc || "PREWORK" };
    });

  const issueRows = filtered.flatMap((t) => {
    const lots = taskStickerLots(t);
    return (lots.length ? lots : [{ rollId: "-", size: t.stickerSize, qty: Number(t.qtyDone || 0) }]).map((lot) => ({
      bill: t.id,
      order: t.order || "-",
      date: t.confirmedAt || t.workDate || "-",
      itemId: t.itemId,
      itemName: t.item?.name || "-",
      brand: t.item?.brand || "-",
      lpn: t.lpn || "-",
      machine: t.machineNo || "-",
      stickerSize: lot.size || t.stickerSize,
      lot: lot.rollId,
      qty: Number(lot.qty || t.qtyDone || 0),
      status: t.confirmedAt ? "Completed" : t.status || t.moveStatus || "Pending",
    }));
  });

  const selectedLot = stickerLot !== "ALL" ? receivingLots.find((s) => s.rollId === stickerLot) : null;
  const totalReceived = receivingLots.reduce((a, r) => a + Number(r.receivedQty || 0), 0);
  const totalIssued = issueRows.reduce((a, r) => a + Number(r.qty || 0), 0);
  const totalBalance = receivingLots.reduce((a, r) => a + Number(r.balance || 0), 0);
  const fmtTime = (value) => {
    if (!value || value === "-") return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString("th-TH");
  };

  return (
    <>
      <div className="section-title">Total Recall Prework — Sticker Lot รับเข้า / จ่ายออก / คงเหลือ</div>
      <div className="search-box" style={{ maxWidth: 560 }}>
        <Search size={15} color="var(--muted)" />
        <input placeholder="ค้นหา Bill / SYNNEX ID / Item / LPN / Machine / Sticker Lot" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid g4" style={{ marginBottom: 12 }}>
        <div className="field"><label>Sticker Size</label><select value={stickerSize} onChange={(e) => { setStickerSize(e.target.value); setStickerLot("ALL"); }}>{stickerSizes.map((s) => <option key={s} value={s}>{s === "ALL" ? "ทุก Size" : `Size ${s}`}</option>)}</select></div>
        <div className="field"><label>Sticker Lot / Roll</label><select value={stickerLot} onChange={(e) => setStickerLot(e.target.value)}>{stickerLots.map((id) => <option key={id} value={id}>{id === "ALL" ? "ทุก Lot" : id}</option>)}</select></div>
        <div className="field"><label>Brand</label><select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((b) => <option key={b} value={b}>{b === "ALL" ? "ทุก Brand" : b}</option>)}</select></div>
        <div className="field"><label>SYNNEX ID</label><select value={itemId} onChange={(e) => setItemId(e.target.value)}>{itemIds.map((id) => <option key={id} value={id}>{id === "ALL" ? "ทั้งหมด" : id}</option>)}</select></div>
        <div className="field"><label>LPN สินค้า</label><select value={lpn} onChange={(e) => setLpn(e.target.value)}>{lpnList.map((id) => <option key={id} value={id}>{id === "ALL" ? "ทั้งหมด" : id}</option>)}</select></div>
        <div className="field"><label>Status</label><select value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((s) => <option key={s} value={s}>{s === "ALL" ? "ทั้งหมด" : s}</option>)}</select></div>
      </div>

      <div className="grid g3" style={{ marginBottom: 14 }}>
        <LpCard icon={Tags} label="Sticker Received" value={totalReceived.toLocaleString()} sub="จำนวนรับเข้า Lot ที่เลือก" variant="plan" tone="cyan" progress={100} />
        <LpCard icon={MoveRight} label="Issued to Product" value={totalIssued.toLocaleString()} sub="จ่ายออกไปติดกับสินค้า" variant="good" progress={totalReceived ? Math.min(100, (totalIssued / totalReceived) * 100) : 0} />
        <LpCard icon={Boxes} label="Balance at PREWORK" value={totalBalance.toLocaleString()} sub={selectedLot ? selectedLot.rollId : "รวมคงเหลือทุก Lot"} variant="warn" tone="amber" progress={totalReceived ? Math.min(100, (totalBalance / totalReceived) * 100) : 0} />
      </div>

      <div className="recall-split">
        <div className="recall-col">
          <h4 style={{ color: "var(--teal)" }}>รับเข้า Sticker Lot</h4>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Sticker Size</th><th>Lot / Roll</th><th>รับเข้า</th><th>จ่ายออก</th><th>คงเหลือ</th><th>Location</th><th>Last In</th></tr></thead>
              <tbody>
                {receivingLots.length === 0 && <tr><td colSpan={7} className="kpi-sub">ไม่พบ Lot รับเข้าตาม Filter</td></tr>}
                {receivingLots.map((r) => (
                  <tr key={r.rollId}>
                    <td><span className="status-badge" style={{ background: "var(--teal)" }}>{r.size}</span></td>
                    <td className="mono">{r.rollId}</td>
                    <td className="mono">{Number(r.receivedQty || 0).toLocaleString()}</td>
                    <td className="mono">{Number(r.issuedQty || 0).toLocaleString()}</td>
                    <td className="mono" style={{ color: "var(--success)", fontWeight: 800 }}>{Number(r.balance || 0).toLocaleString()}</td>
                    <td className="mono">{r.loc || "PREWORK"}</td>
                    <td className="mono">{r.lastIn || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="recall-col">
          <h4 style={{ color: "var(--orange)" }}>จ่ายออกไปติดกับสินค้า</h4>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Bill</th><th>Sticker Lot</th><th>LPN</th><th>SYNNEX ID</th><th>Item Name</th><th>Qty</th><th>Machine</th><th>Status</th></tr></thead>
              <tbody>
                {issueRows.length === 0 && <tr><td colSpan={9} className="kpi-sub">ยังไม่มีการจ่าย Sticker ไปติดสินค้าตาม Filter</td></tr>}
                {issueRows.map((r, idx) => (
                  <tr key={`${r.bill}-${r.lot}-${idx}`}>
                    <td className="mono">{fmtTime(r.date)}</td>
                    <td className="mono">{r.bill}</td>
                    <td className="mono">{r.lot}</td>
                    <td className="mono">{r.lpn}</td>
                    <td className="mono">{r.itemId}</td>
                    <td>{r.itemName}</td>
                    <td className="mono">{r.qty.toLocaleString()}</td>
                    <td>{r.machine}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 18 }}>Balance Summary — Location PREWORK</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Sticker Size</th><th>Sticker Lot</th><th>Received Qty</th><th>Issued Qty</th><th>Balance Qty</th><th>Location</th><th>ใช้ไปกับสินค้า</th></tr></thead>
          <tbody>
            {receivingLots.map((r) => {
              const usedItems = issueRows.filter((i) => i.lot === r.rollId).map((i) => `${i.itemId} ${i.itemName}`).filter((v, i, arr) => arr.indexOf(v) === i);
              return (
                <tr key={`${r.rollId}-summary`}>
                  <td>{r.size}</td>
                  <td className="mono">{r.rollId}</td>
                  <td className="mono">{Number(r.receivedQty || 0).toLocaleString()}</td>
                  <td className="mono">{Number(r.issuedQty || 0).toLocaleString()}</td>
                  <td className="mono" style={{ fontWeight: 900 }}>{Number(r.balance || 0).toLocaleString()}</td>
                  <td className="mono">PREWORK</td>
                  <td>{usedItems.join(", ") || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
/* ================================================================== */
/* PRODUCTIVITY & USERS                                                 */
/* ================================================================== */

const DEPTS = ["Sales Online", "Sales Project", "Service", "B2B", "Marketplace"];
const orderLinesOf = (order) => {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.lines)) return order.lines;
  if (order?.items && typeof order.items === "object") return Object.values(order.items).flat().filter(Boolean);
  if (order?.lines && typeof order.lines === "object") return Object.values(order.lines).flat().filter(Boolean);
  return [];
};
const deptOfDoc = (id = "", idx = 0) => DEPTS[(String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0) + idx) % DEPTS.length];

function SalesOrderTracking({ allocOrders = [], platformOrders = [], pickTasks = [], stock = [] }) {
  const [f, setF] = useState({ order: "", brand: "", date: "", itemId: "", name: "" });
  const setFilter = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const rows = allocOrders.map((o, idx) => {
    const lines = orderLinesOf(o);
    const firstLine = lines[0] || {};
    const item = itemOf(firstLine.itemId);
    const src = stock.find((s) => lines.some((l) => l.itemId === s.itemId));
    const pick = pickTasks.find((t) => t.order === o.id);
    const pOrder = platformOrders.find((p) => p.id === o.id || p.orderId === o.id);
    return {
      ...o,
      date: pOrder?.date || String(o.salesSentAt || "").slice(0, 10) || "2569-07-10",
      itemId: firstLine.itemId || "-",
      itemName: item?.name || "-",
      brand: item?.brand || "-",
      loc: src?.loc || (o.status === "Picked" ? "PICK-PACK" : o.status === "Packed" ? "PACK / LOAD" : "-"),
      lpn: src?.lpn || "-",
      picker: pick?.assignee || o.pickedBy || "-",
      seq: idx + 1,
    };
  }).filter((r) => (!f.order || r.id.toLowerCase().includes(f.order.toLowerCase()))
    && (!f.brand || r.brand.toLowerCase().includes(f.brand.toLowerCase()))
    && (!f.date || r.date === f.date)
    && (!f.itemId || r.itemId.includes(f.itemId))
    && (!f.name || r.itemName.toLowerCase().includes(f.name.toLowerCase())));
  const steps = ["Sales Order", "Allocate", "Pick", "Pack", "Load / Ship"];
  const stepNo = (s) => statusHas(s, "Shipped", "จัดส่ง") ? 4 : statusHas(s, "Packed") ? 3 : statusHas(s, "Picked") ? 2 : statusHas(s, "Allocated", "Partial", "Released") ? 1 : 0;
  return (
    <>
      <div className="section-title">ติดตาม Status Order ขาย</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="grid g4">
          <div className="field"><label>Order</label><input value={f.order} onChange={(e) => setFilter("order", e.target.value)} placeholder="SO-88213" /></div>
          <div className="field"><label>Brand</label><input value={f.brand} onChange={(e) => setFilter("brand", e.target.value)} placeholder="ASUS" /></div>
          <div className="field"><label>Date</label><input value={f.date} onChange={(e) => setFilter("date", e.target.value)} placeholder="2569-07-10" /></div>
          <div className="field"><label>SYNNEX ID</label><input value={f.itemId} onChange={(e) => setFilter("itemId", e.target.value)} /></div>
          <div className="field"><label>Name of Item</label><input value={f.name} onChange={(e) => setFilter("name", e.target.value)} /></div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Brand</th><th>SYNNEX ID</th><th>Item Name</th><th>LPN</th><th>Location / Zone</th><th>Picker / System</th><th>Route</th><th>Status</th><th>Progress</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const current = stepNo(r.status);
              const progress = Math.round(((current + 1) / steps.length) * 100);
              return (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td><td className="mono">{r.date}</td><td>{r.customer || "-"}</td><td>{r.brand}</td><td className="mono">{r.itemId}</td><td>{r.itemName}</td><td className="mono">{r.lpn}</td><td className="mono">{r.loc}</td><td>{r.picker}</td><td>{r.route || "-"}</td><td><OrderStatusPill status={r.status} /></td><td>{utilizationBar(progress)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RoRiBilling({ returnTickets = [], platformOrders = [], allocOrders = [] }) {
  const riRows = returnTickets.map((t, idx) => ({ type: "RI", doc: `RI-${t.id}`, month: String(t.date || "2569-07").slice(0, 7), dept: deptOfDoc(t.id, idx), ref: t.order, qty: Number(t.qty || 1), amount: (Number(t.qty || 1) * 45) + 120 }));
  const roRows = allocOrders.slice(0, 16).map((o, idx) => ({ type: "RO", doc: `RO-${String(idx + 1).padStart(5, "0")}`, month: String(o.salesSentAt || "2569-07").slice(0, 7), dept: deptOfDoc(o.id, idx), ref: o.id, qty: orderLinesOf(o).reduce((a, l) => a + Number(l.qty || 0), 0), amount: 180 + orderLinesOf(o).reduce((a, l) => a + Number(l.qty || 0), 0) * 18 }));
  const rows = [...riRows, ...roRows];
  const summary = Object.values(rows.reduce((m, r) => {
    const key = `${r.month}-${r.dept}-${r.type}`;
    m[key] = m[key] || { month: r.month, dept: r.dept, type: r.type, docs: 0, qty: 0, amount: 0 };
    m[key].docs += 1; m[key].qty += r.qty; m[key].amount += r.amount;
    return m;
  }, {})).sort((a, b) => `${a.month}${a.dept}${a.type}`.localeCompare(`${b.month}${b.dept}${b.type}`));
  return (
    <>
      <div className="section-title">RO / RI Document & Billing by Dept</div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={Undo2} label="RI Documents" value={riRows.length} sub="รับสินค้ากลับ" variant="plan" />
        <LpCard icon={Truck} label="RO Documents" value={roRows.length} sub="นำสินค้าไปส่งลูกค้า" variant="good" />
        <LpCard icon={FileText} label="Billing Amount" value={summary.reduce((a, r) => a + r.amount, 0).toLocaleString()} sub="บาท / เดือนตาม Dept" variant="info" />
        <LpCard icon={Database} label="Departments" value={new Set(rows.map((r) => r.dept)).size} sub="หน่วยงานที่ถูกคิดเงิน" variant="plan" />
      </div>
      <div className="table-wrap" style={{ marginBottom: 14 }}><table><thead><tr><th>Month</th><th>Dept</th><th>Doc Type</th><th>Documents</th><th>Qty</th><th>Charge Amount</th></tr></thead><tbody>{summary.map((r) => <tr key={`${r.month}-${r.dept}-${r.type}`}><td className="mono">{r.month}</td><td>{r.dept}</td><td>{r.type}</td><td>{r.docs}</td><td>{r.qty}</td><td className="mono">{r.amount.toLocaleString()}</td></tr>)}</tbody></table></div>
      <div className="table-wrap"><table><thead><tr><th>Doc</th><th>Type</th><th>Month</th><th>Dept</th><th>Ref Order</th><th>Qty</th><th>Charge</th></tr></thead><tbody>{rows.map((r) => <tr key={r.doc}><td className="mono">{r.doc}</td><td>{r.type}</td><td className="mono">{r.month}</td><td>{r.dept}</td><td className="mono">{r.ref}</td><td>{r.qty}</td><td className="mono">{r.amount.toLocaleString()}</td></tr>)}</tbody></table></div>
    </>
  );
}

function ExternalWarehouseDashboard({ stock = [], platformOrders = [], poList = [] }) {
  const extRows = [
    { wh: "External WH Bangna", inbound: 420, outbound: 365, used: 72, cost: 128500 },
    { wh: "External WH Ladkrabang", inbound: 310, outbound: 298, used: 64, cost: 96500 },
    { wh: "Cross-Dock Partner", inbound: 188, outbound: 220, used: 48, cost: 55200 },
  ];
  const totalIn = extRows.reduce((a, r) => a + r.inbound, 0);
  const totalOut = extRows.reduce((a, r) => a + r.outbound, 0);
  const avgUtil = extRows.reduce((a, r) => a + r.used, 0) / extRows.length;
  const trend = ["W1", "W2", "W3", "W4"].map((w, i) => ({ week: w, inbound: Math.round(totalIn * (0.18 + i * 0.04)), outbound: Math.round(totalOut * (0.2 + i * 0.035)), util: Math.round(avgUtil + (i - 1) * 3) }));
  return (
    <>
      <div className="section-title">External Warehouse Dashboard</div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <LpCard icon={ScanLine} label="Total Inbound Order" value={totalIn.toLocaleString()} sub="External WH" variant="plan" />
        <LpCard icon={Truck} label="Total Outbound Order" value={totalOut.toLocaleString()} sub="External WH" variant="good" />
        <LpCard icon={Gauge} label="Utilization" value={`${avgUtil.toFixed(1)}%`} sub="Average capacity usage" variant="info" progress={avgUtil} />
        <LpCard icon={FileText} label="Monthly Charge" value={extRows.reduce((a, r) => a + r.cost, 0).toLocaleString()} sub="บาท" variant="plan" />
      </div>
      <div className="grid g3" style={{ marginBottom: 14 }}>
        {extRows.map((r) => {
          const free = Math.max(0, 100 - r.used);
          const donut = [{ name: "Used", value: r.used, color: "#3E7EE0" }, { name: "Free", value: free, color: "#DCE7F5" }];
          return (
            <div className="lp-panel" key={r.wh}>
              <h3>{r.wh}</h3>
              <div className="inventory-donut-wrap" style={{ minHeight: 190 }}>
                <div className="inventory-donut-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={donut} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={2}>{donut.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie><Tooltip {...lightTooltip} /></PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center"><b>{free}%</b><span>Free</span></div>
                </div>
                <div className="category-legend" style={{ flex: 1 }}>
                  <div><span style={{ background: "#3E7EE0" }} /> Used Space <b>{r.used}%</b></div>
                  <div><span style={{ background: "#DCE7F5" }} /> Free Space <b>{free}%</b></div>
                  <div><span style={{ background: "#20C766" }} /> In/Out <b>{r.inbound}/{r.outbound}</b></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid g2" style={{ marginBottom: 14 }}>
        <div className="lp-panel"><h3>Inbound / Outbound Trend</h3><ResponsiveContainer width="100%" height={250}><LineChart data={trend}><CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip {...lightTooltip} /><Line type="monotone" dataKey="inbound" stroke="#2F67FF" strokeWidth={3} /><Line type="monotone" dataKey="outbound" stroke="#20C766" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        <div className="lp-panel"><h3>Utilization by External WH</h3><ResponsiveContainer width="100%" height={250}><BarChart data={extRows} layout="vertical" margin={{ left: 24, right: 12 }}><CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} /><YAxis type="category" dataKey="wh" width={130} /><Tooltip {...lightTooltip} /><Bar dataKey="used" fill="#3E7EE0" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="table-wrap"><table><thead><tr><th>External WH</th><th>Inbound</th><th>Outbound</th><th>Utilization</th><th>Charge</th></tr></thead><tbody>{extRows.map((r) => <tr key={r.wh}><td>{r.wh}</td><td>{r.inbound}</td><td>{r.outbound}</td><td>{utilizationBar(r.used)}</td><td className="mono">{r.cost.toLocaleString()}</td></tr>)}</tbody></table></div>
    </>
  );
}

function Productivity({ users, setUsers }) {
  const [role, setRole] = useState("ALL");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Picking" });
  const roles = ["Receiving", "Putaway", "Picking", "Packing"];

  const withTier = roles.flatMap((r) => {
    const list = users.filter((u) => u.role === r).sort((a, b) => b.linesPerHour - a.linesPerHour);
    return list.map((u, i) => ({ ...u, tier: i === 0 ? "Gold" : i <= Math.ceil(list.length / 2) ? "Silver" : "Bronze" }));
  });
  const filtered = role === "ALL" ? withTier : withTier.filter((u) => u.role === role);
  const hours = ["08", "09", "10", "11", "13", "14", "15", "16"];
  const productivityHours = Array.from({ length: 25 }, (_, i) => String(i).padStart(2, "0"));
  const productivityRows = productivityHours.map((h, idx) => {
    const wave = Math.max(0, Math.sin(((idx - 6) / 24) * Math.PI));
    const rush = [9, 10, 11, 14, 15, 16, 20].includes(idx) ? 1 : 0;
    const orderQty = Math.round(8 + wave * 72 + rush * 18 + (idx % 4) * 4);
    const pieceQty = Math.round(orderQty * (7 + (idx % 5) * 1.6));
    return { hour: `${h}:00`, orderQty, pieceQty };
  });
  const maxOrderQty = Math.max(...productivityRows.map((r) => r.orderQty), 1);
  const maxPieceQty = Math.max(...productivityRows.map((r) => r.pieceQty), 1);
  const hourlyRows = hours.map((h, idx) => {
    const row = { hour: `${h}:00` };
    filtered.slice(0, 5).forEach((u, ui) => { row[u.name] = Math.max(0, Math.round((u.linesPerHour / 8) * (0.75 + ((idx + ui) % 4) * 0.12))); });
    return row;
  });

  const addUser = () => {
    if (!form.name) return;
    setUsers((list) => [...list, { id: `EMP-${rand(200, 999)}`, name: form.name, role: form.role, linesPerHour: rand(60, 120), accuracy: +(rand(950, 999) / 10).toFixed(1), tasksToday: rand(10, 40) }]);
    setAddOpen(false); setForm({ name: "", role: "Picking" });
  };

  return (
    <>
      <div style={{ marginBottom: 14 }}><button className="btn" onClick={() => setAddOpen(true)}><Users size={13} /> Setup User ใหม่</button></div>
      <div className="lp-panel productivity-dashboard-panel" style={{ marginBottom: 14 }}>
        <div className="productivity-head">
          <div>
            <h3>Productivity Dashboard</h3>
            <div className="kpi-sub">Bi-directional hourly chart · 00:00 ถึง 24:00 · ซ้าย = Order · ขวา = Pieces</div>
          </div>
          <div className="productivity-legend">
            <span><i className="order"></i> Order</span>
            <span><i className="piece"></i> Pieces</span>
          </div>
        </div>
        <div className="productivity-mirror-chart">
          {productivityRows.map((r) => (
            <div className="productivity-mirror-row" key={r.hour}>
              <div className="mirror-side mirror-left">
                <span className="mirror-value mono">{r.orderQty}</span>
                <div className="mirror-track"><div className="mirror-bar order" style={{ width: `${Math.max(4, (r.orderQty / maxOrderQty) * 100)}%` }} /></div>
              </div>
              <div className="mirror-time mono">{r.hour}</div>
              <div className="mirror-side mirror-right">
                <div className="mirror-track"><div className="mirror-bar piece" style={{ width: `${Math.max(4, (r.pieceQty / maxPieceQty) * 100)}%` }} /></div>
                <span className="mirror-value mono">{r.pieceQty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="strategy-toolbar">
        <span className={`chip ${role === "ALL" ? "active" : ""}`} onClick={() => setRole("ALL")}>ทุกแผนก</span>
        {roles.map((r) => (<span key={r} className={`chip ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>{r}</span>))}
      </div>
      <div className="grid g2" style={{ marginBottom: 14 }}>
        <div className="lp-panel">
          <h3>Productivity รายชั่วโมง / รายคน</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyRows} margin={{ top: 8, right: 18, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#E8EEF7" strokeDasharray="3 3" />
              <XAxis dataKey="hour" stroke="#8B96A8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#8B96A8" tick={{ fontSize: 10 }} />
              <Tooltip {...lightTooltip} />
              {filtered.slice(0, 5).map((u, i) => <Line key={u.id} type="monotone" dataKey={u.name} stroke={["#2F67FF", "#20C766", "#FFAA1F", "#15B8C8", "#F15B71"][i]} strokeWidth={2.5} dot={false} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lp-panel">
          <h3>Top Performer Today</h3>
          {filtered.slice().sort((a, b) => b.tasksToday - a.tasksToday).slice(0, 6).map((u) => <div className="recall-row" key={u.id}><span>{u.name} · {u.role}</span><span className="mono">{u.tasksToday} tasks · {u.accuracy}%</span></div>)}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>รหัส</th><th>ชื่อ</th><th>แผนก</th><th>Lines/Hour</th><th>ความแม่นยำ</th><th>งานวันนี้</th><th>Tier</th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.id}</td><td>{u.name}</td><td>{u.role}</td><td className="mono">{u.linesPerHour}</td><td>{u.accuracy}%</td><td>{u.tasksToday}</td>
                <td><span className={`tier-badge ${u.tier}`}>{u.tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addOpen && (
        <Modal onClose={() => setAddOpen(false)} width={380}>
          <h2>Setup User ใหม่</h2>
          <div className="field"><label>ชื่อพนักงาน</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>แผนก</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r}>{r}</option>)}</select></div>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={addUser}>เพิ่มพนักงาน</button>
        </Modal>
      )}
    </>
  );
}

/* ================================================================== */
/* INTEGRATIONS + DISPATCH PLANNING + AI LOG                           */
/* ================================================================== */

function Integrations() {
  const [status, setStatus] = useState(() => SYSTEMS.map(() => ({ online: Math.random() > 0.12, latency: rand(8, 120) })));
  const toggle = (i) => setStatus((s) => s.map((x, idx) => (idx === i ? { ...x, online: !x.online } : x)));
  return (
    <>
      <div className="section-title">System Integration Status</div>
      <div className="grid g2">
        {SYSTEMS.map((sys, i) => {
          const st = status[i]; const Icon = sys.icon;
          return (
            <div className="sys-card clickable" key={sys.name} onClick={() => toggle(i)}>
              <div className="sys-ic"><Icon size={18} color="var(--amber)" /></div>
              <div><div className="sys-name">{sys.name}</div><div className="sys-vendor">{sys.vendor}</div></div>
              <div className="sys-status">
                <div className={`status-pill ${st.online ? "on" : "off"}`}>{st.online ? <Wifi size={12} /> : <WifiOff size={12} />} {st.online ? "Online" : "Offline — Fallback Mode"}</div>
                {st.online && <div className="latency">{st.latency}ms</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="kpi-sub" style={{ marginTop: 14 }}>คลิกที่การ์ดเพื่อจำลองสถานะ Online/Offline</div>
    </>
  );
}

function DispatchPlanning({ platformOrders, setPlatformOrders }) {
  const today = platformOrders.filter((o) => o.date === "2569-07-08");
  const slots = ["12:00", "16:00"];
  const [dispatched, setDispatched] = useState({});

  return (
    <>
      <div className="kpi-sub" style={{ marginBottom: 16 }}>WMS ส่งข้อมูลจำนวน Order และปริมาตร (Cube) ต่อรอบตัดจ่ายให้ TMS จัดรถ และรับ Order ใหม่จาก OMS อัตโนมัติ</div>
      <div className="grid g2">
        {slots.map((slot) => {
          const orders = today.filter((o) => o.slot === slot);
          const cube = +orders.reduce((a, o) => a + o.cube, 0).toFixed(2);
          const trucks = Math.max(1, Math.ceil(cube / 8));
          const byArea = {};
          orders.forEach((o) => { byArea[o.area] = (byArea[o.area] || 0) + 1; });
          return (
            <div className="card" key={slot}>
              <h3>รอบตัดจ่าย {slot}</h3>
              <div className="kpi-val">{orders.length} Order</div>
              <div className="kpi-sub" style={{ marginBottom: 10 }}>ปริมาตรรวม ~{cube} CBM · แนะนำ {trucks} คัน</div>
              {Object.entries(byArea).map(([a, c]) => (<div className="recall-row" key={a}><span>{a}</span><span className="mono">{c} Order</span></div>))}
              <button className="btn" style={{ marginTop: 12, width: "100%", justifyContent: "center" }} disabled={dispatched[slot]} onClick={() => setDispatched((d) => ({ ...d, [slot]: true }))}>
                {dispatched[slot] ? "ส่งให้ TMS แล้ว" : "ส่งข้อมูลไป TMS"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function AILog({ log }) {
  const icons = { ai: BrainCircuit, exception: AlertTriangle, robot: Bot, system: Gauge };
  return (
    <>
      <div className="section-title">AI Decision Engine — Live Log</div>
      <div className="card">
        {log.map((l, i) => {
          const Icon = icons[l.tag] || BrainCircuit;
          return (<div className="log-item" key={i}><div className={`log-ic ${l.tag}`}><Icon size={14} /></div><div><div className="log-text">{l.text}</div><div className="log-time">{l.t.toLocaleTimeString("th-TH")}</div></div></div>);
        })}
      </div>
    </>
  );
}

/* ================================================================== */
/* GLOBAL STYLE                                                         */
/* ================================================================== */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Sarabun:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      .wms-app { --bg:#EDF1F6; --panel:#FFFFFF; --panel-raised:#F3F6FA; --border:#D6DEE8; --text:#1F2937; --muted:#6B7688; --amber:#3E7EE0; --teal:#17A9C0; --danger:#F15B71; --success:#3EC775; --navy:#16233D; --orange:#F5A83C; --purple:#9B6FD1;
        font-family:'Sarabun','Noto Sans Thai','Leelawadee UI',Tahoma,Arial,sans-serif; background:var(--bg); color:var(--text); border-radius:14px; overflow:hidden; display:flex; min-height:800px; border:1px solid var(--border); }
      .wms-app * { box-sizing:border-box; }
      .login-page{--bg:#EDF1F6;--panel:#FFFFFF;--panel-raised:#F3F6FA;--border:#D6DEE8;--text:#1F2937;--muted:#6B7688;--amber:#3E7EE0;--teal:#17A9C0;--danger:#F15B71;--success:#3EC775;--navy:#16233D;min-height:100vh;background:radial-gradient(circle at 30% 10%,rgba(23,169,192,.16),transparent 30%),var(--bg);display:flex;align-items:center;justify-content:center;padding:24px;color:var(--text);font-family:'Sarabun','Noto Sans Thai','Leelawadee UI',Tahoma,Arial,sans-serif;}
      .login-panel{width:min(420px,100%);background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:28px;box-shadow:0 22px 70px rgba(22,35,61,.18);}
      .login-panel h1{font-family:'Space Grotesk';font-size:24px;margin:0 0 4px;}
      .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'JetBrains Mono',monospace;}
      .sidebar{width:250px;flex-shrink:0;background:var(--navy);border-right:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;padding:20px 14px;overflow-y:auto;}
      .sidebar .brand-text .t1{color:#FFFFFF;}
      .sidebar .brand-text .t2{color:rgba(255,255,255,0.55);}
      .sidebar .nav-group-header{color:rgba(255,255,255,0.4);}
      .sidebar .navitem{color:rgba(255,255,255,0.75);}
      .sidebar .navitem:hover{background:rgba(255,255,255,0.08);color:#FFFFFF;}
      .sidebar .navitem.active{background:rgba(255,255,255,0.16);color:#FFFFFF;border-color:rgba(255,255,255,0.22);}
      .sidebar .sidebar-foot{border-top:1px solid rgba(255,255,255,0.12);}
      .sidebar .sidebar-foot .lbl{color:rgba(255,255,255,0.45);}
      .sidebar .sidebar-foot .val{color:#7FB0F0;}
      .brand{display:flex;align-items:center;gap:10px;padding:4px 10px 20px;}
      .brand-mark{width:34px;height:34px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 1px 3px rgba(22,35,61,0.35));}
      .brand-text .t1{font-family:'Space Grotesk';font-weight:700;font-size:14.5px;letter-spacing:.02em;color:var(--navy);} .brand-text .t2{font-size:11px;color:var(--muted);}
      .navlist{display:flex;flex-direction:column;gap:2px;}
      .nav-group-header{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);opacity:.7;margin:14px 10px 5px;}
      .navlist>div:first-child .nav-group-header{margin-top:2px;}
      .navitem{display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:8px;cursor:pointer;color:var(--muted);font-size:13px;border:1px solid transparent;}
      .navitem:hover{background:var(--panel-raised);color:var(--text);}
      .navitem.active{background:rgba(62,126,224,0.22);color:var(--amber);border-color:rgba(62,126,224,0.3);}
      .sidebar-foot{margin-top:auto;padding:12px 10px;border-top:1px solid var(--border);}
      .sidebar-foot .lbl{font-size:10.5px;color:var(--muted);} .sidebar-foot .val{font-size:12.5px;color:var(--teal);font-family:'JetBrains Mono';}
      .main{flex:1;display:flex;flex-direction:column;min-width:0;}
      .topbar{height:60px;flex-shrink:0;display:flex;align-items:center;gap:16px;padding:0 22px;border-bottom:1px solid var(--border);background:rgba(23,30,38,0.5);}
      .topbar h1{font-family:'Space Grotesk';font-size:15.5px;font-weight:600;margin:0;}
      .mode-switch{display:flex;background:var(--panel-raised);border-radius:8px;padding:3px;gap:2px;}
      .mode-btn{padding:6px 12px;border-radius:6px;font-size:12px;color:var(--muted);cursor:pointer;border:none;background:none;font-family:'Sarabun';}
      .mode-btn.active{background:var(--amber);color:#2B2B2B;font-weight:600;}
      .topbar-right{margin-left:auto;display:flex;align-items:center;gap:14px;}
      .clock{font-family:'JetBrains Mono';font-size:13px;color:var(--muted);}
      .ai-pill{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--teal);background:rgba(23,169,192,0.1);border:1px solid rgba(23,169,192,0.3);padding:5px 10px;border-radius:20px;}
      .ai-pill .dot{width:6px;height:6px;border-radius:50%;background:var(--teal);animation:pulse 1.8s infinite;}
      .export-btn{gap:6px;white-space:nowrap;}
      @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(23,169,192,.5);}70%{box-shadow:0 0 0 6px rgba(23,169,192,0);}100%{box-shadow:0 0 0 0 rgba(23,169,192,0);}}
      .content{flex:1;overflow-y:auto;padding:24px;}
      .content::-webkit-scrollbar{width:8px;} .content::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
      .grid{display:grid;gap:14px;} .g4{grid-template-columns:repeat(4,1fr);} .g3{grid-template-columns:repeat(3,1fr);} .g2{grid-template-columns:repeat(2,1fr);}
      @media (max-width:1000px){.g4,.g3,.g2{grid-template-columns:1fr 1fr;}}
      .card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;}
      .card.clickable{cursor:pointer;transition:border-color .15s;} .card.clickable:hover{border-color:var(--amber);}
      .card.sel{border-color:var(--teal);box-shadow:0 0 0 1px var(--teal);}
      .card h3{margin:0 0 4px;font-size:12.5px;color:var(--muted);font-weight:500;}
      .kpi-val{font-family:'Space Grotesk';font-size:26px;font-weight:700;margin:6px 0 2px;}
      .kpi-sub{font-size:11.5px;color:var(--muted);} .kpi-sub b{color:var(--success);}
      .item-cell{display:flex;flex-direction:column;gap:2px;min-width:128px;line-height:1.28;}
      .item-cell .mono{font-size:11px;font-weight:800;color:var(--teal);letter-spacing:.02em;}
      .item-cell b{font-size:12.5px;font-weight:650;color:var(--text);}
      .item-heading{margin:8px 0 12px;}
      .progress-track{height:6px;background:var(--panel-raised);border-radius:4px;margin-top:10px;overflow:hidden;}
      .progress-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--amber),var(--teal));}
      .inventory-overview-table th,.inventory-overview-table td{white-space:nowrap;vertical-align:middle;}
      .inventory-overview-table td:nth-child(6){min-width:240px;white-space:normal;}
      .util-cell{min-width:120px;}
      .util-cell span{display:block;font-family:'JetBrains Mono';font-size:11px;font-weight:700;color:var(--text);margin-bottom:5px;}
      .util-track{height:8px;border-radius:999px;background:var(--panel-raised);border:1px solid var(--border);overflow:hidden;}
      .util-track i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--success),var(--amber));}
      .util-track.age-ok i{background:var(--success);}
      .util-track.age-warn i{background:var(--amber);}
      .util-track.age-risk i{background:var(--danger);}
      .section-title{font-family:'Space Grotesk';font-size:13.5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:28px 0 12px;}
      .section-title:first-child{margin-top:0;}
      .pipeline{display:flex;align-items:stretch;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:18px 20px;overflow-x:auto;}
      .p-stage{flex:1;min-width:130px;padding:0 14px;position:relative;}
      .p-stage:not(:last-child)::after{content:'';position:absolute;right:-2px;top:50%;transform:translateY(-50%);width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:6px solid var(--border);}
      .p-stage .lbl{font-size:11.5px;color:var(--muted);margin-bottom:6px;} .p-stage .cnt{font-family:'Space Grotesk';font-size:22px;font-weight:700;}
      .p-bar{height:4px;border-radius:3px;background:var(--panel-raised);margin-top:8px;overflow:hidden;} .p-bar i{display:block;height:100%;background:var(--amber);}
      table{width:100%;border-collapse:collapse;font-size:13px;}
      th{text-align:left;font-size:11px;color:#FFFFFF;background:var(--navy);text-transform:uppercase;letter-spacing:.04em;padding:9px 10px;border-bottom:1px solid var(--border);font-weight:600;}
      thead tr:first-child th:first-child{border-radius:8px 0 0 0;} thead tr:first-child th:last-child{border-radius:0 8px 0 0;}
      td{padding:10px 10px;border-bottom:1px solid var(--border);} tr:last-child td{border-bottom:none;}
      tr.clickable{cursor:pointer;} tr.clickable:hover{background:var(--panel-raised);}
      .table-wrap{background:var(--panel);border:1px solid var(--border);border-radius:12px;overflow:hidden;overflow-x:auto;}
      .badge{font-size:11px;padding:2px 8px;border-radius:10px;font-weight:600;}
      .badge.A{background:rgba(241,91,113,0.24);color:var(--danger);} .badge.B{background:rgba(62,126,224,0.24);color:var(--amber);} .badge.C{background:rgba(139,150,165,0.24);color:var(--muted);}
      .search-box{display:flex;align-items:center;gap:8px;background:var(--panel-raised);border:1px solid var(--border);border-radius:8px;padding:8px 12px;margin-bottom:14px;max-width:340px;}
      .search-box input{background:none;border:none;outline:none;color:var(--text);font-size:13px;width:100%;font-family:'Sarabun';}
      .tabs{display:flex;gap:4px;margin-bottom:18px;border-bottom:1px solid var(--border);flex-wrap:wrap;}
      .tab{padding:9px 15px;font-size:12.5px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;display:flex;align-items:center;}
      .tab.active{color:var(--amber);border-color:var(--amber);font-weight:600;}
      .field{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
      .field label{font-size:11.5px;color:var(--muted);}
      .field input,.field select,.field textarea{background:var(--panel-raised);border:1px solid var(--border);border-radius:7px;padding:8px 10px;color:var(--text);font-family:'Sarabun';font-size:13px;outline:none;}
      .field input:disabled{opacity:.6;}
      .text-input{background:var(--panel-raised);border:1px solid var(--border);border-radius:7px;padding:8px 10px;color:var(--text);font-family:'Sarabun';font-size:13px;outline:none;}
      .text-input:focus{border-color:var(--teal);box-shadow:0 0 0 2px rgba(47,212,196,.14);}
      .media-preview{width:100%;max-height:220px;background:#111827;border:1px solid var(--border);border-radius:8px;object-fit:cover;}
      .media-empty{height:180px;border:1px dashed var(--border);border-radius:8px;background:var(--panel-raised);display:flex;align-items:center;justify-content:center;gap:8px;color:var(--muted);font-size:12.5px;}
      .po-row{display:flex;align-items:center;gap:14px;padding:14px;background:var(--panel);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;}
      .po-row .po-id{font-family:'JetBrains Mono';font-size:13px;color:var(--teal);}
      .po-info{flex:1;} .po-info .sup{font-size:13px;font-weight:500;} .po-info .meta{font-size:11.5px;color:var(--muted);margin-top:2px;}
      .btn{border:none;cursor:pointer;font-family:'Sarabun';font-weight:600;font-size:12.5px;padding:8px 14px;border-radius:7px;background:var(--amber);color:#2B2B2B;display:flex;align-items:center;gap:6px;white-space:nowrap;}
      .btn.secondary{background:var(--panel-raised);color:var(--text);border:1px solid var(--border);}
      .btn:disabled{opacity:0.5;cursor:default;}
      .link-btn{border:none;background:none;color:var(--teal);cursor:pointer;padding:0;font-size:12.5px;text-decoration:underline;text-underline-offset:2px;}
      .scan-step{font-size:11px;padding:4px 9px;border-radius:12px;background:var(--panel-raised);color:var(--muted);display:inline-flex;align-items:center;gap:4px;}
      .scan-step.done{color:var(--success);background:rgba(62,199,117,0.24);}
      .scan-step.active{color:var(--amber);background:rgba(62,126,224,0.14);}
      tr.sel-row td{background:rgba(62,126,224,.08);}
      .size-chip{display:inline-flex;min-width:34px;justify-content:center;border-radius:999px;padding:4px 9px;font-family:'JetBrains Mono';font-size:11px;font-weight:900;border:1px solid transparent;}
      .size-s{background:#EAF8F0;color:#0A7A43;border-color:#BFEBD0;}
      .size-m{background:#EEF4FF;color:#255CC7;border-color:#CFE0FF;}
      .size-l{background:#FFF6DF;color:#A46400;border-color:#F9D98A;}
      .size-xl{background:#FDECEF;color:#B4233A;border-color:#F6C3CE;}
      .age-chip{display:inline-flex;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:900;}
      .age-chip.ok{background:rgba(62,199,117,.18);color:var(--success);}
      .age-chip.warn{background:rgba(245,168,60,.18);color:var(--orange);}
      .age-chip.orange{background:rgba(245,126,60,.2);color:#D76B1B;}
      .age-chip.risk{background:rgba(241,91,113,.18);color:var(--danger);}
      .wh3d-shell{position:relative;background:#F7FAFE;border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(22,35,61,.08);}
      .wh3d-canvas{height:420px;width:100%;}
      .wh3d-canvas canvas{display:block;width:100%!important;height:420px!important;}
      .wh3d-legend{position:absolute;right:14px;top:14px;display:flex;gap:8px;flex-wrap:wrap;background:rgba(255,255,255,.88);border:1px solid var(--border);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:800;color:var(--muted);}
      .wh3d-legend span{display:inline-flex;align-items:center;gap:5px;}
      .wh3d-legend i{width:10px;height:10px;border-radius:50%;display:inline-block;}
      .wh3d-legend .blue{background:#3E7EE0;} .wh3d-legend .amber{background:#F5A83C;} .wh3d-legend .red{background:#F15B71;}
      .scan-steps-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}
      .scan-input-row{display:grid;grid-template-columns:1fr auto;gap:6px;margin-top:6px;}
      .scan-input-row .btn{padding-left:10px;padding-right:10px;}
      .allocation-filter-panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:16px;box-shadow:0 4px 14px rgba(22,35,61,.05);}
      .allocation-search{margin-bottom:12px;max-width:none;}
      .allocation-filter-grid{display:grid;grid-template-columns:repeat(7,minmax(130px,1fr));gap:10px;align-items:end;}
      .allocation-filter-grid .field{margin-bottom:0;}
      .allocation-filter-grid label{white-space:nowrap;}
      .allocation-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px;}
      .allocation-meta span{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--border);background:var(--panel-raised);border-radius:999px;padding:3px 8px;font-size:10.5px;color:var(--muted);}
      .allocation-shortage{display:flex;align-items:center;gap:8px;background:rgba(241,91,113,.1);border:1px solid rgba(241,91,113,.28);color:var(--danger);border-radius:10px;padding:9px 11px;font-size:12px;font-weight:700;margin-bottom:10px;}
      .allocation-progress-strip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:12px;}
      .allocation-progress-strip div{background:var(--panel-raised);border:1px solid var(--border);border-radius:10px;padding:9px 10px;}
      .allocation-progress-strip span{display:block;font-size:10.5px;color:var(--muted);font-weight:700;margin-bottom:3px;}
      .allocation-progress-strip b{font-family:'Space Grotesk';font-size:20px;color:var(--navy);}
      .allocation-event-log{margin-top:12px;border-top:1px dashed var(--border);padding-top:10px;}
      .allocation-event{display:grid;grid-template-columns:155px 140px 1fr;gap:10px;align-items:center;font-size:12px;padding:6px 0;border-bottom:1px solid rgba(214,222,232,.55);}
      .allocation-event:last-child{border-bottom:0;}
      .allocation-event b{color:var(--teal);}
      .allocation-event em{font-style:normal;color:var(--muted);}
      .prework-priority-row.urgent{background:rgba(241,91,113,.13);}
      .prework-priority-row.replenish{background:rgba(245,168,60,.15);}
      .prework-priority-row.normal{background:rgba(62,126,224,.10);}
      .prework-priority-row.done{background:rgba(62,199,117,.14);}
      .prework-priority-badge{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:4px 9px;font-size:11px;font-weight:900;white-space:nowrap;}
      .prework-priority-badge.urgent{background:#F15B71;color:#FFFFFF;}
      .prework-priority-badge.replenish{background:#F5A83C;color:#2F2200;}
      .prework-priority-badge.normal{background:#3E7EE0;color:#FFFFFF;}
      .prework-priority-badge.done{background:#3EC775;color:#FFFFFF;}
      .prework-flow-board{display:grid;grid-template-columns:repeat(5,minmax(190px,1fr));gap:12px;margin-bottom:20px;overflow-x:auto;}
      .prework-flow-col{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:12px;min-height:235px;}
      .prework-flow-head{display:flex;gap:8px;align-items:flex-start;margin-bottom:10px;color:var(--teal);}
      .prework-flow-head b{display:block;font-size:12.5px;color:var(--text);}
      .prework-flow-head span{display:block;font-size:10.5px;color:var(--muted);line-height:1.35;margin-top:2px;}
      .prework-flow-list{display:flex;flex-direction:column;gap:8px;}
      .prework-flow-card{border:1px solid var(--border);background:var(--panel-raised);border-radius:10px;padding:9px;display:flex;flex-direction:column;gap:3px;}
      .prework-flow-card.urgent{border-color:rgba(241,91,113,.4);background:rgba(241,91,113,.12);}
      .prework-flow-card.replenish{border-color:rgba(245,168,60,.45);background:rgba(245,168,60,.13);}
      .prework-flow-card.normal{border-color:rgba(62,126,224,.35);background:rgba(62,126,224,.1);}
      .prework-flow-card.done{border-color:rgba(62,199,117,.45);background:rgba(62,199,117,.13);}
      .prework-flow-card strong{font-family:'JetBrains Mono';font-size:11px;color:var(--teal);}
      .prework-flow-card span{font-size:12px;font-weight:700;color:var(--text);line-height:1.35;}
      .prework-flow-card em{font-style:normal;font-size:10.5px;color:var(--muted);}
      .prework-flow-card small{font-size:10.5px;color:var(--muted);line-height:1.35;}
      .prework-flow-empty{border:1px dashed var(--border);border-radius:10px;padding:14px;text-align:center;color:var(--muted);font-size:11.5px;}
      .prework-machine-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr) auto;gap:10px;align-items:end;}
      .prework-machine-grid .field{margin-bottom:0;}
      .handheld-shell{display:flex;gap:16px;align-items:flex-start;}
      .handheld-phone{width:360px;max-width:100%;background:#101828;color:#F8FAFC;border-radius:22px;padding:16px;border:1px solid #23324D;box-shadow:0 18px 45px rgba(16,24,40,.22);}
      .handheld-phone .field label{color:#CBD5E1;}
      .handheld-phone select,.handheld-phone .text-input{width:100%;background:#FFFFFF;color:#1F2937;border-color:#334155;}
      .handheld-top{display:flex;align-items:center;justify-content:center;gap:7px;font-family:'Space Grotesk';font-weight:800;margin-bottom:14px;color:#FFFFFF;}
      .handheld-job-card{background:#17243A;border:1px solid #2E4264;border-radius:14px;padding:12px;margin-bottom:12px;display:flex;flex-direction:column;gap:4px;}
      .handheld-job-card b{font-size:14px;color:#7DD3FC;}
      .handheld-job-card span{font-size:12px;color:#DDE7F4;}
      .handheld-job-card em{font-style:normal;font-family:'JetBrains Mono';color:#86EFAC;font-size:12px;margin-top:3px;}
      .console-hero{display:flex;justify-content:space-between;gap:18px;align-items:center;background:linear-gradient(135deg,#EEF4FF,#FFFFFF);border:1px solid #D7E4FF;border-radius:14px;padding:18px;margin-bottom:18px;}
      .console-hero h3{margin:0 0 6px;font-size:16px;color:var(--navy);}
      .console-hero p{margin:0;color:var(--muted);font-size:13px;line-height:1.6;}
      .console-pack-target{min-width:250px;background:#FFFFFF;border:1px solid var(--border);border-radius:14px;padding:15px;display:flex;flex-direction:column;gap:5px;align-items:flex-start;box-shadow:0 8px 22px rgba(22,35,61,.06);}
      .console-pack-target span{font-size:11px;color:var(--muted);font-weight:800;}
      .console-pack-target b{font-family:'Space Grotesk';font-size:18px;color:var(--teal);}
      .console-order-card{margin-bottom:14px;}
      .console-order-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
      .console-flow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--panel-raised);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px;}
      .console-floor-node{border:1px solid #CFE0FF;background:#FFFFFF;color:#25314F;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;}
      .console-floor-node.target{background:#ECFAF2;border-color:#C8F1D9;color:#0A7A43;}
      .synnex-rule-hero{display:flex;justify-content:space-between;gap:18px;align-items:center;background:linear-gradient(135deg,#EEF4FF,#FFFFFF);border:1px solid #CFE0FF;border-radius:14px;padding:20px;margin-bottom:18px;}
      .synnex-rule-hero h2{font-family:'Space Grotesk';font-size:24px;margin:0 0 6px;color:#103A8C;}
      .synnex-rule-hero p{margin:0;color:var(--muted);font-size:13px;line-height:1.55;}
      .synnex-id-preview{background:#FFFFFF;border:1px solid #CFE0FF;border-radius:14px;padding:16px 20px;text-align:center;min-width:240px;box-shadow:0 8px 24px rgba(62,126,224,.12);}
      .synnex-id-preview span{display:block;font-size:12px;color:var(--muted);font-weight:700;margin-bottom:5px;}
      .synnex-id-preview b{display:block;font-family:'Space Grotesk';font-size:28px;color:#103A8C;line-height:1;}
      .synnex-id-preview small{display:block;font-family:'JetBrains Mono';color:var(--teal);font-weight:700;margin-top:7px;}
      .synnex-code-card h3{color:#103A8C;}
      .synnex-digits{display:flex;align-items:center;gap:6px;font-family:'Space Grotesk';font-weight:800;font-size:24px;margin:10px 0;color:#103A8C;}
      .synnex-digits i,.synnex-digits em,.synnex-digits strong{font-style:normal;border:1px solid var(--border);border-radius:8px;padding:6px 10px;background:#FFFFFF;}
      .synnex-digits i{color:#2F67FF;}.synnex-digits em{color:#0A7A43;}.synnex-digits strong{color:#E8590C;}
      .receiving-track-card{border-color:#DCE4EF;box-shadow:0 3px 10px rgba(22,35,61,0.06);}
      .receiving-track-card:hover{border-color:rgba(62,126,224,.28);box-shadow:0 8px 20px rgba(22,35,61,0.08);}
      .strategy-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px;}
      .chip{font-size:11.5px;padding:6px 11px;border-radius:16px;border:1px solid var(--border);color:var(--muted);cursor:pointer;background:var(--panel);}
      .chip.active{background:var(--amber);color:#2B2B2B;border-color:var(--amber);font-weight:600;}
      .strategy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
      @media (max-width:1100px){.strategy-grid{grid-template-columns:repeat(2,1fr);}}
      .s-card{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:border-color .15s;}
      .s-card:hover{border-color:var(--amber);} .s-card.highlight{border-color:var(--teal);box-shadow:0 0 0 1px var(--teal);}
      .s-card .top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
      .s-card .idn{font-family:'JetBrains Mono';font-size:11px;color:var(--muted);}
      .s-card .name{font-family:'Space Grotesk';font-weight:600;font-size:13.5px;margin:6px 0 2px;}
      .s-card .th-name{font-size:12px;color:var(--muted);margin-bottom:8px;}
      .stars{display:flex;gap:1px;}
      .group-pill{font-size:10px;padding:2px 8px;border-radius:10px;background:color-mix(in srgb,var(--pill) 18%,transparent);color:var(--pill);border:1px solid color-mix(in srgb,var(--pill) 40%,transparent);}
      .ai-box{background:linear-gradient(135deg,rgba(62,126,224,0.08),rgba(23,169,192,0.08));border:1px solid rgba(62,126,224,0.3);border-radius:12px;padding:18px;margin-bottom:18px;}
      .ai-box .row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
      .ai-box .reason{margin-top:10px;font-size:13px;color:var(--text);line-height:1.6;}
      .profile-tag{font-size:11.5px;background:rgba(255,255,255,0.06);padding:4px 9px;border-radius:8px;color:var(--muted);}
      .modal-backdrop{--panel:#FFFFFF;--panel-raised:#F3F6FA;--border:#D6DEE8;--text:#1F2937;--muted:#6B7688;--amber:#3E7EE0;--teal:#17A9C0;--danger:#F15B71;--success:#3EC775;position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:50;}
      .modal{background:var(--panel-raised);border:1px solid var(--border);border-radius:14px;padding:26px;width:90%;max-height:85vh;overflow-y:auto;}
      .modal .close{float:right;cursor:pointer;color:var(--muted);} .modal h2{font-family:'Space Grotesk';margin:6px 0 4px;font-size:19px;}
      .confirm-modal{text-align:center;}
      .confirm-modal p{color:var(--muted);line-height:1.55;margin:8px 0 18px;}
      .confirm-icon{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;background:rgba(62,126,224,.16);color:var(--teal);}
      .confirm-icon.success{background:rgba(62,199,117,.18);color:var(--success);}
      .confirm-icon.danger{background:rgba(241,91,113,.18);color:var(--danger);}
      .confirm-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
      .mini-stat{background:var(--panel);border:1px solid var(--border);border-radius:9px;padding:10px 12px;}
      .mini-stat .lbl{font-size:11px;color:var(--muted);} .mini-stat .val{font-size:14px;margin-top:2px;}
      .sys-card{display:flex;align-items:center;gap:12px;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:14px;}
      .sys-ic{width:38px;height:38px;border-radius:9px;background:var(--panel-raised);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .sys-name{font-size:13.5px;font-weight:500;} .sys-vendor{font-size:11px;color:var(--muted);}
      .sys-status{margin-left:auto;text-align:right;}
      .status-pill{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;justify-content:flex-end;}
      .status-pill.on{color:var(--success);} .status-pill.off{color:var(--danger);}
      .latency{font-size:10.5px;color:var(--muted);margin-top:2px;font-family:'JetBrains Mono';}
      .log-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);} .log-item:last-child{border-bottom:none;}
      .log-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
      .log-ic.ai{background:rgba(23,169,192,0.22);color:var(--teal);} .log-ic.exception{background:rgba(241,91,113,0.22);color:var(--danger);}
      .log-ic.robot{background:rgba(62,126,224,0.22);color:var(--amber);} .log-ic.system{background:rgba(139,150,165,0.22);color:var(--muted);}
      .log-text{font-size:13px;line-height:1.5;} .log-time{font-size:10.5px;color:var(--muted);font-family:'JetBrains Mono';margin-top:3px;}
      .status-badge{display:inline-flex;align-items:center;font-size:11px;font-weight:600;color:#FFFFFF;padding:3px 9px;border-radius:10px;}
      .order-status{display:inline-flex;align-items:center;justify-content:center;min-width:78px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;border:1px solid transparent;white-space:nowrap;}
      .order-status.neutral{background:#F1F5F9;color:#64748B;border-color:#D8E1EC;}
      .order-status.warning{background:#FFF3C4;color:#9A6200;border-color:#F5D56B;}
      .order-status.info{background:#E5F0FF;color:#2F67FF;border-color:#BFD6FF;}
      .order-status.success{background:#DDF8E8;color:#13884A;border-color:#AEEBC8;}
      .order-status.danger{background:#FFE2E7;color:#C62843;border-color:#F8B5C0;}
      .stat-dot{width:7px;height:7px;border-radius:50%;background:var(--sc);display:inline-block;margin-right:5px;}
      .tag-status{font-size:11px;padding:3px 9px;border-radius:10px;font-weight:600;color:#FFFFFF;}
      .tag-status.Booked{background:var(--amber);}
      .tag-status.Receiving{background:var(--amber);}
      .tag-status.Arrived{background:var(--success);}
      .tag-status.Completed{background:var(--success);}
      .tag-status.Hold{background:var(--danger);}
      .prio{font-size:11.5px;} .prio.vip{color:var(--amber);font-weight:600;} .prio.sla{color:var(--danger);font-weight:600;} .prio.normal{color:var(--muted);}
      .handheld{width:370px;max-width:100%;background:#000;border:3px solid #333;border-radius:22px;padding:16px;box-shadow:0 0 0 6px var(--panel-raised), 0 4px 14px rgba(22,35,61,0.24);}
      .handheld-screen{background:var(--panel);border-radius:10px;padding:16px;min-height:300px;overflow:hidden;}
      .handheld .receiving-date-grid{grid-template-columns:1fr;gap:0;}
      .handheld .scan-step{white-space:normal;line-height:1.35;align-items:flex-start;}
      .handheld .allocation-shortage{align-items:flex-start;line-height:1.35;}
      .recall-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
      @media (max-width:800px){.recall-split{grid-template-columns:1fr;}}
      .recall-col{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;}
      .recall-col h4{margin:0 0 10px;font-size:13px;}
      .recall-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px;}
      .recall-row:last-child{border-bottom:none;}
      .sys-tag{font-size:10.5px;padding:2px 8px;border-radius:8px;font-weight:600;}
      .sys-tag.ASRS{background:rgba(23,169,192,.24);color:var(--teal);}
      .sys-tag.Miniload{background:rgba(62,126,224,.24);color:var(--amber);}
      .sys-tag.Manual{background:rgba(139,150,165,.24);color:var(--muted);}
      .robot-step{font-size:11px;padding:3px 8px;border-radius:10px;background:var(--panel-raised);color:var(--muted);display:inline-flex;align-items:center;gap:4px;}
      .robot-step.active{color:var(--amber);background:rgba(62,126,224,.22);}
      .robot-step.done{color:var(--success);background:rgba(62,199,117,.22);}
      .tier-badge{font-size:10.5px;padding:2px 9px;border-radius:10px;font-weight:700;color:#FFFFFF;}
      .tier-badge.Gold{background:linear-gradient(135deg,#E8C158,#B8860B);}
      .tier-badge.Silver{background:linear-gradient(135deg,#C7CDD6,#8B94A0);}
      .tier-badge.Bronze{background:linear-gradient(135deg,#C88A4E,#8C5A2B);}
      .age-bucket{padding:3px 9px;border-radius:10px;font-size:11px;font-weight:600;display:inline-block;}
      .age-bucket.ok{background:rgba(62,199,117,.24);color:var(--success);}
      .age-bucket.warn{background:rgba(62,126,224,.24);color:var(--amber);}
      .age-bucket.risk{background:rgba(241,91,113,.24);color:var(--danger);}
      .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
      .cal-cell{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:8px 4px;text-align:center;}
      .cal-cell.sel{border-color:var(--amber);box-shadow:0 0 0 1px var(--amber);}
      .cal-cell .d{font-size:10px;color:var(--muted);} .cal-cell .n{font-family:'Space Grotesk';font-weight:700;font-size:15px;margin-top:4px;}
      .dock-cell{border-radius:6px;padding:5px 4px;font-size:10px;cursor:pointer;line-height:1.3;background:var(--panel-raised);color:var(--muted);border:1px solid var(--border);}
      .dock-cell.empty{color:var(--muted);opacity:.5;}
      .dock-cell.empty:hover{opacity:1;border-color:var(--amber);color:var(--amber);}
      .dock-cell.Booked{background:var(--amber);color:#FFFFFF;border-color:var(--amber);}
      .dock-cell.Arrived{background:var(--success);color:#FFFFFF;border-color:var(--success);}
      .dock-cell.Receiving{background:var(--amber);color:#FFFFFF;border-color:var(--amber);}
      .dock-cell.Completed{background:var(--success);color:#FFFFFF;border-color:var(--success);}
      .trend-chart{display:flex;align-items:flex-end;gap:8px;height:150px;padding:10px 4px 0;}
      .trend-bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;}
      .trend-bar .bar{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--amber),var(--teal));min-height:4px;}
      .trend-bar .lbl{font-size:10px;color:var(--muted);}

      /* ---------- Executive dashboard ---------- */
      .exec-dashboard{background:linear-gradient(135deg,#F8FAFF 0%,#EEF3FA 100%);margin:-24px;padding:24px;min-height:100%;color:#17213A;}
      .exec-title{font-family:'Space Grotesk';font-size:24px;font-weight:700;margin:0 0 18px;}
      .exec-kpi-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px;margin-bottom:18px;}
      .exec-kpi{background:#FFFFFF;border:1px solid #E8EEF7;border-radius:16px;padding:20px 22px;box-shadow:0 12px 30px rgba(31,41,55,.08);}
      .exec-kpi div{font-size:13px;color:#637089;font-weight:600;margin-bottom:8px;}
      .exec-kpi b{display:block;font-family:'Space Grotesk';font-size:30px;line-height:1;color:#17213A;margin-bottom:8px;}
      .exec-kpi span{font-size:12px;color:#20C766;font-weight:700;}
      .exec-kpi.tone-green b{color:#053D2A;}
      .exec-kpi.tone-amber b{color:#A65D00;}
      .exec-kpi.tone-amber span{color:#F59E0B;}
      .exec-backlog-panel{background:#FFFFFF;border:1px solid #E8EEF7;border-radius:16px;padding:18px;box-shadow:0 12px 30px rgba(31,41,55,.07);margin-bottom:18px;}
      .backlog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px;}
      .backlog-head span{font-size:12px;color:#637089;font-weight:700;}
      .backlog-total{text-align:right;background:#ECFAF2;border:1px solid #C8F1D9;border-radius:14px;padding:10px 14px;min-width:210px;}
      .backlog-total.risk{background:#FFF0F2;border-color:#FFD2D9;}
      .backlog-total b{display:block;font-family:'Space Grotesk';font-size:27px;color:#0A7A43;line-height:1;}
      .backlog-total.risk b{color:#C92D49;}
      .backlog-total span{display:block;font-size:11px;color:#637089;margin-top:4px;}
      .backlog-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;}
      .backlog-card{--tone:#2F67FF;background:#F8FBFF;border:1px solid #E8EEF7;border-radius:14px;padding:13px;min-width:0;}
      .backlog-card.tone-cyan{--tone:#15B8C8;}.backlog-card.tone-green{--tone:#20C766;}.backlog-card.tone-amber{--tone:#FFAA1F;}.backlog-card.tone-violet{--tone:#9B6FD1;}.backlog-card.tone-rose{--tone:#FF3D62;}
      .backlog-card-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;}
      .backlog-card-top span{font-size:12px;font-weight:800;color:#25314F;line-height:1.25;}
      .backlog-card-top b{font-family:'Space Grotesk';font-size:25px;color:var(--tone);line-height:1;}
      .backlog-meta{font-size:11px;color:#7B879C;margin:8px 0 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .backlog-track{height:7px;background:#E9EEF6;border-radius:999px;overflow:hidden;display:flex;}
      .backlog-track i.ok{display:block;height:100%;background:#20C766;}
      .backlog-track i.risk{display:block;height:100%;background:#FF3D62;}
      .backlog-split{display:flex;justify-content:space-between;font-size:10.5px;color:#637089;font-weight:700;margin-top:7px;}
      .exec-main-grid{display:grid;grid-template-columns:1.25fr .95fr;gap:18px;margin-bottom:18px;}
      .exec-bottom-grid{display:grid;grid-template-columns:.9fr 1.6fr;gap:18px;}
      .exec-panel{background:#FFFFFF;border:1px solid #E8EEF7;border-radius:16px;padding:18px;box-shadow:0 12px 30px rgba(31,41,55,.07);}
      .exec-panel-title{font-size:13px;font-weight:800;color:#25314F;margin-bottom:12px;}
      .exec-panel-title span{font-weight:600;color:#7B879C;}
      .task-panel{display:flex;flex-direction:column;gap:17px;}
      .task-row{display:flex;gap:12px;align-items:center;}
      .task-icon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .task-body{flex:1;min-width:0;}
      .task-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:7px;}
      .task-head b{font-family:'Space Grotesk';font-size:17px;color:#17213A;}
      .task-track{height:8px;background:#E9EEF6;border-radius:999px;overflow:hidden;}
      .task-track i{display:block;height:100%;border-radius:999px;}
      .category-wrap{display:flex;align-items:center;gap:20px;}
      .category-legend{flex:1;display:flex;flex-direction:column;gap:9px;}
      .cat-line{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:#566176;}
      .cat-line span{display:flex;align-items:center;gap:8px;}
      .cat-line i{width:9px;height:9px;border-radius:50%;display:inline-block;}
      .cat-line b{color:#17213A;font-family:'Space Grotesk';}
      .warehouse-status-body{display:grid;grid-template-columns:260px 1fr;gap:18px;align-items:stretch;}
      .warehouse-photo{min-height:150px;border-radius:14px;background:linear-gradient(135deg,rgba(22,35,61,.92),rgba(23,169,192,.62)),linear-gradient(45deg,#263A55,#111827);color:#FFFFFF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;overflow:hidden;}
      .warehouse-photo span{font-size:13px;font-weight:700;}
      .warehouse-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
      .warehouse-metrics div{background:#F7FAFF;border:1px solid #E8EEF7;border-radius:14px;padding:18px 16px;}
      .warehouse-metrics span{display:block;font-size:12px;color:#637089;margin-bottom:8px;}
      .warehouse-metrics b{font-family:'Space Grotesk';font-size:28px;color:#06462F;}
      .sales-matrix-panel{margin-top:18px;}
      .sales-matrix{display:grid;grid-template-columns:170px repeat(3,minmax(150px,1fr)) 150px;gap:8px;}
      .matrix-head{background:#EEF4FF;border:1px solid #D7E4FF;border-radius:10px;padding:9px 10px;font-size:11.5px;font-weight:800;color:#25314F;text-align:center;}
      .matrix-row-title{border-radius:10px;padding:14px 12px;font-size:13px;font-weight:900;color:#FFFFFF;display:flex;align-items:center;line-height:1.15;}
      .matrix-row-title.fast{background:#20C766;}
      .matrix-row-title.medium{background:#2F67FF;}
      .matrix-row-title.slow{background:#FFAA1F;color:#17213A;}
      .matrix-cell,.matrix-total{background:#F8FBFF;border:1px solid #E8EEF7;border-radius:10px;padding:11px 12px;min-height:118px;}
      .matrix-cell b,.matrix-total b{display:block;font-family:'Space Grotesk';font-size:24px;color:#17213A;line-height:1;}
      .matrix-cell span,.matrix-total span{display:block;font-size:10.5px;color:#637089;font-weight:800;margin-top:2px;}
      .matrix-cell em,.matrix-total em{display:block;font-style:normal;font-size:11.5px;color:#2F67FF;font-weight:800;margin-top:8px;}
      .matrix-cell small,.matrix-total small{display:block;font-size:10.5px;color:#7B879C;font-weight:800;margin-top:3px;}
      .matrix-brands{margin-top:8px;font-size:11.5px;font-weight:900;color:#17213A;line-height:1.25;}
      .matrix-items{margin-top:3px;font-size:10.5px;font-weight:700;color:#637089;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
      .matrix-total{background:#FFF7E8;border-color:#FFE2AE;}
      .exec-inventory-grid{display:grid;grid-template-columns:minmax(520px,1fr) minmax(640px,1.18fr);gap:18px;margin-top:18px;align-items:stretch;}
      .inventory-summary-strip{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
      .inventory-pill{min-width:130px;border-radius:13px;padding:10px 12px;background:#F7FAFF;border:1px solid #E8EEF7;}
      .inventory-pill span{display:block;font-size:11px;color:#637089;font-weight:700;margin-bottom:3px;}
      .inventory-pill b{font-family:'Space Grotesk';font-size:20px;color:#17213A;}
      .inventory-pill.used{background:#EEF4FF;border-color:#CFE0FF;}
      .inventory-pill.used b{color:#2F67FF;}
      .inventory-pill.free{background:#ECFAF2;border-color:#C8F1D9;}
      .inventory-pill.free b{color:#0A7A43;}
      .inventory-pill.stock{background:#FFF7E8;border-color:#FFE2AE;}
      .inventory-pill.stock b{color:#A65D00;}
      .inventory-donut-wrap{display:flex;align-items:center;gap:18px;min-height:250px;}
      .donut-pair-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;min-width:0;}
      .compact-donut-wrap{display:grid;grid-template-rows:auto 1fr;gap:12px;align-items:center;justify-items:center;min-height:300px;}
      .compact-donut-wrap .inventory-legend{width:100%;}
      .inventory-donut-chart{position:relative;width:178px;height:178px;flex-shrink:0;}
      .donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;}
      .donut-center b{font-family:'Space Grotesk';font-size:24px;color:#17213A;line-height:1;}
      .donut-center span{font-size:11px;color:#637089;font-weight:800;margin-top:4px;}
      .inventory-legend{gap:11px;}
      .exec-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin:22px 0 12px;}
      .exec-section-head h3{font-family:'Space Grotesk';font-size:18px;line-height:1.1;margin:0;color:#17213A;}
      .exec-section-head span{display:block;font-size:12px;color:#637089;margin-top:5px;font-weight:700;}
      .exec-service-grid{display:grid;grid-template-columns:repeat(4,minmax(250px,1fr));gap:18px;}
      .service-chart-card{padding:16px;}
      .service-chart-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px;}
      .service-chart-head .exec-panel-title{margin-bottom:0;}
      .service-chart-head b{font-family:'Space Grotesk';font-size:21px;line-height:1;white-space:nowrap;}
      .issue-trend-panel{margin-bottom:18px;}
      .issue-trend-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;}
      .issue-trend-head h3{margin:0;font-size:14px;color:#17213A;}
      .issue-trend-head span{font-size:11.5px;font-weight:800;color:#2F67FF;text-align:right;}
      .issue-filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
      .issue-filter{border:1px solid #DDE6F2;background:#F8FBFF;color:#637089;border-radius:999px;padding:5px 10px;font-family:'Sarabun';font-size:11px;font-weight:800;cursor:pointer;}
      .issue-filter.active{background:#2F67FF;color:#FFFFFF;border-color:#2F67FF;}
      .exec-cs-row{display:grid;grid-template-columns:1fr;gap:18px;margin-top:18px;}
      .service-donut-panel .inventory-donut-wrap{min-height:220px;}
      .cs-dashboard-panel{overflow:hidden;}
      .cs-dashboard-panel .grid.g4{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px !important;}
      .cs-dashboard-panel .lp-card{padding:13px;border-radius:12px;}
      .cs-dashboard-panel .lp-value{font-size:21px;}
      .cs-dashboard-panel .lp-panel{background:#F8FBFF;border-color:#E8EEF7;}
      @media (max-width:1500px){.exec-inventory-grid{grid-template-columns:1fr;}.donut-pair-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.compact-donut-wrap{grid-template-columns:180px 1fr;grid-template-rows:auto;justify-items:stretch;min-height:220px;}.exec-service-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.backlog-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
      @media (max-width:1280px){.cs-dashboard-panel .grid.g4{grid-template-columns:repeat(2,minmax(0,1fr));}}
      @media (max-width:1100px){.exec-kpi-grid,.exec-main-grid,.exec-bottom-grid{grid-template-columns:1fr 1fr;}.warehouse-status-body{grid-template-columns:1fr;}.warehouse-metrics{grid-template-columns:1fr 1fr 1fr;}.inventory-donut-wrap{flex-direction:column;align-items:flex-start;}.sales-matrix{grid-template-columns:130px repeat(3,minmax(120px,1fr)) 120px;}.topbar{height:auto;min-height:60px;padding:10px 16px;align-items:flex-start;}.topbar-right{flex-wrap:wrap;justify-content:flex-end;gap:8px;}}
      @media (max-width:1300px){.allocation-filter-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
      @media (max-width:900px){.allocation-filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.allocation-progress-strip{grid-template-columns:repeat(2,minmax(0,1fr));}.allocation-event{grid-template-columns:1fr;gap:2px;}.console-hero{flex-direction:column;align-items:stretch;}.console-pack-target{min-width:0;}}
      @media (max-width:760px){.exec-kpi-grid,.exec-main-grid,.exec-bottom-grid,.exec-inventory-grid,.donut-pair-grid,.exec-service-grid,.warehouse-metrics,.backlog-grid,.sales-matrix{grid-template-columns:1fr;}.backlog-head{flex-direction:column;}.backlog-total{text-align:left;width:100%;}.category-wrap{flex-direction:column;align-items:flex-start;}.inventory-donut-wrap{flex-direction:row;align-items:center;flex-wrap:wrap;}.compact-donut-wrap{grid-template-columns:1fr;justify-items:center;min-height:auto;}.inventory-pill{flex:1 1 130px;}.cs-dashboard-panel .grid.g4{grid-template-columns:1fr;}}

      @media print{
        body{background:#FFFFFF !important;}
        .sidebar,.topbar,.modal-backdrop{display:none !important;}
        .wms-app{display:block;background:#FFFFFF;color:#111827;border:0;min-height:auto;overflow:visible;}
        .main{display:block;width:100%;}
        .content{padding:0;background:#FFFFFF;overflow:visible;}
        .content::before{content:attr(data-print-title);display:block;font-family:'Sarabun',Arial,sans-serif;font-weight:800;font-size:20px;margin:0 0 14px;color:#111827;}
        .card,.exec-panel,.exec-kpi,.lp-panel,.lp-card,.exec-backlog-panel{break-inside:avoid;box-shadow:none !important;}
        button,.btn,input,select,textarea{display:none !important;}
      }

      /* ---------- Light dashboard (Overview page bleed wrapper) ---------- */
      .light-dashboard{background:var(--bg);margin:-24px;padding:24px;min-height:100%;}
      .lp-panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;}
      .lp-panel h3{margin:0 0 4px;font-size:12.5px;color:var(--muted);font-weight:500;}
      .productivity-dashboard-panel{padding:18px 18px 16px;overflow:hidden;}
      .productivity-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;}
      .productivity-head h3{font-size:17px;color:var(--text);font-weight:800;margin:0 0 2px;}
      .productivity-legend{display:flex;gap:14px;align-items:center;color:var(--muted);font-size:12px;font-weight:700;white-space:nowrap;}
      .productivity-legend span{display:inline-flex;align-items:center;gap:6px;}
      .productivity-legend i{width:10px;height:10px;border-radius:3px;display:inline-block;}
      .productivity-legend i.order{background:#2F67FF;}.productivity-legend i.piece{background:#20C766;}
      .productivity-mirror-chart{display:grid;gap:5px;padding:6px 0 2px;}
      .productivity-mirror-row{display:grid;grid-template-columns:minmax(180px,1fr) 64px minmax(180px,1fr);align-items:center;gap:10px;min-height:22px;}
      .mirror-side{display:grid;align-items:center;gap:8px;}
      .mirror-left{grid-template-columns:46px 1fr;}.mirror-right{grid-template-columns:1fr 58px;}
      .mirror-track{height:14px;background:#EDF2F8;border:1px solid #DCE5F0;border-radius:999px;overflow:hidden;position:relative;}
      .mirror-left .mirror-track{display:flex;justify-content:flex-end;}
      .mirror-bar{height:100%;border-radius:999px;box-shadow:0 5px 12px rgba(47,103,255,.14);}
      .mirror-bar.order{background:linear-gradient(90deg,#6FA0FF,#2F67FF);}.mirror-bar.piece{background:linear-gradient(90deg,#20C766,#79D98F);}
      .mirror-time{height:24px;display:flex;align-items:center;justify-content:center;border-left:1px solid #D6DEE8;border-right:1px solid #D6DEE8;color:#17213A;font-weight:800;font-size:11px;background:#F8FBFF;border-radius:6px;}
      .mirror-value{font-size:11px;color:var(--muted);font-weight:800;}
      .mirror-left .mirror-value{text-align:right;}.mirror-right .mirror-value{text-align:left;}

      .lp-card{--tone:var(--amber);--tone-soft:rgba(62,126,224,.1);--tone-ring:rgba(62,126,224,.22);display:flex;gap:14px;align-items:flex-start;border-radius:12px;padding:16px;border:1px solid transparent;box-shadow:0 2px 6px rgba(22,35,61,0.08);position:relative;overflow:hidden;}
      .lp-card::before{content:'';position:absolute;left:0;top:14px;bottom:14px;width:4px;border-radius:0 6px 6px 0;background:var(--tone);opacity:.85;}
      .lp-card .lp-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(255,255,255,0.25);color:#FFFFFF;}
      .lp-card.tone-blue{--tone:#4F7DE8;--tone-soft:#EEF4FF;--tone-ring:rgba(79,125,232,.24);}
      .lp-card.tone-cyan{--tone:#1BB7C8;--tone-soft:#EAFBFC;--tone-ring:rgba(27,183,200,.24);}
      .lp-card.tone-green{--tone:#3EC775;--tone-soft:#ECFAF2;--tone-ring:rgba(62,199,117,.24);}
      .lp-card.tone-amber{--tone:#F5A83C;--tone-soft:#FFF6E6;--tone-ring:rgba(245,168,60,.28);}
      .lp-card.tone-rose{--tone:#F15B71;--tone-soft:#FFF0F2;--tone-ring:rgba(241,91,113,.24);}
      .lp-card.tone-violet{--tone:#9B6FD1;--tone-soft:#F5F0FF;--tone-ring:rgba(155,111,209,.24);}
      .lp-label{font-size:11.5px;opacity:.9;font-weight:600;}
      .lp-value{font-family:'Space Grotesk';font-size:24px;font-weight:700;margin:2px 0;}
      .lp-sub{font-size:10.5px;opacity:.85;}
      .lp-progress-track{height:5px;background:rgba(255,255,255,0.35);border-radius:3px;margin-top:8px;overflow:hidden;}
      .lp-progress-fill{height:100%;border-radius:3px;background:#FFFFFF !important;}
      /* semantic variants — flat saturated fills with white text, soft color blocks for "plan" items */
      .lp-good{background:var(--success);color:#FFFFFF;}
      .lp-bad{background:var(--danger);color:#FFFFFF;}
      .lp-info{background:linear-gradient(135deg,#4F7DE8,#17A9C0);color:#FFFFFF;border-color:rgba(255,255,255,.35);box-shadow:0 8px 18px rgba(62,126,224,.18);}
      .lp-plan{background:linear-gradient(135deg,#FFFFFF 0%,var(--tone-soft) 100%);border:1px solid var(--tone-ring);color:#6B7688;box-shadow:0 6px 16px rgba(22,35,61,0.07);}
      .lp-plan:hover{transform:translateY(-1px);box-shadow:0 10px 22px rgba(22,35,61,0.1);}
      .lp-plan .lp-icon{color:var(--tone);background:#FFFFFF;border:1px solid var(--tone-ring);box-shadow:0 5px 14px var(--tone-ring);}
      .lp-plan .lp-label{color:#6D7788;}
      .lp-plan .lp-value{color:#465164;}
      .lp-plan .lp-progress-track{background:rgba(107,118,136,.11);}
      .lp-plan .lp-progress-fill{background:var(--tone) !important;}
      .lp-plan-tag{font-size:10px;border:1px solid rgba(79,125,232,.25);background:#FFFFFF;color:#4F7DE8;border-radius:10px;padding:2px 8px;margin-left:8px;text-transform:none;letter-spacing:0;box-shadow:0 2px 6px rgba(22,35,61,.05);}
    `}</style>
  );
}






