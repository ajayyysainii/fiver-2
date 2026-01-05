## Packages
framer-motion | Animation library for smooth page transitions and interactive elements
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge Tailwind classes without conflicts

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}

Integration assumptions:
- Replit Auth is active at /api/auth/user
- User profile data (role, payment status) expected at /api/profile
- Payment simulation endpoints at /api/payments/onetime and /api/payments/subscribe
