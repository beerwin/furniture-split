const formTransitionClasses = ['transition-all', 'duration-300', 'transition-discrete']

export const genericButtonClasses = [
  ...formTransitionClasses,
  'rounded-md',
  'mx-2',
  'px-2',
  'py-1',
  'shadow-md',
  'hover:shadow-lg',
  'focus:shadow-xl',
  'shadow-neutral-500',
  'dark:shadow-neutral-800',
  'disabled:opacity-40',
  'disabled:cursor-not-allowed',
]

export const defaultButtonClasses = [
  ...genericButtonClasses,
  'text-white',
  'bg-neutral-700',
  'dark:bg-neutral-600',
  'shadow-neutral-500',
  'dark:shadow-neutral-800',
  'hover:bg-neutral-500',
  'dark:hover:shadow-neutral-900',
  'dark:hover:bg-neutral-400',
  'focus:bg-neutral-800',
  'dark:focus:bg-neutral-700',
]

export const actionButtonClasses = [
  ...genericButtonClasses,
  'text-white',
  'bg-sky-700',
  'hover:bg-sky-500',
  'focus:bg-sky-800',
  'shadow-sky-800',
]

export const dangerButtonClasses = [
  ...genericButtonClasses,
  'text-white',
  'bg-red-700',
  'shadow-red-800',
  'hover:bg-red-500',
  'focus:bg-red-800',
]

export const fieldClasses = [
  ...formTransitionClasses,
  'border-2',
  'border-neutral-300',
  'dark:border-gray-600',
  'inset-shadow-sm',
  'shadow-neutral-900',
  'bg-white',
  'dark:bg-gray-900',
  'px-2',
  'rounded-md',
  'mx-2',
  'hover:border-neutral-700',
  'focus:shadow-sky-800',
  'focus:outline-2',
  'focus:outline-sky-800',
  'basis-full',
]

export const fieldErrorClasses = [
  'border-red-900 hover:border-red-700 focus:outline-red-800 focus:shadow-red-800',
]

export const labelClasses = ['p-1', 'basis-full']

export const fieldGroupClasses = [
  'flex-none',
  'basis-[30%]',
  'flex',
  'flex-wrap',
  'justify-between',
  'p-1',
]

export const fieldWrapperClasses = ['flex', 'flex-wrap', 'm-1', 'even:bg-neutral-200', 'dark:even:bg-gray-800', 'rounded-md']

export const cardClasses = ['shadow-2xl', 'bg-white', 'dark:bg-gray-900', 'm-2', 'p-2', 'rounded-lg']

export const h1Classes = ['text-2xl', 'm-2']

export const h2Classes = ['text-xl', 'm-2']

export const h3Classes = ['text-lg', 'm-2']

export const menuItemClasses = [
  'relative',
  'group',
  'hover:bg-sky-200',
  'dark:hover:bg-sky-700',
  'text-neutral-800',
  'dark:text-neutral-200',
  'hover:text-neutral-900',
  'hover:dark:text-white',
  'cursor-pointer',
  'transition-all',
]

export const menuItemSeparatorClasses = [
  'border-t',
  'border-neutral-300',
  'dark:border-neutral-700',
  'my-1',
]

export const menuItemButtonClasses = [
  'py-2',
  'px-6',
  'flex',
]

export const menuItemCheckboxClasses = [
  'flex-none',
  'mr-2',
  'w-4',
]

export const menuItemLabelClasses = [
  'flex-grow',
  'whitespace-nowrap',
]

export const menuItemActionButtonClasses = [
  'flex-none',
  'ml-4',
]

export const dropDownMenuClasses = [
  'absolute',
  'bg-white',
  'dark:bg-gray-800',
  'rounded-md',
  'shadow-lg',
  'shadow-neutral-400',
  'dark:shadow-gray-900',
  'py-2',
  'top-full', 
  'hidden',
  'group-hover:block',
  'transition-all',
  'min-w-80',
]
