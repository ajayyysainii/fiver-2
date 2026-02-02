/**
 * Cart Drawer Component
 * 
 * A sleek slide-out drawer that displays cart items with
 * quantity controls, totals, and checkout navigation.
 */

import { useCart, CartItem } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Package,
    Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

function CartItemCard({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCart();

    const tierColors: Record<string, string> = {
        GOLD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PLATINUM: 'bg-slate-100 text-slate-800 border-slate-200',
        URANIUM: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="group relative bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
            {/* Category badge */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.category === 'family'
                        ? 'bg-primary/10'
                        : 'bg-amber-50'
                        }`}>
                        {item.category === 'family' ? (
                            <Package className="w-5 h-5 text-primary" />
                        ) : (
                            <Sparkles className="w-5 h-5 text-amber-600" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-secondary leading-tight">{item.name}</h4>
                        {item.tier && (
                            <Badge variant="outline" className={`text-[10px] mt-1 ${tierColors[item.tier] || ''}`}>
                                {item.tier}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Remove button */}
                <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    aria-label="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <span className="font-bold text-secondary">${item.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs ml-1">setup</span>
                    {item.monthlyPrice && (
                        <>
                            <span className="text-slate-300 mx-1.5">+</span>
                            <span className="font-semibold text-primary">${item.monthlyPrice}</span>
                            <span className="text-slate-400 text-xs">/mo</span>
                        </>
                    )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, getTotal, itemCount, clearCart } = useCart();
    const totals = getTotal();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-gradient-to-b from-white to-slate-50/50">
                <SheetHeader className="space-y-1">
                    <SheetTitle className="flex items-center gap-3 font-display text-xl">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        Your Cart
                        {itemCount > 0 && (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                            <ShoppingCart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="font-display text-lg text-secondary mb-2">Your cart is empty</h3>
                        <p className="text-sm text-slate-500 max-w-[200px]">
                            Browse our membership options and add items to get started.
                        </p>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="mt-6"
                            variant="outline"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart items */}
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-3 pb-4">
                                <AnimatePresence mode="popLayout">
                                    {items.map(item => (
                                        <CartItemCard key={item.id} item={item} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>

                        {/* Totals */}
                        <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">One-time Setup</span>
                                <span className="font-semibold text-secondary">${totals.oneTime.toLocaleString()}</span>
                            </div>
                            {totals.monthly > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Monthly Subscription</span>
                                    <span className="font-semibold text-primary">${totals.monthly.toLocaleString()}/mo</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="font-display font-semibold text-secondary">Total</span>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-secondary">${totals.oneTime.toLocaleString()}</div>
                                    {totals.monthly > 0 && (
                                        <div className="text-xs text-slate-500">+ ${totals.monthly.toLocaleString()}/mo</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <SheetFooter className="flex-col gap-2 mt-4">
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="w-full">
                                <Button className="w-full btn-primary" size="lg">
                                    View Cart & Checkout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={clearCart}
                                className="text-slate-400 hover:text-red-500 text-sm"
                            >
                                Clear Cart
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
