import api from "./api";

export async function loadDashboardStats() {
  try {
    const res = await api.get("/api/dashboard/stats");
    // console.log("res", res);

    // return res;
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw new Error(error);
  }
}

export async function loadDashboardSales(chartPeriod) {
  try {
    const res = await api.get(
      `/api/dashboard/sales-chart?period=${chartPeriod}`
    );
    // console.log("res2", res);
    // return res;
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard sales:", error);
    throw new Error(error);
  }
}

export async function loadCustomer(customerId) {
  try {
    const res = await api.get(`/api/customers/${customerId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    throw new Error(error);
  }
}

export async function loadAllCustomers(active = false) {
  try {
    const res = await api.get(
      `/api/customers${active ? `?isActive=true` : ""}`
    );
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw new Error(error);
  }
}

export async function loadCustomersPurchases(customerId) {
  try {
    const res = await api.get(`/api/customers/${customerId}/purchases`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    throw new Error(error);
  }
}

export async function updateCustomersDetails(customerId, customerData) {
  try {
    const res = await api.put(`/api/customers/${customerId}`, customerData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw new Error(error);
  }
}

export async function deleteCustomer(customerId) {
  try {
    const res = await api.delete(`/api/customers/${customerId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw new Error(error);
  }
}

export async function loadInventory() {
  try {
    const res = await api.get(`/api/inventory`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    throw new Error(error);
  }
}

export async function loadSalesInventory() {
  try {
    const res = await api.get(`/api/sales?status=completed`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch sales inventory:", error);
    throw new Error(error);
  }
}

export async function loadAllProducts(active = false) {
  try {
    const res = await api.get(`/api/products${active ? `?isActive=true` : ""}`);
    const products = res.data.data.map((prod) => ({
      ...prod.prod,
      currentStock: prod.availableStock,
    }));
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error(error);
  }
}

export async function createProduct(data) {
  try {
    const res = await api.post(`/api/products`, data);
    console.log("res", res.data)
    return res.data.data;
  } catch (error) {
    console.error("Failed to create new products:", error);
    throw new Error(error);
  }
}

export async function updateProduct(productId, data) {
  try {
    const res = await api.patch(`/api/products/${productId}`, data);
    console.log("res-updateProduct", res.data)
    return res.data.data;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error(error);
  }
}

export async function updateStockInevtory(productId, stockData) {
  try {
    const res = await api.patch(
      `/api/products/${productId}/inventory`,
      stockData
    );
    return res.data.data;
  } catch (error) {
    console.error("Failed to update stock inventory:", error);
    throw new Error(error);
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await api.delete(`/api/products/${productId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error(error);
  }
}

// export async function deleteInventory() {
//   try {
//     const res =await api.delete(`/api/inventory`);
//     return res.data.data;
//   } catch (error) {
//     console.error("Failed to fatch inventory:", error);
//     throw new Error(error);
//   }
// }

export async function updateStockInventory(itemId, newStock, userId) {
  try {
    const res = await api.patch(`/api/inventory/${itemId}/stock`, {
      currentStock: newStock,
      updatedBy: userId,
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to upadete stock inventory:", error);
    throw new Error(error);
  }
}

export async function loadAllProductCategories() {
  try {
    const res = await api.get(`/api/products/categories/all`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to laod products categories:", error);
    throw new Error(error);
  }
}

export async function updateProductsCategories(
  editingCategoryId,
  categoryData
) {
  try {
    const res = await api.put(`/categories/${editingCategoryId}`, categoryData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update products categories:", error);
    throw new Error(error);
  }
}

export async function createProductsCategory(categoryData) {
  try {
    const res = await api.post(`/categories`, categoryData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw new Error(error);
  }
}

export async function updateAllProductsInACategories(productId, categoryData) {
  try {
    const res = await api.put(`/products/${productId}`, categoryData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update all products in a category", error);
    throw new Error(error);
  }
}

export async function deleteCategories(categoryName) {
  try {
    const res = await api.delete(`/categories/${categoryName}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to delete product category:", error);
    throw new Error(error);
  }
}

// Suppliers
export async function loadAllSuppliers(active = false) {
  try {
    const res = await api.get(
      `/api/suppliers${active ? `?isActive=true` : ""}`
    );
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch all suppliers:", error);
    throw new Error(error);
  }
}

export async function loadSuppliers(supplierId) {
  try {
    const res = await api.get(`/api/suppliers/${supplierId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    throw new Error(error);
  }
}

export async function loadProductsSuppliers(supplierId) {
  try {
    const res = await api.get(`/suppliers/${supplierId}/products`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch products suppliers:", error);
    throw new Error(error);
  }
}

export async function deleteSupplier(supplierId) {
  try {
    const res = await api.delete(`/api/suppliers/${supplierId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to delete supplier:", error);
    throw new Error(error);
  }
}

// Sales
export async function createSales(salesData) {
  try {
    const res = await api.post(`/api/sales`, salesData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create new sales:", error);
    throw new Error(error);
  }
}

export async function loadSales(params) {
  try {
    const res = await api.get(`/api/sales`, { params });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    throw new Error(error);
  }
}

export async function loadSalesByUrl(url) {
  try {
    const res = await api.get(`/api${url}`);
    // console.log("res1", res.data);
    // console.log("res2", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    throw new Error(error);
  }
}

export async function getSale(saleId) {
  try {
    const res = await api.get(`/api/sales/${saleId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch sale:", error);
    throw new Error(error);
  }
}

export async function updateSales(saleId, updateData) {
  try {
    const res = await api.patch(`/api/sales/${saleId}`, updateData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update sale:", error);
    throw new Error(error);
  }
}

export async function updateSalesStatus(saleId, updateData) {
  try {
    const res = await api.patch(`/api/sales/${saleId}/status`, updateData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update sales status:", error);
    throw new Error(error);
  }
}

export async function updateSalesItems(saleId, updateData) {
  try {
    const res = await api.put(`/api/sales/${saleId}/items`, updateData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update sales status:", error);
    throw new Error(error);
  }
}

// User
export async function getAllUser() {
  try {
    const res = await api.get(`/api/users`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error(error);
  }
}

export async function getUser(userId) {
  try {
    const res = await api.get(`/api/users/${userId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error(error);
  }
}

export async function deleteUser(saleId) {
  try {
    const res = await api.delete(`/api/sales/${saleId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to delete sale:", error);
    throw new Error(error);
  }
}

export async function updateUser(method, endpoint) {
  try {
    const res = await api[method](`/api${endpoint}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update sale:", error);
    throw new Error(error);
  }
}
