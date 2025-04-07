import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { cn } from '~/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 12, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-[8px] dark:bg-white px-3 py-1.5 text-s5 font-jakarta font-semibold dark:text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-neutral-950 text-neutral-50',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipPointer = ({
  theme,
  position = 'middle',
  side,
  className,
}: {
  theme: 'light' | 'dark';
  position?: 'left' | 'middle' | 'right';
    side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) => {
  const fill = theme === 'light' ? 'white' : 'black';
  const left =
    side === 'right'
      ? '-rotate-90 -left-2 top-1/2 transform -translate-y-1/2'
      : position === 'left'
        ? 'rotate-90 -right-2 top-1/2 transform -translate-y-1/2'
      : position === 'middle'
      ? 'left-1/2 transform -translate-x-1/2'
      : 'right-2';

  return (
    <div className={twMerge('absolute -top-2 border-[#0a0a0a]', left, className)}>
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.19615 0.999999C5.96595 -0.333335 7.89045 -0.333333 8.66025 1L13.8564 10H0L5.19615 0.999999Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

const SimpleTooltip = ({
  children,
  content,
  position = 'middle',
  side = 'right',
}: {
  children: React.ReactNode;
  content: string;
  position?: 'left' | 'middle' | 'right';
  side?: 'top' | 'bottom' | 'left' | 'right';
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className="relative overflow-visible font-ubuntu"
        >
          <span className="dark:hidden">
            <TooltipPointer theme="dark" position={position} side={side}
              className=''
            />
          </span>
          <span className="hidden dark:block">
            <TooltipPointer theme="light" position={position} side={side} />
          </span>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export {
  SimpleTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
