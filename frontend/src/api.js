// api.js
const BASE_URL = "http://192.168.29.4:1337";

//CategoriesName API
export async function fetchCategoriesName() {
  try {
    const res = await fetch(`${BASE_URL}/api/category-with-name`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

//SubCategoriesName API
export async function fetchSubCategoriesName(selectedValue) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/subcategory/${selectedValue}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return [];
  }
}

//ProductData API
export async function fetchProductData() {
  try {
    const res = await fetch(`${BASE_URL}/api/product`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createProductData(formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/product`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const newData = await response.json();
      return newData;
    } else {
      console.log("Failed to create entry");
      return null;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return null;
  }
}

export async function updateProductData(id, formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/product/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to update entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}

export async function deleteProductData(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to delete entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}

//SubCategoryData API
export async function fetchSubCategoryData() {
  try {
    const res = await fetch(`${BASE_URL}/api/sub-category`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createSubCategoryData(formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/sub-category`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const newData = await response.json();
      return newData;
    } else {
      console.log("Failed to create entry");
      return null;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return null;
  }
}

export async function updateSubCategoryData(id, formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/sub-category/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to update entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}

export async function deleteSubCategoryData(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/sub-category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to delete entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}

export async function fetchCategoryData() {
  try {
    const res = await fetch(`${BASE_URL}/api/category`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createCategoryData(formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/category`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const newData = await response.json();
      return newData;
    } else {
      console.log("Failed to create entry");
      return null;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return null;
  }
}

export async function updateCategoryData(id, formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/category/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to update entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}

export async function deleteCategoryData(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Failed to delete entry");
      return false;
    }
  } catch (err) {
    console.log("Error:", err);
    if (err.response) {
      console.log("Error response:", err.response);
    }
    return false;
  }
}
