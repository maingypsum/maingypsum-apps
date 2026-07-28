/**
 * MAIN GYPSUM ERP v2.0 - Master Web Application Logic
 */

const UI = {
  formatCurrency(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠️'}</span>
      <div>${message}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  openModal(title, bodyHtml, onSubmit) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    const submitBtn = document.getElementById('modal-submit-btn');
    
    // Reset click listener
    const newBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newBtn, submitBtn);
    newBtn.addEventListener('click', onSubmit);

    document.getElementById('modal-container').classList.add('open');
  },

  closeModal() {
    document.getElementById('modal-container').classList.remove('open');
  }
};

const App = {
  currentView: 'dashboard',
  cache: {},

  init() {
    this.bindEvents();
    if (Api.isGasEnvironment()) {
      document.getElementById('env-status').innerText = 'Connected to Apps Script';
    }
    this.navigate('dashboard');
  },

  bindEvents() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.navigate(view);
      });
    });
  },

  navigate(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) item.classList.add('active');
      else item.classList.remove('active');
    });

    const pageTitleMap = {
      dashboard: 'Dashboard Overview',
      products: 'Master Data Produk',
      customers: 'Master Data Pelanggan',
      suppliers: 'Master Data Supplier',
      categories: 'Master Data Kategori',
      employees: 'Master Data Karyawan',
      sales: 'Transaksi Penjualan (Sales)',
      purchases: 'Transaksi Pembelian (Purchase)',
      inventory: 'Penyesuaian Stok (Inventory)',
      cashbank: 'Kas & Bank',
      journals: 'Jurnal Umum (General Ledger)',
      reports: 'Laporan Laba Rugi Perusahaan'
    };

    document.getElementById('page-title').innerText = pageTitleMap[viewName] || 'Main Gypsum ERP';
    this.loadView(viewName);
  },

  async loadView(viewName) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">Memuat data ${viewName}...</div>`;

    try {
      if (viewName === 'dashboard') await this.renderDashboard();
      else if (viewName === 'products') await this.renderProducts();
      else if (viewName === 'customers') await this.renderCustomers();
      else if (viewName === 'suppliers') await this.renderSuppliers();
      else if (viewName === 'categories') await this.renderCategories();
      else if (viewName === 'employees') await this.renderEmployees();
      else if (viewName === 'sales') await this.renderSales();
      else if (viewName === 'purchases') await this.renderPurchases();
      else if (viewName === 'inventory') await this.renderInventory();
      else if (viewName === 'cashbank') await this.renderCashBank();
      else if (viewName === 'journals') await this.renderJournals();
      else if (viewName === 'reports') await this.renderReports();
    } catch (e) {
      main.innerHTML = `<div class="card" style="color:var(--accent-rose);">Error memuat halaman: ${e.message}</div>`;
    }
  },

  refreshData() {
    this.loadView(this.currentView);
    UI.showToast('Data berhasil diperbarui');
  },

  // ----------------------------------------------------
  // DASHBOARD VIEW
  // ----------------------------------------------------
  async renderDashboard() {
    const metrics = await Api.callServer('apiGetDashboardMetrics');
    const main = document.getElementById('main-content');

    const lowStockHtml = metrics.LowStockItems.length === 0 ? 
      `<p style="color:var(--text-muted);">Semua stok barang aman.</p>` :
      `<div class="table-container">
        <table>
          <thead>
            <tr><th>Kode</th><th>Nama Produk</th><th>Stok saat ini</th><th>Min. Stok</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${metrics.LowStockItems.map(p => `
              <tr>
                <td><b>${p.Code}</b></td>
                <td>${p.Name}</td>
                <td style="color:var(--accent-rose); font-weight:700;">${p.CurrentStock} ${p.Unit}</td>
                <td>${p.MinStock} ${p.Unit}</td>
                <td><span class="badge badge-danger">Stok Menipis</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

    main.innerHTML = `
      <div class="grid-4">
        <div class="metric-card">
          <div class="metric-icon teal">💰</div>
          <div class="metric-data">
            <span class="metric-label">Penjualan (MTD)</span>
            <span class="metric-value">${UI.formatCurrency(metrics.MtdSales)}</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon blue">🛒</div>
          <div class="metric-data">
            <span class="metric-label">Pembelian (MTD)</span>
            <span class="metric-value">${UI.formatCurrency(metrics.MtdPurchases)}</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon amber">📦</div>
          <div class="metric-data">
            <span class="metric-label">Total Jenis Produk</span>
            <span class="metric-value">${metrics.TotalProducts} item</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon rose">🏦</div>
          <div class="metric-data">
            <span class="metric-label">Saldo Kas & Bank</span>
            <span class="metric-value">${UI.formatCurrency(metrics.CashBalance)}</span>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">
            <span>⚠️ Peringatan Stok Menipis (${metrics.LowStockCount})</span>
          </div>
          ${lowStockHtml}
        </div>

        <div class="card">
          <div class="card-title">🚀 Akses Cepat Transaksi</div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="App.navigate('sales')">+ Penjualan Baru</button>
            <button class="btn btn-secondary" onclick="App.navigate('purchases')">+ Pembelian Baru</button>
            <button class="btn btn-secondary" onclick="App.navigate('inventory')">+ Penyesuaian Stok</button>
            <button class="btn btn-secondary" onclick="App.navigate('cashbank')">+ Kas & Bank</button>
          </div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // PRODUCTS VIEW
  // ----------------------------------------------------
  async renderProducts() {
    const products = await Api.callServer('apiGetProducts');
    const categories = await Api.callServer('apiGetCategories');
    this.cache.products = products;
    this.cache.categories = categories;

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <div class="search-box">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="search-product" placeholder="Cari kode atau nama produk..." onkeyup="App.filterProducts()">
        </div>
        <button class="btn btn-primary" onclick="App.openProductModal()">+ Tambah Produk</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="product-table-body">
              ${this.buildProductRows(products)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  buildProductRows(products) {
    if (products.length === 0) return `<tr><td colspan="8" style="text-align:center;">Tidak ada data produk.</td></tr>`;
    return products.map(p => `
      <tr>
        <td><b>${p.Code}</b></td>
        <td>${p.Name}</td>
        <td><span class="badge badge-info">${p.Category || 'Umum'}</span></td>
        <td>${p.Unit}</td>
        <td>${UI.formatCurrency(p.BuyPrice)}</td>
        <td>${UI.formatCurrency(p.SellPrice)}</td>
        <td>
          <span style="font-weight:700; color: ${Number(p.CurrentStock) <= Number(p.MinStock) ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">
            ${p.CurrentStock} ${p.Unit}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="App.openProductModal('${p.ID}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="App.deleteProduct('${p.ID}')">Hapus</button>
        </td>
      </tr>
    `).join('');
  },

  filterProducts() {
    const query = document.getElementById('search-product').value.toLowerCase();
    const filtered = (this.cache.products || []).filter(p => 
      p.Code.toLowerCase().includes(query) || p.Name.toLowerCase().includes(query)
    );
    document.getElementById('product-table-body').innerHTML = this.buildProductRows(filtered);
  },

  openProductModal(id = null) {
    const item = id ? (this.cache.products || []).find(p => p.ID === id) : {};
    const categories = this.cache.categories || [];

    const categoryOptions = categories.map(c => 
      `<option value="${c.Name}" ${item.Category === c.Name ? 'selected' : ''}>${c.Name}</option>`
    ).join('');

    const html = `
      <form id="form-product">
        <input type="hidden" id="prod-id" value="${item.ID || ''}">
        <div class="form-row">
          <div class="form-group">
            <label>Kode Produk *</label>
            <input type="text" class="form-control" id="prod-code" value="${item.Code || ''}" required placeholder="Contoh: GYP-JAY-9">
          </div>
          <div class="form-group">
            <label>Kategori *</label>
            <select class="form-control" id="prod-category">
              ${categoryOptions || '<option value="Gypsum">Gypsum</option><option value="Compound">Compound</option><option value="Aksesoris">Aksesoris</option>'}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Nama Produk *</label>
          <input type="text" class="form-control" id="prod-name" value="${item.Name || ''}" required placeholder="Nama lengkap barang">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Satuan *</label>
            <input type="text" class="form-control" id="prod-unit" value="${item.Unit || 'Lembar'}" required placeholder="Lembar / Sak / Batang">
          </div>
          <div class="form-group">
            <label>Min. Stok Alert</label>
            <input type="number" class="form-control" id="prod-min" value="${item.MinStock || 10}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Harga Beli (Rp) *</label>
            <input type="number" class="form-control" id="prod-buy" value="${item.BuyPrice || 0}">
          </div>
          <div class="form-group">
            <label>Harga Jual (Rp) *</label>
            <input type="number" class="form-control" id="prod-sell" value="${item.SellPrice || 0}">
          </div>
          <div class="form-group">
            <label>Stok Awal</label>
            <input type="number" class="form-control" id="prod-stock" value="${item.CurrentStock || 0}">
          </div>
        </div>
      </form>
    `;

    UI.openModal(id ? 'Edit Produk' : 'Tambah Produk Baru', html, async () => {
      const data = {
        ID: document.getElementById('prod-id').value,
        Code: document.getElementById('prod-code').value,
        Name: document.getElementById('prod-name').value,
        Category: document.getElementById('prod-category').value,
        Unit: document.getElementById('prod-unit').value,
        MinStock: document.getElementById('prod-min').value,
        BuyPrice: document.getElementById('prod-buy').value,
        SellPrice: document.getElementById('prod-sell').value,
        CurrentStock: document.getElementById('prod-stock').value
      };
      try {
        await Api.callServer('apiSaveProduct', data);
        UI.closeModal();
        UI.showToast('Produk berhasil disimpan');
        App.renderProducts();
      } catch (e) {
        UI.showToast(e.message, 'error');
      }
    });
  },

  async deleteProduct(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await Api.callServer('apiDeleteProduct', id);
      UI.showToast('Produk berhasil dihapus');
      this.renderProducts();
    } catch (e) {
      UI.showToast(e.message, 'error');
    }
  },

  // ----------------------------------------------------
  // CUSTOMERS VIEW
  // ----------------------------------------------------
  async renderCustomers() {
    const customers = await Api.callServer('apiGetCustomers');
    this.cache.customers = customers;
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Master Pelanggan</h3>
        <button class="btn btn-primary" onclick="App.openCustomerModal()">+ Tambah Pelanggan</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Kode</th><th>Nama Pelanggan</th><th>No. Telepon</th><th>Alamat</th><th>Limit Kredit</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td><b>${c.Code}</b></td>
                  <td>${c.Name}</td>
                  <td>${c.Phone || '-'}</td>
                  <td>${c.Address || '-'}</td>
                  <td>${UI.formatCurrency(c.CreditLimit)}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="App.openCustomerModal('${c.ID}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="App.deleteCustomer('${c.ID}')">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openCustomerModal(id = null) {
    const c = id ? (this.cache.customers || []).find(item => item.ID === id) : {};
    const html = `
      <form>
        <input type="hidden" id="cust-id" value="${c.ID || ''}">
        <div class="form-row">
          <div class="form-group"><label>Kode *</label><input type="text" class="form-control" id="cust-code" value="${c.Code || ''}"></div>
          <div class="form-group"><label>Nama Pelanggan *</label><input type="text" class="form-control" id="cust-name" value="${c.Name || ''}"></div>
        </div>
        <div class="form-group"><label>No. Telepon</label><input type="text" class="form-control" id="cust-phone" value="${c.Phone || ''}"></div>
        <div class="form-group"><label>Alamat</label><textarea class="form-control" id="cust-address">${c.Address || ''}</textarea></div>
        <div class="form-group"><label>Limit Kredit (Rp)</label><input type="number" class="form-control" id="cust-limit" value="${c.CreditLimit || 0}"></div>
      </form>
    `;
    UI.openModal(id ? 'Edit Pelanggan' : 'Tambah Pelanggan', html, async () => {
      const data = {
        ID: document.getElementById('cust-id').value,
        Code: document.getElementById('cust-code').value,
        Name: document.getElementById('cust-name').value,
        Phone: document.getElementById('cust-phone').value,
        Address: document.getElementById('cust-address').value,
        CreditLimit: document.getElementById('cust-limit').value
      };
      try {
        await Api.callServer('apiSaveCustomer', data);
        UI.closeModal();
        UI.showToast('Data pelanggan disimpan');
        App.renderCustomers();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  async deleteCustomer(id) {
    if (!confirm('Hapus pelanggan?')) return;
    try {
      await Api.callServer('apiDeleteCustomer', id);
      UI.showToast('Pelanggan dihapus');
      this.renderCustomers();
    } catch (e) { UI.showToast(e.message, 'error'); }
  },

  // ----------------------------------------------------
  // SUPPLIERS VIEW
  // ----------------------------------------------------
  async renderSuppliers() {
    const suppliers = await Api.callServer('apiGetSuppliers');
    this.cache.suppliers = suppliers;
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Master Supplier</h3>
        <button class="btn btn-primary" onclick="App.openSupplierModal()">+ Tambah Supplier</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Kode</th><th>Nama Supplier</th><th>Telepon</th><th>Alamat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              ${suppliers.map(s => `
                <tr>
                  <td><b>${s.Code}</b></td>
                  <td>${s.Name}</td>
                  <td>${s.Phone || '-'}</td>
                  <td>${s.Address || '-'}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="App.openSupplierModal('${s.ID}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="App.deleteSupplier('${s.ID}')">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openSupplierModal(id = null) {
    const s = id ? (this.cache.suppliers || []).find(item => item.ID === id) : {};
    const html = `
      <form>
        <input type="hidden" id="sup-id" value="${s.ID || ''}">
        <div class="form-row">
          <div class="form-group"><label>Kode *</label><input type="text" class="form-control" id="sup-code" value="${s.Code || ''}"></div>
          <div class="form-group"><label>Nama Supplier *</label><input type="text" class="form-control" id="sup-name" value="${s.Name || ''}"></div>
        </div>
        <div class="form-group"><label>No. Telepon</label><input type="text" class="form-control" id="sup-phone" value="${s.Phone || ''}"></div>
        <div class="form-group"><label>Alamat</label><textarea class="form-control" id="sup-address">${s.Address || ''}</textarea></div>
      </form>
    `;
    UI.openModal(id ? 'Edit Supplier' : 'Tambah Supplier', html, async () => {
      const data = {
        ID: document.getElementById('sup-id').value,
        Code: document.getElementById('sup-code').value,
        Name: document.getElementById('sup-name').value,
        Phone: document.getElementById('sup-phone').value,
        Address: document.getElementById('sup-address').value
      };
      try {
        await Api.callServer('apiSaveSupplier', data);
        UI.closeModal();
        UI.showToast('Data supplier disimpan');
        App.renderSuppliers();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  async deleteSupplier(id) {
    if (!confirm('Hapus supplier?')) return;
    try {
      await Api.callServer('apiDeleteSupplier', id);
      UI.showToast('Supplier dihapus');
      this.renderSuppliers();
    } catch (e) { UI.showToast(e.message, 'error'); }
  },

  // ----------------------------------------------------
  // CATEGORIES & EMPLOYEES
  // ----------------------------------------------------
  async renderCategories() {
    const categories = await Api.callServer('apiGetCategories');
    this.cache.categories = categories;
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Master Kategori Produk</h3>
        <button class="btn btn-primary" onclick="App.openCategoryModal()">+ Tambah Kategori</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Kode</th><th>Nama Kategori</th><th>Keterangan</th></tr></thead>
            <tbody>
              ${categories.map(c => `<tr><td><b>${c.Code}</b></td><td>${c.Name}</td><td>${c.Description || '-'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openCategoryModal() {
    const html = `
      <form>
        <div class="form-group"><label>Kode Kategori</label><input type="text" class="form-control" id="cat-code"></div>
        <div class="form-group"><label>Nama Kategori</label><input type="text" class="form-control" id="cat-name"></div>
        <div class="form-group"><label>Keterangan</label><input type="text" class="form-control" id="cat-desc"></div>
      </form>
    `;
    UI.openModal('Tambah Kategori', html, async () => {
      const data = { Code: document.getElementById('cat-code').value, Name: document.getElementById('cat-name').value, Description: document.getElementById('cat-desc').value };
      try {
        await Api.callServer('apiSaveCategory', data);
        UI.closeModal();
        UI.showToast('Kategori disimpan');
        App.renderCategories();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  async renderEmployees() {
    const employees = await Api.callServer('apiGetEmployees');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Master Karyawan</h3>
        <button class="btn btn-primary" onclick="App.openEmployeeModal()">+ Tambah Karyawan</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Kode</th><th>Nama Karyawan</th><th>Peran / Role</th><th>Telepon</th></tr></thead>
            <tbody>
              ${employees.map(e => `<tr><td><b>${e.Code}</b></td><td>${e.Name}</td><td><span class="badge badge-info">${e.Role}</span></td><td>${e.Phone || '-'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openEmployeeModal() {
    const html = `
      <form>
        <div class="form-group"><label>Kode Karyawan</label><input type="text" class="form-control" id="emp-code"></div>
        <div class="form-group"><label>Nama Karyawan</label><input type="text" class="form-control" id="emp-name"></div>
        <div class="form-group"><label>Peran / Role</label><select class="form-control" id="emp-role"><option value="Gudang">Gudang</option><option value="Keuangan">Keuangan</option><option value="Produksi">Produksi</option><option value="Admin">Admin</option></select></div>
        <div class="form-group"><label>Telepon</label><input type="text" class="form-control" id="emp-phone"></div>
      </form>
    `;
    UI.openModal('Tambah Karyawan', html, async () => {
      const data = { Code: document.getElementById('emp-code').value, Name: document.getElementById('emp-name').value, Role: document.getElementById('emp-role').value, Phone: document.getElementById('emp-phone').value };
      try {
        await Api.callServer('apiSaveEmployee', data);
        UI.closeModal();
        UI.showToast('Karyawan disimpan');
        App.renderEmployees();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  // ----------------------------------------------------
  // TRANSACTIONS: SALES
  // ----------------------------------------------------
  async renderSales() {
    const sales = await Api.callServer('apiGetSales');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Daftar Transaksi Penjualan</h3>
        <button class="btn btn-primary" onclick="App.openNewSalesModal()">+ Penjualan Baru</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>No. Faktur</th><th>Tanggal</th><th>Pelanggan</th><th>Total Barang</th><th>Pajak / Diskon</th><th>Total Bayar</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${sales.map(s => `
                <tr>
                  <td><b>${s.InvoiceNo}</b></td>
                  <td>${UI.formatDate(s.Date)}</td>
                  <td>${s.CustomerName}</td>
                  <td>${(s.Details || []).length} item</td>
                  <td>Tax: ${UI.formatCurrency(s.TaxAmount)}</td>
                  <td><b style="color:var(--accent-teal);">${UI.formatCurrency(s.GrandTotal)}</b></td>
                  <td><span class="badge badge-success">${s.PaymentStatus || 'Lunas'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async openNewSalesModal() {
    const customers = await Api.callServer('apiGetCustomers');
    const products = await Api.callServer('apiGetProducts');
    this.cache.products = products;

    const today = new Date().toISOString().substring(0, 10);
    const invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}`;

    const customerOptions = customers.map(c => `<option value="${c.ID}">${c.Name} (${c.Code})</option>`).join('');
    const productOptions = products.map(p => `<option value="${p.ID}" data-price="${p.SellPrice}">${p.Name} [Stok: ${p.CurrentStock}]</option>`).join('');

    const html = `
      <form id="form-sales">
        <div class="form-row">
          <div class="form-group">
            <label>No. Faktur</label>
            <input type="text" class="form-control" id="sales-inv" value="${invoiceNo}">
          </div>
          <div class="form-group">
            <label>Tanggal *</label>
            <input type="date" class="form-control" id="sales-date" value="${today}">
          </div>
        </div>

        <div class="form-group">
          <label>Pelanggan *</label>
          <select class="form-control" id="sales-cust">
            ${customerOptions}
          </select>
        </div>

        <div style="margin:20px 0; border-top:1px solid var(--border-color); padding-top:16px;">
          <label style="font-weight:700; margin-bottom:10px; display:block;">Item Barang Penjualan</label>
          <div id="sales-items-container">
            <!-- Dynamic Row -->
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="App.addSalesItemRow()" style="margin-top:10px;">+ Tambah Barang</button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status Pembayaran</label>
            <select class="form-control" id="sales-status">
              <option value="Lunas">Lunas (Kas/Bank)</option>
              <option value="Kredit">Kredit (Piutang Usaha)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Notes / Catatan</label>
            <input type="text" class="form-control" id="sales-notes" placeholder="Catatan pengiriman dll.">
          </div>
        </div>
      </form>
    `;

    UI.openModal('Transaksi Penjualan Baru', html, async () => {
      const items = [];
      document.querySelectorAll('.sales-item-row').forEach(row => {
        const prodId = row.querySelector('.item-prod').value;
        const qty = Number(row.querySelector('.item-qty').value) || 0;
        const price = Number(row.querySelector('.item-price').value) || 0;
        if (prodId && qty > 0) {
          items.push({ ProductID: prodId, Qty: qty, UnitPrice: price });
        }
      });

      if (items.length === 0) {
        UI.showToast('Pilih minimal 1 barang penjualan', 'error');
        return;
      }

      const header = {
        InvoiceNo: document.getElementById('sales-inv').value,
        Date: document.getElementById('sales-date').value,
        CustomerID: document.getElementById('sales-cust').value,
        PaymentStatus: document.getElementById('sales-status').value,
        Notes: document.getElementById('sales-notes').value
      };

      try {
        await Api.callServer('apiCreateSales', header, items);
        UI.closeModal();
        UI.showToast('Penjualan berhasil disimpan!');
        App.renderSales();
      } catch (e) {
        UI.showToast(e.message, 'error');
      }
    });

    // Add first item row
    this.addSalesItemRow();
  },

  addSalesItemRow() {
    const container = document.getElementById('sales-items-container');
    if (!container) return;
    const rowId = 'row-' + Date.now();
    const products = this.cache.products || [];

    const productOptions = products.map(p => `<option value="${p.ID}" data-price="${p.SellPrice}">${p.Name} (Harga: ${UI.formatCurrency(p.SellPrice)})</option>`).join('');

    const div = document.createElement('div');
    div.className = 'sales-item-row form-row';
    div.id = rowId;
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <div style="flex:2;">
        <select class="form-control item-prod" onchange="App.updateSalesRowPrice('${rowId}')">
          ${productOptions}
        </select>
      </div>
      <div style="flex:1;">
        <input type="number" class="form-control item-qty" value="1" placeholder="Qty" onchange="App.calcSalesRowSubtotal('${rowId}')">
      </div>
      <div style="flex:1.5;">
        <input type="number" class="form-control item-price" value="${products[0] ? products[0].SellPrice : 0}" placeholder="Harga">
      </div>
      <div>
        <button type="button" class="btn btn-danger btn-sm" onclick="document.getElementById('${rowId}').remove()">&times;</button>
      </div>
    `;
    container.appendChild(div);
  },

  updateSalesRowPrice(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const select = row.querySelector('.item-prod');
    const selectedOpt = select.options[select.selectedIndex];
    const price = selectedOpt.getAttribute('data-price') || 0;
    row.querySelector('.item-price').value = price;
  },

  // ----------------------------------------------------
  // TRANSACTIONS: PURCHASES
  // ----------------------------------------------------
  async renderPurchases() {
    const purchases = await Api.callServer('apiGetPurchases');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Daftar Transaksi Pembelian</h3>
        <button class="btn btn-primary" onclick="App.openNewPurchaseModal()">+ Pembelian Baru</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>No. PO</th><th>Tanggal</th><th>Supplier</th><th>Jumlah Items</th><th>Total Pembelian</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${purchases.map(p => `
                <tr>
                  <td><b>${p.PONumber}</b></td>
                  <td>${UI.formatDate(p.Date)}</td>
                  <td>${p.SupplierName}</td>
                  <td>${(p.Details || []).length} item</td>
                  <td><b style="color:var(--accent-blue);">${UI.formatCurrency(p.GrandTotal)}</b></td>
                  <td><span class="badge badge-info">${p.PaymentStatus || 'Lunas'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async openNewPurchaseModal() {
    const suppliers = await Api.callServer('apiGetSuppliers');
    const products = await Api.callServer('apiGetProducts');
    this.cache.products = products;

    const today = new Date().toISOString().substring(0, 10);
    const poNo = `PO-${Date.now().toString(36).toUpperCase()}`;

    const supplierOptions = suppliers.map(s => `<option value="${s.ID}">${s.Name} (${s.Code})</option>`).join('');

    const html = `
      <form id="form-purchase">
        <div class="form-row">
          <div class="form-group">
            <label>No. PO / Pembelian</label>
            <input type="text" class="form-control" id="pur-po" value="${poNo}">
          </div>
          <div class="form-group">
            <label>Tanggal *</label>
            <input type="date" class="form-control" id="pur-date" value="${today}">
          </div>
        </div>

        <div class="form-group">
          <label>Supplier *</label>
          <select class="form-control" id="pur-sup">
            ${supplierOptions}
          </select>
        </div>

        <div style="margin:20px 0; border-top:1px solid var(--border-color); padding-top:16px;">
          <label style="font-weight:700; margin-bottom:10px; display:block;">Item Barang Pembelian</label>
          <div id="purchase-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="App.addPurchaseItemRow()" style="margin-top:10px;">+ Tambah Barang</button>
        </div>

        <div class="form-group">
          <label>Catatan</label>
          <input type="text" class="form-control" id="pur-notes" placeholder="Catatan supplier">
        </div>
      </form>
    `;

    UI.openModal('Transaksi Pembelian Baru', html, async () => {
      const items = [];
      document.querySelectorAll('.purchase-item-row').forEach(row => {
        const prodId = row.querySelector('.item-prod').value;
        const qty = Number(row.querySelector('.item-qty').value) || 0;
        const price = Number(row.querySelector('.item-price').value) || 0;
        if (prodId && qty > 0) {
          items.push({ ProductID: prodId, Qty: qty, UnitPrice: price });
        }
      });

      if (items.length === 0) {
        UI.showToast('Pilih minimal 1 barang pembelian', 'error');
        return;
      }

      const header = {
        PONumber: document.getElementById('pur-po').value,
        Date: document.getElementById('pur-date').value,
        SupplierID: document.getElementById('pur-sup').value,
        Notes: document.getElementById('pur-notes').value
      };

      try {
        await Api.callServer('apiCreatePurchase', header, items);
        UI.closeModal();
        UI.showToast('Pembelian berhasil disimpan!');
        App.renderPurchases();
      } catch (e) {
        UI.showToast(e.message, 'error');
      }
    });

    this.addPurchaseItemRow();
  },

  addPurchaseItemRow() {
    const container = document.getElementById('purchase-items-container');
    if (!container) return;
    const rowId = 'prow-' + Date.now();
    const products = this.cache.products || [];

    const productOptions = products.map(p => `<option value="${p.ID}" data-price="${p.BuyPrice}">${p.Name} (Harga Beli: ${UI.formatCurrency(p.BuyPrice)})</option>`).join('');

    const div = document.createElement('div');
    div.className = 'purchase-item-row form-row';
    div.id = rowId;
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <div style="flex:2;">
        <select class="form-control item-prod" onchange="App.updatePurchaseRowPrice('${rowId}')">
          ${productOptions}
        </select>
      </div>
      <div style="flex:1;">
        <input type="number" class="form-control item-qty" value="10" placeholder="Qty">
      </div>
      <div style="flex:1.5;">
        <input type="number" class="form-control item-price" value="${products[0] ? products[0].BuyPrice : 0}" placeholder="Harga Beli">
      </div>
      <div>
        <button type="button" class="btn btn-danger btn-sm" onclick="document.getElementById('${rowId}').remove()">&times;</button>
      </div>
    `;
    container.appendChild(div);
  },

  updatePurchaseRowPrice(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const select = row.querySelector('.item-prod');
    const selectedOpt = select.options[select.selectedIndex];
    const price = selectedOpt.getAttribute('data-price') || 0;
    row.querySelector('.item-price').value = price;
  },

  // ----------------------------------------------------
  // INVENTORY ADJUSTMENT
  // ----------------------------------------------------
  async renderInventory() {
    const adjustments = await Api.callServer('apiGetInventoryAdjustments');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Penyesuaian Stok Barang</h3>
        <button class="btn btn-primary" onclick="App.openInventoryModal()">+ Adjustment Stok Baru</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>No. Adjust</th><th>Tanggal</th><th>Produk</th><th>Tipe</th><th>Jumlah</th><th>Alasan</th></tr>
            </thead>
            <tbody>
              ${adjustments.map(a => `
                <tr>
                  <td><b>${a.AdjNo}</b></td>
                  <td>${UI.formatDate(a.Date)}</td>
                  <td>${a.ProductName}</td>
                  <td><span class="badge ${a.Type === 'Masuk' ? 'badge-success' : 'badge-danger'}">${a.Type}</span></td>
                  <td><b>${a.Qty}</b></td>
                  <td>${a.Reason || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async openInventoryModal() {
    const products = await Api.callServer('apiGetProducts');
    const today = new Date().toISOString().substring(0, 10);
    const prodOptions = products.map(p => `<option value="${p.ID}">${p.Name} [Stok Saat Ini: ${p.CurrentStock}]</option>`).join('');

    const html = `
      <form>
        <div class="form-group"><label>Tanggal *</label><input type="date" class="form-control" id="adj-date" value="${today}"></div>
        <div class="form-group"><label>Produk *</label><select class="form-control" id="adj-prod">${prodOptions}</select></div>
        <div class="form-row">
          <div class="form-group">
            <label>Tipe Adjustment *</label>
            <select class="form-control" id="adj-type"><option value="Masuk">Masuk (+ Stok)</option><option value="Keluar">Keluar (- Stok)</option></select>
          </div>
          <div class="form-group"><label>Jumlah Qty *</label><input type="number" class="form-control" id="adj-qty" value="1"></div>
        </div>
        <div class="form-group"><label>Alasan Penyesuaian</label><input type="text" class="form-control" id="adj-reason" placeholder="Koreksi opname / Rusak / Hilang"></div>
      </form>
    `;

    UI.openModal('Penyesuaian Stok Baru', html, async () => {
      const data = {
        Date: document.getElementById('adj-date').value,
        ProductID: document.getElementById('adj-prod').value,
        Type: document.getElementById('adj-type').value,
        Qty: document.getElementById('adj-qty').value,
        Reason: document.getElementById('adj-reason').value
      };
      try {
        await Api.callServer('apiCreateInventoryAdjustment', data);
        UI.closeModal();
        UI.showToast('Penyesuaian stok berhasil');
        App.renderInventory();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  // ----------------------------------------------------
  // CASH & BANK & JOURNALS
  // ----------------------------------------------------
  async renderCashBank() {
    const list = await Api.callServer('apiGetCashBank');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Transaksi Kas & Bank</h3>
        <button class="btn btn-primary" onclick="App.openCashBankModal()">+ Voucher Transaksi Baru</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>No. Voucher</th><th>Tanggal</th><th>Tipe</th><th>Akun Kas</th><th>Kategori</th><th>Jumlah</th><th>Keterangan</th></tr>
            </thead>
            <tbody>
              ${list.map(cb => `
                <tr>
                  <td><b>${cb.VoucherNo}</b></td>
                  <td>${UI.formatDate(cb.Date)}</td>
                  <td><span class="badge ${cb.Type === 'Masuk' ? 'badge-success' : 'badge-danger'}">${cb.Type}</span></td>
                  <td>${cb.Account}</td>
                  <td>${cb.Category}</td>
                  <td><b>${UI.formatCurrency(cb.Amount)}</b></td>
                  <td>${cb.Description || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openCashBankModal() {
    const today = new Date().toISOString().substring(0, 10);
    const html = `
      <form>
        <div class="form-row">
          <div class="form-group"><label>Tanggal *</label><input type="date" class="form-control" id="cb-date" value="${today}"></div>
          <div class="form-group">
            <label>Tipe *</label>
            <select class="form-control" id="cb-type"><option value="Masuk">Penerimaan Kas (Masuk)</option><option value="Keluar">Pengeluaran Kas (Keluar)</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Akun Kas / Bank *</label>
            <select class="form-control" id="cb-acc"><option value="Kas Bank BCA">Kas Bank BCA</option><option value="Kas Kecil">Kas Kecil</option><option value="Kas Bank Mandiri">Kas Bank Mandiri</option></select>
          </div>
          <div class="form-group"><label>Jumlah (Rp) *</label><input type="number" class="form-control" id="cb-amount" value="500000"></div>
        </div>
        <div class="form-group"><label>Kategori *</label><input type="text" class="form-control" id="cb-cat" placeholder="Operasional / Penjualan / Listrik"></div>
        <div class="form-group"><label>Keterangan</label><input type="text" class="form-control" id="cb-desc" placeholder="Rincian transaksi"></div>
      </form>
    `;

    UI.openModal('Transaksi Kas & Bank Baru', html, async () => {
      const data = {
        Date: document.getElementById('cb-date').value,
        Type: document.getElementById('cb-type').value,
        Account: document.getElementById('cb-acc').value,
        Amount: document.getElementById('cb-amount').value,
        Category: document.getElementById('cb-cat').value,
        Description: document.getElementById('cb-desc').value
      };
      try {
        await Api.callServer('apiCreateCashBank', data);
        UI.closeModal();
        UI.showToast('Transaksi Kas disimpan');
        App.renderCashBank();
      } catch (e) { UI.showToast(e.message, 'error'); }
    });
  },

  async renderJournals() {
    const journals = await Api.callServer('apiGetJournals');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="toolbar">
        <h3>Buku Jurnal Umum (Double Entry)</h3>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>No. Jurnal</th><th>Tanggal</th><th>Ref</th><th>Kode Akun</th><th>Nama Akun</th><th>Debit</th><th>Kredit</th><th>Deskripsi</th></tr>
            </thead>
            <tbody>
              ${journals.map(j => `
                <tr>
                  <td><b>${j.JournalNo}</b></td>
                  <td>${UI.formatDate(j.Date)}</td>
                  <td>${j.RefNo || '-'}</td>
                  <td><span class="badge badge-info">${j.AccountCode}</span></td>
                  <td>${j.AccountName}</td>
                  <td style="color:${j.Debit > 0 ? 'var(--accent-emerald)' : 'inherit'}">${j.Debit > 0 ? UI.formatCurrency(j.Debit) : '-'}</td>
                  <td style="color:${j.Credit > 0 ? 'var(--accent-teal)' : 'inherit'}">${j.Credit > 0 ? UI.formatCurrency(j.Credit) : '-'}</td>
                  <td>${j.Description || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // REPORTS VIEW
  // ----------------------------------------------------
  async renderReports() {
    const report = await Api.callServer('apiGetLabaRugiReport');
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="card">
        <div class="card-title">
          <span>📊 Laporan Laba Rugi Perusahaan</span>
          <button class="btn btn-secondary btn-sm" onclick="window.print()">Print Laporan</button>
        </div>

        <div style="margin-top:20px; max-width:600px;">
          <table style="font-size:15px;">
            <tbody>
              <tr>
                <td><b>Total Pendapatan Penjualan</b></td>
                <td style="text-align:right; font-weight:700; color:var(--accent-teal);">${UI.formatCurrency(report.TotalPendapatan)}</td>
              </tr>
              <tr>
                <td><b>Harga Pokok Penjualan (HPP / Pembelian)</b></td>
                <td style="text-align:right; font-weight:700; color:var(--accent-amber);">- ${UI.formatCurrency(report.TotalHPP)}</td>
              </tr>
              <tr style="border-top:2px solid var(--border-color);">
                <td><b style="font-size:16px;">LABA KOTOR</b></td>
                <td style="text-align:right; font-weight:700; font-size:16px;">${UI.formatCurrency(report.LabaKotor)}</td>
              </tr>
              <tr>
                <td><b>Total Beban Operasional & Kas Keluar</b></td>
                <td style="text-align:right; font-weight:700; color:var(--accent-rose);">- ${UI.formatCurrency(report.TotalBeban)}</td>
              </tr>
              <tr style="border-top:2px double var(--accent-teal); font-size:18px;">
                <td><b style="color:var(--accent-emerald);">LABA BERSIH (NET PROFIT)</b></td>
                <td style="text-align:right; font-weight:800; color:var(--accent-emerald);">${UI.formatCurrency(report.LabaBersih)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

// Initialize App on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
