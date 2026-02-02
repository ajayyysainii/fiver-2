/**
 * Cart Button Component
 * 
 * A floating cart button that displays the cart item count
 * and opens the cart drawer when clicked.
 */

import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton() {
    const { itemCount, setIsOpen } = useCart();

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
            aria-label="Open cart"
        >
            <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />

            <AnimatePresence mode="wait">
                {itemCount > 0 && (
                    <motion.div
                        key={itemCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30"
                    >
                        {itemCount > 99 ? '99+' : itemCount}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
