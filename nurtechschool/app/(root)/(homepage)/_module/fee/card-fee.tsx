import ListFee from "./list-fee";

interface CardFeeProps {
  data?: {
    id: number;
    label: string;
    cost: number;
  }[];
}

export default function CardFee({ data }: CardFeeProps) {
  return (
    <div className="border border-primary-500 rounded-2xl p-7 bg-primary-100 lg:w-1/2 w-full">
      <ListFee data={data} />
    </div>
  );
}
