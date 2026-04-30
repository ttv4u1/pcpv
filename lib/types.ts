export type Language = 'en' | 'ms'

export interface PunchRecord {
  id: string
  userId: string
  date: string
  punchIn: string | null
  punchOut: string | null
  status: 'normal' | 'late' | 'ot-early' | 'ot-late'
  otHours: number
  createdAt: string
}

export interface VehicleLog {
  id: string
  userId: string
  date: string
  vehicleNumber: string
  vehicleType: string
  driver: string
  destination: string
  purpose: string
  departureTime: string
  returnTime: string
  odometerBefore: number
  odometerAfter: number
  distanceKm: number
  fuelType: string
  fuelLiters: number
  fuelPricePerLiter: number
  fuelTotalRM: number
  tngAmount: number
  parkingAmount: number
  tollAmount: number
  remarks: string
  createdAt: string
}

export interface Receipt {
  id: string
  userId: string
  type: 'fuel' | 'tng' | 'parking' | 'toll' | 'other'
  amount: number
  description: string
  fileUrl: string
  fileName: string
  fileType: string
  date: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  department: string
  position: string
  avatarUrl: string | null
}

export const translations = {
  en: {
    // Header
    systemTitle: 'Government Vehicle & Attendance Management System',
    welcome: 'Welcome',
    logout: 'Logout',
    login: 'Login with Google',
    
    // Navigation
    dashboard: 'Dashboard',
    punchCard: 'Punch Card',
    vehicleLog: 'Vehicle Log Book',
    receipts: 'Receipt Management',
    
    // Punch Card
    punchIn: 'Punch In',
    punchOut: 'Punch Out',
    workingHours: 'Working Hours',
    wfhStart: 'WFH Start',
    wfhEnd: 'WFH End',
    normalStart: '7:30 AM - 9:00 AM',
    normalEnd: '4:30 PM - 6:00 PM',
    status: 'Status',
    statusNormal: 'Normal',
    statusLate: 'Late',
    statusOT: 'Overtime',
    todayRecord: 'Today\'s Record',
    monthlyRecord: 'Monthly Record',
    
    // Vehicle Log
    addNewLog: 'Add New Log',
    vehicleNumber: 'Vehicle Number',
    vehicleType: 'Vehicle Type',
    driver: 'Driver',
    destination: 'Destination',
    purpose: 'Purpose',
    departureTime: 'Departure Time',
    returnTime: 'Return Time',
    odometerBefore: 'Odometer Before (KM)',
    odometerAfter: 'Odometer After (KM)',
    distanceTraveled: 'Distance Traveled (KM)',
    fuelType: 'Fuel Type',
    fuelLiters: 'Fuel (Liters)',
    fuelPrice: 'Price per Liter (RM)',
    fuelTotal: 'Total Fuel Cost (RM)',
    tngAmount: 'TNG Amount (RM)',
    parkingAmount: 'Parking (RM)',
    tollAmount: 'Toll (RM)',
    remarks: 'Remarks',
    
    // Receipts
    uploadReceipt: 'Upload Receipt',
    receiptType: 'Receipt Type',
    fuelReceipt: 'Fuel Receipt',
    tngReceipt: 'TNG Receipt',
    parkingReceipt: 'Parking Receipt',
    tollReceipt: 'Toll Receipt',
    otherReceipt: 'Other Receipt',
    amount: 'Amount (RM)',
    description: 'Description',
    viewFile: 'View File',
    downloadFile: 'Download File',
    
    // Common
    date: 'Date',
    time: 'Time',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    total: 'Total',
    actions: 'Actions',
    noData: 'No data available',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',
    
    // Messages
    punchInSuccess: 'Punch in recorded successfully',
    punchOutSuccess: 'Punch out recorded successfully',
    logSaved: 'Vehicle log saved successfully',
    receiptUploaded: 'Receipt uploaded successfully',
    loginRequired: 'Please login to continue',
    connectSupabase: 'Please connect Supabase integration to enable full functionality',
  },
  ms: {
    // Header
    systemTitle: 'Sistem Pengurusan Kenderaan & Kehadiran Kerajaan',
    welcome: 'Selamat Datang',
    logout: 'Log Keluar',
    login: 'Log Masuk dengan Google',
    
    // Navigation
    dashboard: 'Papan Pemuka',
    punchCard: 'Kad Perakam Waktu',
    vehicleLog: 'Buku Log Kenderaan',
    receipts: 'Pengurusan Resit',
    
    // Punch Card
    punchIn: 'Masuk',
    punchOut: 'Keluar',
    workingHours: 'Waktu Bekerja',
    wfhStart: 'Mula WFH',
    wfhEnd: 'Tamat WFH',
    normalStart: '7:30 PG - 9:00 PG',
    normalEnd: '4:30 PTG - 6:00 PTG',
    status: 'Status',
    statusNormal: 'Normal',
    statusLate: 'Lewat',
    statusOT: 'Lebih Masa',
    todayRecord: 'Rekod Hari Ini',
    monthlyRecord: 'Rekod Bulanan',
    
    // Vehicle Log
    addNewLog: 'Tambah Log Baru',
    vehicleNumber: 'Nombor Kenderaan',
    vehicleType: 'Jenis Kenderaan',
    driver: 'Pemandu',
    destination: 'Destinasi',
    purpose: 'Tujuan',
    departureTime: 'Masa Bertolak',
    returnTime: 'Masa Pulang',
    odometerBefore: 'Odometer Sebelum (KM)',
    odometerAfter: 'Odometer Selepas (KM)',
    distanceTraveled: 'Jarak Perjalanan (KM)',
    fuelType: 'Jenis Minyak',
    fuelLiters: 'Minyak (Liter)',
    fuelPrice: 'Harga Seliter (RM)',
    fuelTotal: 'Jumlah Kos Minyak (RM)',
    tngAmount: 'Amaun TNG (RM)',
    parkingAmount: 'Parking (RM)',
    tollAmount: 'Tol (RM)',
    remarks: 'Catatan',
    
    // Receipts
    uploadReceipt: 'Muat Naik Resit',
    receiptType: 'Jenis Resit',
    fuelReceipt: 'Resit Minyak',
    tngReceipt: 'Resit TNG',
    parkingReceipt: 'Resit Parking',
    tollReceipt: 'Resit Tol',
    otherReceipt: 'Resit Lain',
    amount: 'Amaun (RM)',
    description: 'Penerangan',
    viewFile: 'Lihat Fail',
    downloadFile: 'Muat Turun Fail',
    
    // Common
    date: 'Tarikh',
    time: 'Masa',
    save: 'Simpan',
    cancel: 'Batal',
    edit: 'Sunting',
    delete: 'Padam',
    view: 'Lihat',
    search: 'Cari',
    filter: 'Tapis',
    export: 'Eksport',
    total: 'Jumlah',
    actions: 'Tindakan',
    noData: 'Tiada data',
    loading: 'Memuatkan...',
    success: 'Berjaya',
    error: 'Ralat',
    confirm: 'Sahkan',
    
    // Messages
    punchInSuccess: 'Masuk berjaya direkodkan',
    punchOutSuccess: 'Keluar berjaya direkodkan',
    logSaved: 'Log kenderaan berjaya disimpan',
    receiptUploaded: 'Resit berjaya dimuat naik',
    loginRequired: 'Sila log masuk untuk meneruskan',
    connectSupabase: 'Sila sambungkan integrasi Supabase untuk fungsi penuh',
  }
} as const
