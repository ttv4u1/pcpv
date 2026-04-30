import { supabase } from './supabase'

// Table names
export const TABLES = {
  ATTENDANCE: 'attendance',
  VEHICLE_LOGS: 'vehicle_logs',
  RECEIPTS: 'receipts',
} as const

// Types for database records
export interface DbAttendance {
  id: string
  user_id: string
  date: string
  punch_in: string | null
  punch_out: string | null
  status: string
  ot_hours: number
  created_at: string
  updated_at: string
}

export interface DbVehicleLog {
  id: string
  user_id: string
  date: string
  vehicle_number: string
  vehicle_type: string
  driver: string
  destination: string
  purpose: string
  departure_time: string | null
  return_time: string | null
  odometer_before: number | null
  odometer_after: number | null
  fuel_type: string | null
  fuel_liters: number | null
  fuel_price_per_liter: number | null
  tng_amount: number | null
  parking_amount: number | null
  toll_amount: number | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface DbReceipt {
  id: string
  user_id: string
  type: string
  amount: number
  description: string
  date: string
  file_url: string
  file_name: string
  file_type: string
  created_at: string
  updated_at: string
}

// Attendance functions
export async function insertAttendance(record: Omit<DbAttendance, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from(TABLES.ATTENDANCE)
    .insert(record)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateAttendance(id: string, record: Partial<DbAttendance>) {
  const { data, error } = await supabase
    .from(TABLES.ATTENDANCE)
    .update({ ...record, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAttendanceByUserAndDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from(TABLES.ATTENDANCE)
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()
  
  if (error && error.code !== 'PGRP116') throw error
  return data
}

export async function getAttendanceByUserAndMonth(userId: string, yearMonth: string) {
  const { data, error } = await supabase
    .from(TABLES.ATTENDANCE)
    .select('*')
    .eq('user_id', userId)
    .like('date', `${yearMonth}%`)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Vehicle Log functions
export async function insertVehicleLog(record: Omit<DbVehicleLog, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from(TABLES.VEHICLE_LOGS)
    .insert(record)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateVehicleLog(id: string, record: Partial<DbVehicleLog>) {
  const { data, error } = await supabase
    .from(TABLES.VEHICLE_LOGS)
    .update({ ...record, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteVehicleLog(id: string) {
  const { error } = await supabase
    .from(TABLES.VEHICLE_LOGS)
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getVehicleLogsByUser(userId: string) {
  const { data, error } = await supabase
    .from(TABLES.VEHICLE_LOGS)
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Receipt functions
export async function insertReceipt(record: Omit<DbReceipt, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from(TABLES.RECEIPTS)
    .insert(record)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateReceipt(id: string, record: Partial<DbReceipt>) {
  const { data, error } = await supabase
    .from(TABLES.RECEIPTS)
    .update({ ...record, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteReceipt(id: string) {
  const { error } = await supabase
    .from(TABLES.RECEIPTS)
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getReceiptsByUser(userId: string) {
  const { data, error } = await supabase
    .from(TABLES.RECEIPTS)
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}