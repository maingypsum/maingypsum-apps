/**
 * MAIN GYPSUM ERP v2.0 - Universal API Driver
 * Auto-detects Google Apps Script vs Local Browser Environment
 */

const Api = {
  isGasEnvironment() {
    return typeof google !== 'undefined' && google.script && google.script.run;
  },

  callServer(functionName, ...args) {
    return new Promise((resolve, reject) => {
      if (Api.isGasEnvironment()) {
        google.script.run
          .withSuccessHandler((responseJson) => {
            try {
              const res = typeof responseJson === 'string' ? JSON.parse(responseJson) : responseJson;
              if (res.success) resolve(res.data);
              else reject(new Error(res.message || 'Error dari server'));
            } catch (err) {
              reject(err);
            }
          })
          .withFailureHandler((err) => {
            reject(new Error(err.message || 'Gagal menghubungi server Apps Script'));
          })[functionName](...args);
      } else {
        // Fallback to local simulated GasMock store
        setTimeout(() => {
          try {
            const data = GasMockController[functionName](...args);
            resolve(data);
          } catch (e) {
            reject(e);
          }
        }, 150);
      }
    });
  }
};

/**
 * Local Controller Implementations when running outside Apps Script
 */
const GasMockController = {
  apiGetProducts() {
    const store = GasMockStore.loadData();
    return store.products.filter(p => p.IsActive !== false);
  },

  apiSaveProduct(productData, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();

    if (productData.ID) {
      const idx = store.products.findIndex(p => p.ID === productData.ID);
      if (idx !== -1) {
        store.products[idx] = Object.assign({}, store.products[idx], productData, { UpdatedAt: now, UpdatedBy: user });
      }
    } else {
      const newProd = Object.assign({}, productData, {
        ID: 'PRD-' + Date.now().toString(36).toUpperCase(),
        CurrentStock: Number(productData.CurrentStock) || 0,
        BuyPrice: Number(productData.BuyPrice) || 0,
        SellPrice: Number(productData.SellPrice) || 0,
        MinStock: Number(productData.MinStock) || 10,
        CreatedAt: now, UpdatedAt: now, CreatedBy: user, UpdatedBy: user, IsActive: true
      });
      store.products.push(newProd);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiDeleteProduct(id, user = 'Admin') {
    const store = GasMockStore.loadData();
    const idx = store.products.findIndex(p => p.ID === id);
    if (idx !== -1) {
      store.products[idx].IsActive = false;
      GasMockStore.saveData(store);
    }
    return true;
  },

  apiGetCustomers() {
    const store = GasMockStore.loadData();
    return store.customers.filter(c => c.IsActive !== false);
  },

  apiSaveCustomer(data, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();
    if (data.ID) {
      const idx = store.customers.findIndex(c => c.ID === data.ID);
      if (idx !== -1) store.customers[idx] = Object.assign({}, store.customers[idx], data, { UpdatedAt: now });
    } else {
      data.ID = 'CUST-' + Date.now().toString(36).toUpperCase();
      data.CreatedAt = now; data.UpdatedAt = now; data.IsActive = true;
      store.customers.push(data);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiDeleteCustomer(id) {
    const store = GasMockStore.loadData();
    const idx = store.customers.findIndex(c => c.ID === id);
    if (idx !== -1) store.customers[idx].IsActive = false;
    GasMockStore.saveData(store);
    return true;
  },

  apiGetSuppliers() {
    const store = GasMockStore.loadData();
    return store.suppliers.filter(s => s.IsActive !== false);
  },

  apiSaveSupplier(data) {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();
    if (data.ID) {
      const idx = store.suppliers.findIndex(s => s.ID === data.ID);
      if (idx !== -1) store.suppliers[idx] = Object.assign({}, store.suppliers[idx], data, { UpdatedAt: now });
    } else {
      data.ID = 'SUP-' + Date.now().toString(36).toUpperCase();
      data.CreatedAt = now; data.UpdatedAt = now; data.IsActive = true;
      store.suppliers.push(data);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiDeleteSupplier(id) {
    const store = GasMockStore.loadData();
    const idx = store.suppliers.findIndex(s => s.ID === id);
    if (idx !== -1) store.suppliers[idx].IsActive = false;
    GasMockStore.saveData(store);
    return true;
  },

  apiGetCategories() {
    const store = GasMockStore.loadData();
    return store.categories.filter(c => c.IsActive !== false);
  },

  apiSaveCategory(data) {
    const store = GasMockStore.loadData();
    if (data.ID) {
      const idx = store.categories.findIndex(c => c.ID === data.ID);
      if (idx !== -1) store.categories[idx] = Object.assign({}, store.categories[idx], data);
    } else {
      data.ID = 'CAT-' + Date.now().toString(36).toUpperCase();
      data.IsActive = true;
      store.categories.push(data);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiGetEmployees() {
    const store = GasMockStore.loadData();
    return store.employees.filter(e => e.IsActive !== false);
  },

  apiSaveEmployee(data) {
    const store = GasMockStore.loadData();
    if (data.ID) {
      const idx = store.employees.findIndex(e => e.ID === data.ID);
      if (idx !== -1) store.employees[idx] = Object.assign({}, store.employees[idx], data);
    } else {
      data.ID = 'EMP-' + Date.now().toString(36).toUpperCase();
      data.IsActive = true;
      store.employees.push(data);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiGetUsers() {
    const store = GasMockStore.loadData();
    return store.users.filter(u => u.IsActive !== false);
  },

  apiSaveUser(data) {
    const store = GasMockStore.loadData();
    if (data.ID) {
      const idx = store.users.findIndex(u => u.ID === data.ID);
      if (idx !== -1) store.users[idx] = Object.assign({}, store.users[idx], data);
    } else {
      data.ID = 'USR-' + Date.now().toString(36).toUpperCase();
      data.IsActive = true;
      store.users.push(data);
    }
    GasMockStore.saveData(store);
    return true;
  },

  apiGetSales() {
    const store = GasMockStore.loadData();
    return store.sales.filter(s => s.IsActive !== false);
  },

  apiCreateSales(salesHeader, items, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();

    const customer = store.customers.find(c => c.ID === salesHeader.CustomerID);
    if (!customer) throw new Error('Pelanggan tidak ditemukan');

    const invoiceNo = salesHeader.InvoiceNo || `INV-${Date.now().toString(36).toUpperCase()}`;
    let totalAmount = 0;

    const details = items.map(item => {
      const prod = store.products.find(p => p.ID === item.ProductID);
      if (!prod) throw new Error(`Produk ID ${item.ProductID} tidak ditemukan`);
      const qty = Number(item.Qty) || 0;
      const unitPrice = Number(item.UnitPrice) || Number(prod.SellPrice) || 0;
      const subtotal = qty * unitPrice;
      totalAmount += subtotal;

      // Update product stock in mock store
      prod.CurrentStock = (Number(prod.CurrentStock) || 0) - qty;

      return {
        ID: 'DET-' + Date.now().toString(36).toUpperCase(),
        ProductID: prod.ID,
        ProductCode: prod.Code,
        ProductName: prod.Name,
        Qty: qty,
        UnitPrice: unitPrice,
        Subtotal: subtotal
      };
    });

    const taxAmount = Number(salesHeader.TaxAmount) || 0;
    const discountAmount = Number(salesHeader.DiscountAmount) || 0;
    const grandTotal = totalAmount + taxAmount - discountAmount;

    const newSales = {
      ID: 'SAL-' + Date.now().toString(36).toUpperCase(),
      InvoiceNo: invoiceNo,
      Date: salesHeader.Date,
      CustomerID: customer.ID,
      CustomerName: customer.Name,
      TotalAmount: totalAmount,
      TaxAmount: taxAmount,
      DiscountAmount: discountAmount,
      GrandTotal: grandTotal,
      PaymentStatus: salesHeader.PaymentStatus || 'Lunas',
      Notes: salesHeader.Notes || '',
      CreatedAt: now, UpdatedAt: now, CreatedBy: user, UpdatedBy: user, IsActive: true,
      Details: details
    };

    store.sales.unshift(newSales);

    // Auto Journal Entry
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${invoiceNo}`,
      Date: salesHeader.Date,
      RefNo: invoiceNo,
      AccountCode: '1010',
      AccountName: 'Kas & Bank',
      Debit: grandTotal,
      Credit: 0,
      Description: `Penjualan ${invoiceNo} (${customer.Name})`,
      CreatedAt: now, IsActive: true
    });
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${invoiceNo}`,
      Date: salesHeader.Date,
      RefNo: invoiceNo,
      AccountCode: '4010',
      AccountName: 'Pendapatan Penjualan',
      Debit: 0,
      Credit: grandTotal,
      Description: `Penjualan ${invoiceNo} (${customer.Name})`,
      CreatedAt: now, IsActive: true
    });

    GasMockStore.saveData(store);
    return newSales;
  },

  apiGetPurchases() {
    const store = GasMockStore.loadData();
    return store.purchases.filter(p => p.IsActive !== false);
  },

  apiCreatePurchase(purchaseHeader, items, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();

    const supplier = store.suppliers.find(s => s.ID === purchaseHeader.SupplierID);
    if (!supplier) throw new Error('Supplier tidak ditemukan');

    const poNumber = purchaseHeader.PONumber || `PO-${Date.now().toString(36).toUpperCase()}`;
    let totalAmount = 0;

    const details = items.map(item => {
      const prod = store.products.find(p => p.ID === item.ProductID);
      if (!prod) throw new Error(`Produk ID ${item.ProductID} tidak ditemukan`);
      const qty = Number(item.Qty) || 0;
      const unitPrice = Number(item.UnitPrice) || Number(prod.BuyPrice) || 0;
      const subtotal = qty * unitPrice;
      totalAmount += subtotal;

      // Add stock
      prod.CurrentStock = (Number(prod.CurrentStock) || 0) + qty;

      return {
        ID: 'DET-P' + Date.now().toString(36).toUpperCase(),
        ProductID: prod.ID,
        ProductCode: prod.Code,
        ProductName: prod.Name,
        Qty: qty,
        UnitPrice: unitPrice,
        Subtotal: subtotal
      };
    });

    const taxAmount = Number(purchaseHeader.TaxAmount) || 0;
    const grandTotal = totalAmount + taxAmount;

    const newPurchase = {
      ID: 'PUR-' + Date.now().toString(36).toUpperCase(),
      PONumber: poNumber,
      Date: purchaseHeader.Date,
      SupplierID: supplier.ID,
      SupplierName: supplier.Name,
      TotalAmount: totalAmount,
      TaxAmount: taxAmount,
      GrandTotal: grandTotal,
      PaymentStatus: purchaseHeader.PaymentStatus || 'Lunas',
      Notes: purchaseHeader.Notes || '',
      CreatedAt: now, UpdatedAt: now, CreatedBy: user, UpdatedBy: user, IsActive: true,
      Details: details
    };

    store.purchases.unshift(newPurchase);

    // Auto Journal Entry
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${poNumber}`,
      Date: purchaseHeader.Date,
      RefNo: poNumber,
      AccountCode: '1030',
      AccountName: 'Persediaan Barang',
      Debit: grandTotal,
      Credit: 0,
      Description: `Pembelian ${poNumber} (${supplier.Name})`,
      CreatedAt: now, IsActive: true
    });
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${poNumber}`,
      Date: purchaseHeader.Date,
      RefNo: poNumber,
      AccountCode: '1010',
      AccountName: 'Kas & Bank',
      Debit: 0,
      Credit: grandTotal,
      Description: `Pembelian ${poNumber} (${supplier.Name})`,
      CreatedAt: now, IsActive: true
    });

    GasMockStore.saveData(store);
    return newPurchase;
  },

  apiGetInventoryAdjustments() {
    const store = GasMockStore.loadData();
    return store.inventoryAdj || [];
  },

  apiCreateInventoryAdjustment(data, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();

    const prod = store.products.find(p => p.ID === data.ProductID);
    if (!prod) throw new Error('Produk tidak ditemukan');

    const qty = Number(data.Qty) || 0;
    const qtyDelta = data.Type === 'Masuk' ? qty : -qty;
    prod.CurrentStock = (Number(prod.CurrentStock) || 0) + qtyDelta;

    const adjNo = `ADJ-${Date.now().toString(36).toUpperCase()}`;

    const newAdj = {
      ID: 'ADJ-' + Date.now().toString(36).toUpperCase(),
      AdjNo: adjNo,
      Date: data.Date,
      ProductID: prod.ID,
      ProductName: prod.Name,
      Type: data.Type,
      Qty: qty,
      Reason: data.Reason || 'Penyesuaian Stok',
      CreatedAt: now, IsActive: true
    };

    if (!store.inventoryAdj) store.inventoryAdj = [];
    store.inventoryAdj.unshift(newAdj);
    GasMockStore.saveData(store);
    return newAdj;
  },

  apiGetCashBank() {
    const store = GasMockStore.loadData();
    return store.cashBank || [];
  },

  apiCreateCashBank(data, user = 'Admin') {
    const store = GasMockStore.loadData();
    const now = new Date().toISOString();
    const voucherNo = data.VoucherNo || `VCH-${Date.now().toString(36).toUpperCase()}`;
    const amount = Number(data.Amount) || 0;

    const newItem = {
      ID: 'CB-' + Date.now().toString(36).toUpperCase(),
      VoucherNo: voucherNo,
      Date: data.Date,
      Type: data.Type,
      Account: data.Account,
      Amount: amount,
      Category: data.Category,
      Description: data.Description || '',
      RefNo: data.RefNo || '',
      CreatedAt: now, IsActive: true
    };

    if (!store.cashBank) store.cashBank = [];
    store.cashBank.unshift(newItem);

    // Auto Journal Entry
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${voucherNo}`,
      Date: data.Date,
      RefNo: voucherNo,
      AccountCode: data.Type === 'Masuk' ? '1010' : '5010',
      AccountName: data.Type === 'Masuk' ? data.Account : data.Category,
      Debit: amount,
      Credit: 0,
      Description: data.Description || data.Category,
      CreatedAt: now, IsActive: true
    });
    store.journals.push({
      ID: 'JRN-' + Date.now().toString(36).toUpperCase(),
      JournalNo: `JRN-${voucherNo}`,
      Date: data.Date,
      RefNo: voucherNo,
      AccountCode: data.Type === 'Masuk' ? '4020' : '1010',
      AccountName: data.Type === 'Masuk' ? data.Category : data.Account,
      Debit: 0,
      Credit: amount,
      Description: data.Description || data.Category,
      CreatedAt: now, IsActive: true
    });

    GasMockStore.saveData(store);
    return newItem;
  },

  apiGetJournals() {
    const store = GasMockStore.loadData();
    return store.journals || [];
  },

  apiGetDashboardMetrics() {
    const store = GasMockStore.loadData();
    const products = store.products.filter(p => p.IsActive !== false);
    const sales = store.sales.filter(s => s.IsActive !== false);
    const purchases = store.purchases.filter(p => p.IsActive !== false);
    const cashBank = store.cashBank || [];

    const mtdSales = sales.reduce((sum, s) => sum + (Number(s.GrandTotal) || 0), 0);
    const mtdPurchases = purchases.reduce((sum, p) => sum + (Number(p.GrandTotal) || 0), 0);
    const lowStockProducts = products.filter(p => (Number(p.CurrentStock) || 0) <= (Number(p.MinStock) || 0));

    let cashBalance = 0;
    cashBank.forEach(cb => {
      const amt = Number(cb.Amount) || 0;
      if (cb.Type === 'Masuk') cashBalance += amt;
      else if (cb.Type === 'Keluar') cashBalance -= amt;
    });

    return {
      MtdSales: mtdSales,
      MtdPurchases: mtdPurchases,
      TotalProducts: products.length,
      LowStockCount: lowStockProducts.length,
      LowStockItems: lowStockProducts,
      CashBalance: cashBalance,
      TotalSalesCount: sales.length,
      TotalPurchaseCount: purchases.length
    };
  },

  apiGetLabaRugiReport(startDate, endDate) {
    const store = GasMockStore.loadData();
    const sales = store.sales.filter(s => s.IsActive !== false);
    const purchases = store.purchases.filter(p => p.IsActive !== false);
    const cashBank = store.cashBank || [];

    const totalPendapatan = sales.reduce((sum, s) => sum + (Number(s.GrandTotal) || 0), 0);
    const totalHPP = purchases.reduce((sum, p) => sum + (Number(p.GrandTotal) || 0), 0);
    const totalBeban = cashBank.filter(cb => cb.Type === 'Keluar').reduce((sum, cb) => sum + (Number(cb.Amount) || 0), 0);

    const labaKotor = totalPendapatan - totalHPP;
    const labaBersih = labaKotor - totalBeban;

    return {
      StartDate: startDate,
      EndDate: endDate,
      TotalPendapatan: totalPendapatan,
      TotalHPP: totalHPP,
      LabaKotor: labaKotor,
      TotalBeban: totalBeban,
      LabaBersih: labaBersih
    };
  }
};
