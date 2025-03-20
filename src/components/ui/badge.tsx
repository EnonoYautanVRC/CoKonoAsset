import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'rounded-sm border-transparent bg-secondaryContainer text-secondaryContainer-foreground hover:bg-secondaryContainer-foreground/10',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        avatar:
          'border-transparent bg-budge_avatar text-budge_avatar-foreground hover:bg-budge_avatar/80',
        avatarWearable:
          'border-transparent bg-budge_avatarWearable text-budge_avatarWearable-foreground hover:bg-budge_avatarWearable/80',
        worldObject:
          'border-transparent bg-budge_worldObject text-budge_worldObject-foreground hover:bg-budge_worldObject/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
