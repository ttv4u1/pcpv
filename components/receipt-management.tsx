'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/language-context'
import { 
  Upload, 
  FileText, 
  Fuel,
  CreditCard,
  Car,
  X,
  Download,
  Eye,
  Trash2,
  Filter,
  Search,
  File,
  Image as ImageIcon
} from 'lucide-react'
import type { Receipt } from '@/lib/types'

interface ReceiptManagementProps {
  userId: string
}

const RECEIPT_TYPES = [
  { value: 'fuel', labelEn: 'Fuel Receipt', labelMs: 'Resit Minyak', icon: Fuel, color: 'text-green-600' },
  { value: 'tng', labelEn: 'TNG Receipt', labelMs: 'Resit TNG', icon: CreditCard, color: 'text-blue-600' },
  { value: 'parking', labelEn: 'Parking Receipt', labelMs: 'Resit Parking', icon: Car, color: 'text-purple-600' },
  { value: 'toll', labelEn: 'Toll Receipt', labelMs: 'Resit Tol', icon: Car, color: 'text-orange-600' },
  { value: 'other', labelEn: 'Other Receipt', labelMs: 'Resit Lain', icon: FileText, color: 'text-gray-600' },
] as const

// Supported file types including Office 365 documents
const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

export function ReceiptManagement({ userId }: ReceiptManagementProps) {
  const { language, t } = useLanguage()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploadData, setUploadData] = useState({
    type: 'fuel' as Receipt['type'],
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    file: null as File | null,
  })
  
  // Load receipts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`receipts_${userId}`)
    if (saved) {
      setReceipts(JSON.parse(saved))
    }
  }, [userId])
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        alert(language === 'ms' 
          ? 'Jenis fail tidak disokong. Sila muat naik gambar, PDF, atau dokumen Office.'
          : 'Unsupported file type. Please upload an image, PDF, or Office document.')
        return
      }
      setUploadData({ ...uploadData, file })
    }
  }
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadData.file) {
      alert(language === 'ms' ? 'Sila pilih fail' : 'Please select a file')
      return
    }
    
    // Convert file to base64 for localStorage storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const newReceipt: Receipt = {
        id: crypto.randomUUID(),
        userId,
        type: uploadData.type,
        amount: Number(uploadData.amount),
        description: uploadData.description,
        fileUrl: reader.result as string,
        fileName: uploadData.file!.name,
        fileType: uploadData.file!.type,
        date: uploadData.date,
        createdAt: new Date().toISOString(),
      }
      
      const updatedReceipts = [...receipts, newReceipt]
      setReceipts(updatedReceipts)
      localStorage.setItem(`receipts_${userId}`, JSON.stringify(updatedReceipts))
      
      setUploadData({
        type: 'fuel',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        file: null,
      })
      setShowUpload(false)
    }
    reader.readAsDataURL(uploadData.file)
  }
  
  const handleDelete = (id: string) => {
    if (confirm(language === 'ms' ? 'Adakah anda pasti mahu memadam resit ini?' : 'Are you sure you want to delete this receipt?')) {
      const updatedReceipts = receipts.filter(r => r.id !== id)
      setReceipts(updatedReceipts)
      localStorage.setItem(`receipts_${userId}`, JSON.stringify(updatedReceipts))
    }
  }
  
  const handleDownload = (receipt: Receipt) => {
    const link = document.createElement('a')
    link.href = receipt.fileUrl
    link.download = receipt.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }
  
  // Filter receipts
  const filteredReceipts = receipts.filter(receipt => {
    const matchesType = filterType === 'all' || receipt.type === filterType
    const matchesSearch = receipt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          receipt.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })
  
  // Calculate totals by type
  const totalByType = RECEIPT_TYPES.reduce((acc, type) => {
    acc[type.value] = receipts
      .filter(r => r.type === type.value)
      .reduce((sum, r) => sum + r.amount, 0)
    return acc
  }, {} as Record<string, number>)
  
  const grandTotal = Object.values(totalByType).reduce((a, b) => a + b, 0)
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {RECEIPT_TYPES.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.value} className="glass-card rounded-xl p-4">
              <div className={`flex items-center gap-2 ${type.color} mb-2`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm">{language === 'ms' ? type.labelMs : type.labelEn}</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                RM {totalByType[type.value].toFixed(2)}
              </p>
            </div>
          )
        })}
        
        <div className="glass-card rounded-xl p-4 bg-primary/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{t.total}</span>
          </div>
          <p className="text-xl font-bold text-primary">
            RM {grandTotal.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowUpload(true)}
          className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          <Upload className="w-5 h-5" />
          {t.uploadReceipt}
        </button>
        
        <div className="flex-1 flex gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border text-foreground"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl bg-input border border-border text-foreground appearance-none min-w-[150px]"
            >
              <option value="all">{language === 'ms' ? 'Semua' : 'All'}</option>
              {RECEIPT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {language === 'ms' ? type.labelMs : type.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Upload className="w-6 h-6" />
                {t.uploadReceipt}
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.receiptType}</label>
                <select
                  value={uploadData.type}
                  onChange={e => setUploadData({ ...uploadData, type: e.target.value as Receipt['type'] })}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                >
                  {RECEIPT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {language === 'ms' ? type.labelMs : type.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.date}</label>
                <input
                  type="date"
                  value={uploadData.date}
                  onChange={e => setUploadData({ ...uploadData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.amount}</label>
                <input
                  type="number"
                  step="0.01"
                  value={uploadData.amount}
                  onChange={e => setUploadData({ ...uploadData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.description}</label>
                <textarea
                  value={uploadData.description}
                  onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'ms' ? 'Fail Resit' : 'Receipt File'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-3d w-full flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                >
                  <Upload className="w-6 h-6" />
                  <span>
                    {uploadData.file 
                      ? uploadData.file.name 
                      : language === 'ms' 
                        ? 'Klik untuk muat naik fail'
                        : 'Click to upload file'}
                  </span>
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === 'ms' 
                    ? 'Sokong: Gambar, PDF, Word, Excel, PowerPoint'
                    : 'Supported: Images, PDF, Word, Excel, PowerPoint'}
                </p>
              </div>
              
              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="btn-3d px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  <Upload className="w-5 h-5" />
                  {language === 'ms' ? 'Muat Naik' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {viewingReceipt.fileName}
              </h2>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">{t.receiptType}</p>
                  <p className="font-medium">
                    {RECEIPT_TYPES.find(t => t.value === viewingReceipt.type)?.[language === 'ms' ? 'labelMs' : 'labelEn']}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.amount}</p>
                  <p className="font-bold text-xl text-green-600 dark:text-green-400">
                    RM {viewingReceipt.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.date}</p>
                  <p className="font-medium">{new Date(viewingReceipt.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <p className="font-medium">{viewingReceipt.description}</p>
                </div>
              </div>
              
              {/* File Preview */}
              <div className="border border-border rounded-xl overflow-hidden">
                {viewingReceipt.fileType.startsWith('image/') ? (
                  <img 
                    src={viewingReceipt.fileUrl} 
                    alt={viewingReceipt.fileName}
                    className="w-full max-h-96 object-contain bg-black/5"
                  />
                ) : viewingReceipt.fileType === 'application/pdf' ? (
                  <iframe 
                    src={viewingReceipt.fileUrl}
                    className="w-full h-96"
                    title={viewingReceipt.fileName}
                  />
                ) : (
                  <div className="p-8 text-center">
                    <File className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'ms' 
                        ? 'Pratonton tidak tersedia untuk jenis fail ini'
                        : 'Preview not available for this file type'}
                    </p>
                    <button
                      onClick={() => handleDownload(viewingReceipt)}
                      className="btn-3d mt-4 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium mx-auto"
                    >
                      <Download className="w-5 h-5" />
                      {t.downloadFile}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => handleDownload(viewingReceipt)}
                className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
              >
                <Download className="w-5 h-5" />
                {t.downloadFile}
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="btn-3d px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                {language === 'ms' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Receipts Grid */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          {language === 'ms' ? 'Senarai Resit' : 'Receipt List'}
        </h3>
        
        {filteredReceipts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t.noData}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReceipts.sort((a, b) => b.date.localeCompare(a.date)).map((receipt) => {
              const typeInfo = RECEIPT_TYPES.find(t => t.value === receipt.type)
              const Icon = typeInfo?.icon || FileText
              
              return (
                <div key={receipt.id} className="p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center gap-2 ${typeInfo?.color}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {typeInfo?.[language === 'ms' ? 'labelMs' : 'labelEn']}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(receipt.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {getFileIcon(receipt.fileType)}
                    <span className="text-sm text-foreground truncate flex-1">
                      {receipt.fileName}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {receipt.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      RM {receipt.amount.toFixed(2)}
                    </span>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewingReceipt(receipt)}
                        className="p-2 rounded-lg hover:bg-secondary text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(receipt)}
                        className="p-2 rounded-lg hover:bg-secondary text-green-600"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(receipt.id)}
                        className="p-2 rounded-lg hover:bg-secondary text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
