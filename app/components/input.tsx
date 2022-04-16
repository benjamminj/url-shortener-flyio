type InputProps = JSX.IntrinsicElements["input"] & {
  label: React.ReactNode
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <label className="relative inline-block">
      <input
        className="peer inline-block rounded-none border-2 p-2 pt-6 focus:outline-none dark:border-slate-500 dark:bg-transparent focus:dark:border-slate-50"
        placeholder=" "
        {...props}
        defaultValue=""
      />
      <span className="absolute left-2 top-2 ml-[1px] text-xs uppercase">
        {label}
      </span>
    </label>
  )
}
