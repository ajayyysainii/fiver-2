/**
 * Cart Hook and Context Provider
 * 
 * Provides global cart state management for adding products,
 * updating quantities, and calculating totals.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Product type definition
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    monthlyPrice?: number;
    category: 'family' | 'professional';
    tier?: string;
    image?: string;
}

// Cart item extends Product with quantity
export interface CartItem extends Product {
    quantity: number;
}

// Cart context type
interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => { oneTime: number; monthly: number };
    itemCount: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for cart persistence
const CART_STORAGE_KEY = 'family-legacy-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [items]);

    const addItem = useCallback((product: Product) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                // Increment quantity if item already exists
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Add new item with quantity 1
            return [...currentItems, { ...product, quantity: 1 }];
        });

        // Open cart drawer when adding item
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems(currentItems =>
            currentItems.filter(item => item.id !== productId)
        );
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getTotal = useCallback(() => {
        return items.reduce(
            (acc, item) => ({
                oneTime: acc.oneTime + (item.price * item.quantity),
                monthly: acc.monthly + ((item.monthlyPrice || 0) * item.quantity),
            }),
            { oneTime: 0, monthly: 0 }
        );
    }, [items]);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotal,
                itemCount,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

// Predefined products matching the pricing section
export const PRODUCTS: Product[] = [
    {
        id: 'family-membership',
        name: 'Family Membership',
        description: 'Full FamilyLegacyPlatform — self-hosted solution with complete control over private legacy, communications, and marketplace.',
        price: 200,
        monthlyPrice: 10,
        category: 'family',
        image: '/family-membership.jpg',
    },
    {
        id: 'professional-gold',
        name: 'Professional Membership - Gold',
        description: 'Join the FamilyLegacyPlatform Marketplace with Gold tier access.',
        price: 20000,
        monthlyPrice: 100,
        category: 'professional',
        tier: 'GOLD',
    },
    {
        id: 'professional-platinum',
        name: 'Professional Membership - Platinum',
        description: 'Join the FamilyLegacyPlatform Marketplace with Platinum tier access.',
        price: 20000,
        monthlyPrice: 150,
        category: 'professional',
        tier: 'PLATINUM',
    },
    {
        id: 'professional-uranium',
        name: 'Professional Membership - Uranium',
        description: 'Join the FamilyLegacyPlatform Marketplace with Uranium tier premium access.',
        price: 20000,
        monthlyPrice: 1000,
        category: 'professional',
        tier: 'URANIUM',
    },
];

// Add-on products available for purchase
export const ADDON_PRODUCTS: Product[] = [
    {
        id: 'addon-extra-storage',
        name: 'Extra Storage Pack',
        description: 'Additional 500GB of encrypted vault storage for your family media and documents.',
        price: 50,
        monthlyPrice: 5,
        category: 'family',
    },
    {
        id: 'addon-priority-support',
        name: 'Priority Support',
        description: '24/7 priority support with dedicated account manager and 1-hour response time.',
        price: 100,
        monthlyPrice: 25,
        category: 'family',
    },
    {
        id: 'addon-consultation',
        name: 'Setup Consultation',
        description: '2-hour one-on-one consultation for server setup, domain configuration, and best practices.',
        price: 150,
        category: 'family',
    },
    {
        id: 'addon-backup-service',
        name: 'Automated Backup Service',
        description: 'Daily encrypted backups to multiple secure cloud locations with easy restore options.',
        price: 0,
        monthlyPrice: 15,
        category: 'family',
    },
    {
        id: 'addon-white-label',
        name: 'White Label Package',
        description: 'Custom branding, logo, and domain setup for a fully personalized family experience.',
        price: 500,
        category: 'family',
    },
    {
        id: 'addon-pro-marketing',
        name: 'Marketing Boost',
        description: 'Featured placement in the marketplace with priority listing and promotional support.',
        price: 0,
        monthlyPrice: 200,
        category: 'professional',
        tier: 'ADDON',
    },
];

// Get all products
export const ALL_PRODUCTS = [...PRODUCTS, ...ADDON_PRODUCTS];

