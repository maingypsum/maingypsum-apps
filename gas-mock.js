/**
 * MAIN GYPSUM ERP v2.0 - Gas Mock Store
 * Provides local storage backing and full simulated backend controllers
 */

const GAS_MOCK_STORAGE_KEY = 'MAIN_GYPSUM_ERP_MOCK_DATA_V2';

const GasMockStore = {
  getInitialData() {
    const now = new Date().toISOString();
    return {
      products: [
        { ID: 'PRD-001', Code: 'GYP-JAY-9', Name: 'Gypsum Board Jayaboard 9mm x 1200 x 2400', Category: 'Gypsum', Unit: 'Lembar', BuyPrice: 68000, SellPrice: 75000, MinStock: 50, CurrentStock: 250, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-002', Code: 'GYP-KNF-9', Name: 'Gypsum Board Knauf Standard 9mm', Category: 'Gypsum', Unit: 'Lembar', BuyPrice: 62000, SellPrice: 70000, MinStock: 40, CurrentStock: 180, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-003', Code: 'GYP-ELE-9', Name: 'Gypsum Board Elephant 9mm', Category: 'Gypsum', Unit: 'Lembar', BuyPrice: 60000, SellPrice: 67000, MinStock: 30, CurrentStock: 120, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-004', Code: 'CPD-Aplus-20', Name: 'Semen Cornice Compound Aplus 20kg', Category: 'Compound', Unit: 'Sak', BuyPrice: 48000, SellPrice: 55000, MinStock: 20, CurrentStock: 85, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-005', Code: 'CPD-Jay-20', Name: 'Semen Cornice Compound Jayaboard UB 20kg', Category: 'Compound', Unit: 'Sak', BuyPrice: 58000, SellPrice: 66000, MinStock: 15, CurrentStock: 60, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-006', Code: 'LIS-C7-4M', Name: 'Lis Profil Gypsum C7 (Panjang 4 meter)', Category: 'Aksesoris', Unit: 'Batang', BuyPrice: 12000, SellPrice: 16000, MinStock: 100, CurrentStock: 350, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-007', Code: 'SCR-GYP-6X1', Name: 'Sekrup Gypsum 6 x 1 inci (Isi 1000 pcs)', Category: 'Aksesoris', Unit: 'Dus', BuyPrice: 35000, SellPrice: 45000, MinStock: 10, CurrentStock: 45, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'PRD-008', Code: 'TAP-TEXT-50M', Name: 'Textile Tape Kain Kassa 50 meter', Category: 'Aksesoris', Unit: 'Roll', BuyPrice: 15000, SellPrice: 20000, MinStock: 25, CurrentStock: 8, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      customers: [
        { ID: 'CUST-001', Code: 'C-001', Name: 'PT Jaya Kontraktor Utama', Phone: '081299887766', Address: 'Jl. Raya Industri No. 45, Jakarta', CreditLimit: 50000000, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'CUST-002', Code: 'C-002', Name: 'CV Bintang Gypsum Decor', Phone: '085611223344', Address: 'Jl. Merdeka No. 12, Tangerang', CreditLimit: 25000000, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'CUST-003', Code: 'C-003', Name: 'Toko Bangunan Sumber Makmur', Phone: '087855443322', Address: 'Jl. Gatot Subroto No. 88, Bekasi', CreditLimit: 15000000, CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      suppliers: [
        { ID: 'SUP-001', Code: 'S-001', Name: 'PT Saint-Gobain Indonesia (Jayaboard)', Phone: '021-8970011', Address: 'Kawasan Industri MM2100, Cikarang', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'SUP-002', Code: 'S-002', Name: 'PT Knauf Gypsum Indonesia', Phone: '021-5544332', Address: 'Kawasan Industri Jababeka, Cikarang', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      categories: [
        { ID: 'CAT-001', Code: 'GYP', Name: 'Gypsum Board', Description: 'Papan Gypsum', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'CAT-002', Code: 'CPD', Name: 'Compound', Description: 'Semen cornice & compound', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'CAT-003', Code: 'AKS', Name: 'Aksesoris', Description: 'Sekrup, tape, lis profil', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      employees: [
        { ID: 'EMP-001', Code: 'E-001', Name: 'Budi Santoso', Role: 'Gudang', Phone: '081234567890', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'EMP-002', Code: 'E-002', Name: 'Siti Rahma', Role: 'Keuangan', Phone: '081987654321', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      users: [
        { ID: 'USR-001', Username: 'admin', Name: 'Super Admin Main Gypsum', Role: 'Super Admin', Status: 'Aktif', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'USR-002', Username: 'gudang', Name: 'Budi (Staf Gudang)', Role: 'Gudang', Status: 'Aktif', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      settings: [
        { ID: 'SET-001', Key: 'COMPANY_NAME', Value: 'Main Gypsum ERP', Description: 'Nama Perusahaan' },
        { ID: 'SET-002', Key: 'TAX_RATE', Value: '11', Description: 'PPN (%)' }
      ],
      sales: [
        {
          ID: 'SAL-001',
          InvoiceNo: 'INV-202607-001',
          Date: '2026-07-25',
          CustomerID: 'CUST-001',
          CustomerName: 'PT Jaya Kontraktor Utama',
          TotalAmount: 7500000,
          TaxAmount: 825000,
          DiscountAmount: 0,
          GrandTotal: 8325000,
          PaymentStatus: 'Lunas',
          Notes: 'Pengiriman proyek Apartemen Grand',
          CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true,
          Details: [
            { ID: 'DET-001', SalesID: 'SAL-001', ProductID: 'PRD-001', ProductCode: 'GYP-JAY-9', ProductName: 'Gypsum Board Jayaboard 9mm x 1200 x 2400', Qty: 100, UnitPrice: 75000, Subtotal: 7500000 }
          ]
        }
      ],
      purchases: [
        {
          ID: 'PUR-001',
          PONumber: 'PO-202607-001',
          Date: '2026-07-20',
          SupplierID: 'SUP-001',
          SupplierName: 'PT Saint-Gobain Indonesia (Jayaboard)',
          TotalAmount: 13600000,
          TaxAmount: 1496000,
          GrandTotal: 15096000,
          PaymentStatus: 'Lunas',
          Notes: 'Stok awal bulan Juli',
          CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true,
          Details: [
            { ID: 'DET-P01', PurchaseID: 'PUR-001', ProductID: 'PRD-001', ProductCode: 'GYP-JAY-9', ProductName: 'Gypsum Board Jayaboard 9mm x 1200 x 2400', Qty: 200, UnitPrice: 68000, Subtotal: 13600000 }
          ]
        }
      ],
      inventoryAdj: [],
      cashBank: [
        { ID: 'CB-001', VoucherNo: 'VCH-001', Date: '2026-07-25', Type: 'Masuk', Account: 'Kas Bank BCA', Amount: 8325000, Category: 'Penjualan', Description: 'Pembayaran INV-202607-001', RefNo: 'INV-202607-001', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'CB-002', VoucherNo: 'VCH-002', Date: '2026-07-20', Type: 'Keluar', Account: 'Kas Bank BCA', Amount: 15096000, Category: 'Pembelian Stok', Description: 'Pembayaran PO-202607-001', RefNo: 'PO-202607-001', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ],
      journals: [
        { ID: 'JRN-001', JournalNo: 'JRN-INV-202607-001', Date: '2026-07-25', RefNo: 'INV-202607-001', AccountCode: '1010', AccountName: 'Kas & Bank', Debit: 8325000, Credit: 0, Description: 'Penjualan INV-202607-001', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true },
        { ID: 'JRN-002', JournalNo: 'JRN-INV-202607-001', Date: '2026-07-25', RefNo: 'INV-202607-001', AccountCode: '4010', AccountName: 'Pendapatan Penjualan', Debit: 0, Credit: 8325000, Description: 'Penjualan INV-202607-001', CreatedAt: now, UpdatedAt: now, CreatedBy: 'System', UpdatedBy: 'System', IsActive: true }
      ]
    };
  },

  loadData() {
    const raw = localStorage.getItem(GAS_MOCK_STORAGE_KEY);
    if (!raw) {
      const data = this.getInitialData();
      this.saveData(data);
      return data;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      const data = this.getInitialData();
      this.saveData(data);
      return data;
    }
  },

  saveData(data) {
    localStorage.setItem(GAS_MOCK_STORAGE_KEY, JSON.stringify(data));
  }
};
