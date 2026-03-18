import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const mockProducts = [
  {
    _id: "1",
    name: "Rose Romance",
    price: 85,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?auto=format&fit=crop&q=80&w=800",
    description: "A classic arrangement of deep red roses.",
    tag: "Bestseller"
  },
  {
    _id: "2",
    name: "Pastel Dream",
    price: 95,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800",
    description: "Soft pastel blooms for a dreamy aesthetic.",
    tag: "New"
  },
  {
    _id: "3",
    name: "Wildflower Whisper",
    price: 70,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800",
    description: "A rustic mix of seasonal wildflowers."
  },
  {
    _id: "4",
    name: "Tulip Treasure",
    price: 65,
    image: "https://images.unsplash.com/photo-1457089328109-e5d9f4b15f00?auto=format&fit=crop&q=80&w=800",
    description: "Bright and cheerful spring tulips."
  },
  {
    _id: "5",
    name: "Golden Sun",
    price: 60,
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800",
    description: "Radiant sunflowers to brighten any day."
  },
  {
    _id: "6",
    name: "Blush Elegance",
    price: 110,
    image: "https://images.unsplash.com/photo-1523694576728-b0fa84eb1a1b?auto=format&fit=crop&q=80&w=800",
    description: "Premium blush pink peonies and roses.",
    tag: "Premium"
  }
];

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all products...');
    
    // Fallback to mock data if MongoDB is not connected (readyState 1 = connected)
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Returning mock products for preview.');
      return res.status(200).json(mockProducts);
    }

    const products = await Product.find();
    
    // If database is connected but empty, return mock data for preview purposes
    if (products.length === 0) {
      console.log('Database is empty. Returning mock products for preview.');
      return res.status(200).json(mockProducts);
    }
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    console.log('Falling back to mock products due to error.');
    res.status(200).json(mockProducts);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mockProduct = mockProducts.find(p => p._id === req.params.id);
      if (mockProduct) return res.status(200).json(mockProduct);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`Fetching product with ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error while fetching product' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    console.log('Creating new product with data:', req.body);
    const { name, price, image, description, category } = req.body;

    const product = new Product({
      name,
      price,
      image,
      description,
      category
    });

    const createdProduct = await product.save();
    console.log('Product created successfully:', createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error while creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    console.log(`Updating product with ID: ${req.params.id}`);
    const { name, price, image, description, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found for update');
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.description = description || product.description;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    console.log('Product updated successfully');
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error while updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    console.log(`Deleting product with ID: ${req.params.id}`);
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      console.log('Product not found for deletion');
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product deleted successfully');
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error while deleting product' });
  }
};
