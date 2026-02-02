/**
 * Cart Page Component
 * 
 * Full-page cart view with detailed item management,
 * order summary, and checkout functionality.
 */

import { useCart, CartItem, PRODUCTS } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ArrowRight,
    Package,
    Sparkles,
    Shield,
    CreditCard,
    Lock,
    CheckCircle2,
    Users,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Tier color mappings
const tierColors: Record<string, string> = {
    GOLD: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200',
    PLATINUM: 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200',
    URANIUM: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200',
};

const tierBadgeColors: Record<string, string> = {
    GOLD: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PLATINUM: 'bg-slate-100 text-slate-800 border-slate-300',
    URANIUM: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

function CartItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${item.tier
                ? tierColors[item.tier] || 'bg-white border-slate-200'
                : item.category === 'family'
                    ? 'bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20'
                    : 'bg-white border-slate-200'
                }`}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon and info */}
                <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${item.category === 'family'
                        ? 'bg-primary/10'
                        : 'bg-amber-50'
                        }`}>
                        {item.category === 'family' ? (
                            <Users className="w-7 h-7 text-primary" />
                        ) : (
                            <Briefcase className="w-7 h-7 text-amber-600" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-bold text-lg text-secondary">{item.name}</h3>
                            {item.tier && (
                                <Badge variant="outline" className={tierBadgeColors[item.tier] || ''}>
                                    {item.tier}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                </div>

                {/* Quantity and price */}
                <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[120px]">
                        <div className="text-lg font-bold text-secondary">
                            ${(item.price * item.quantity).toLocaleString()}
                        </div>
                        {item.monthlyPrice && (
                            <div className="text-sm text-primary font-medium">
                                + ${(item.monthlyPrice * item.quantity).toLocaleString()}/mo
                            </div>
                        )}
                    </div>

                    {/* Remove button */}
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Remove item"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function SuggestedProduct({ product }: { product: typeof PRODUCTS[0] }) {
    const { addItem, items } = useCart();
    const isInCart = items.some(item => item.id === product.id);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-primary/30 transition-all"
        >
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${product.category === 'family' ? 'bg-primary/10' : 'bg-amber-50'
                    }`}>
                    {product.category === 'family' ? (
                        <Package className="w-5 h-5 text-primary" />
                    ) : (
                        <Sparkles className="w-5 h-5 text-amber-600" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-secondary truncate">{product.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">${product.price.toLocaleString()}</p>
                </div>
            </div>
            <Button
                onClick={() => addItem(product)}
                disabled={isInCart}
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs"
            >
                {isInCart ? (
                    <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        In Cart
                    </>
                ) : (
                    <>
                        <Plus className="w-3 h-3 mr-1" />
                        Add to Cart
                    </>
                )}
            </Button>
        </motion.div>
    );
}

export default function CartPage() {
    const { items, getTotal, clearCart, itemCount } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const totals = getTotal();

    // Get products not in cart for suggestions
    const suggestedProducts = PRODUCTS.filter(
        product => !items.some(item => item.id === product.id)
    ).slice(0, 3);

    const handleCheckout = () => {
        setIsProcessing(true);
        // Simulate checkout process
        setTimeout(() => {
            setIsProcessing(false);
            alert('Checkout functionality will be connected to a payment processor.');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Continue Shopping</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <span className="font-display font-bold text-secondary">Your Cart</span>
                        {itemCount > 0 && (
                            <Badge className="bg-primary/10 text-primary">{itemCount}</Badge>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {items.length === 0 ? (
                    /* Empty cart state */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto text-center py-20"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-12 h-12 text-slate-300" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-secondary mb-4">
                            Your cart is empty
                        </h1>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Explore our membership options and add plans that fit your family's legacy needs.
                        </p>
                        <Link href="/#pricing">
                            <Button className="btn-primary" size="lg">
                                Browse Memberships
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>

                        {/* Suggested products */}
                        {suggestedProducts.length > 0 && (
                            <div className="mt-16">
                                <h3 className="font-display font-semibold text-lg text-secondary mb-4">
                                    Recommended for You
                                </h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {suggestedProducts.map(product => (
                                        <SuggestedProduct key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* Cart with items */
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
                                    Shopping Cart
                                </h1>
                                <Button
                                    variant="ghost"
                                    onClick={clearCart}
                                    className="text-slate-400 hover:text-red-500 text-sm"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear All
                                </Button>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {items.map(item => (
                                    <CartItemRow key={item.id} item={item} />
                                ))}
                            </AnimatePresence>

                            {/* Suggested products */}
                            {suggestedProducts.length > 0 && (
                                <div className="pt-8">
                                    <h3 className="font-display font-semibold text-lg text-secondary mb-4">
                                        You might also like
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {suggestedProducts.map(product => (
                                            <SuggestedProduct key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <Card className="border-slate-200 shadow-xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white pb-6">
                                        <CardTitle className="font-display flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        {/* Item breakdown */}
                                        <div className="space-y-3">
                                            {items.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-slate-600 truncate pr-2">
                                                        {item.name} {item.quantity > 1 && `×${item.quantity}`}
                                                    </span>
                                                    <span className="font-medium text-secondary shrink-0">
                                                        ${(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        {/* Totals */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">One-time Setup</span>
                                                <span className="font-semibold text-secondary">
                                                    ${totals.oneTime.toLocaleString()}
                                                </span>
                                            </div>
                                            {totals.monthly > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Monthly Subscription</span>
                                                    <span className="font-semibold text-primary">
                                                        ${totals.monthly.toLocaleString()}/mo
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center">
                                            <span className="font-display font-bold text-lg text-secondary">Total Due</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-secondary">
                                                    ${totals.oneTime.toLocaleString()}
                                                </div>
                                                {totals.monthly > 0 && (
                                                    <div className="text-xs text-slate-500">
                                                        then ${totals.monthly.toLocaleString()}/mo
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Checkout button */}
                                        <Button
                                            className="w-full btn-primary mt-4"
                                            size="lg"
                                            onClick={handleCheckout}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Package className="w-5 h-5" />
                                                    </motion.div>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    Proceed to Checkout
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </Button>

                                        {/* Security badges */}
                                        <div className="flex items-center justify-center gap-4 pt-4 text-slate-400">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Lock className="w-3.5 h-3.5" />
                                                <span>Secure</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Shield className="w-3.5 h-3.5" />
                                                <span>Encrypted</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Features */}
                                <div className="mt-6 space-y-3">
                                    {[
                                        { icon: Shield, text: 'Self-hosted & fully private' },
                                        { icon: Lock, text: 'Your data stays with you' },
                                        { icon: CheckCircle2, text: 'Lifetime platform access' },
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <feature.icon className="w-4 h-4 text-primary" />
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
