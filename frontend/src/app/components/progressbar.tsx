type ProgressBarProps = {
  percentage: number
};

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <>
      <div className="relative w-full h-4 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-orange-400 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </>
  )
};