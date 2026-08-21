interface ListFeeProps {
  data?: {
    id: number;
    label: string;
    cost: number;
  }[];
}

export default function ListFee({ data }: ListFeeProps) {
  const formatCurrency = (amount: number) => {
    if (amount === 0 || amount === null) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const total = data?.reduce((acc, item) => acc + item.cost, 0) || 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {data?.map((item) => (
        <div
          key={item.id}
          className="flex lg:items-center lg:flex-row flex-col justify-between gap-1 w-full"
        >
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M20.5853 9.18985L14.8103 3.41484C14.6579 3.2625 14.4587 3.1875 14.2595 3.1875C14.0603 3.1875 13.861 3.2625 13.7087 3.41484L9.93292 7.19297C9.64698 7.16016 9.3587 7.14609 9.07042 7.14609C7.3548 7.14609 5.63917 7.71094 4.23058 8.84063C3.86964 9.12891 3.84151 9.67031 4.1673 9.99844L8.42589 14.257L3.37745 19.3008C3.31559 19.3623 3.27741 19.4436 3.26964 19.5305L3.18995 20.4023C3.16886 20.6227 3.34464 20.8102 3.56261 20.8102C3.57433 20.8102 3.58605 20.8102 3.59776 20.8078L4.46964 20.7281C4.55636 20.7211 4.63839 20.6813 4.69933 20.6203L9.74776 15.5719L14.0064 19.8305C14.1587 19.9828 14.3579 20.0578 14.5571 20.0578C14.7845 20.0578 15.0095 19.9594 15.1642 19.7672C16.4837 18.1195 17.0321 16.057 16.8095 14.0625L20.5853 10.2867C20.8876 9.98672 20.8876 9.49453 20.5853 9.18985Z"
                fill="#DB9E30"
              />
            </svg>
            <p className="text-lg md:text-xl font-medium">{item.label}</p>
          </div>
          <p className="text-lg md:text-xl font-medium lg:pl-0 pl-7">
            {formatCurrency(item.cost)}
          </p>
        </div>
      ))}
      <hr className="border-black" />
      <div className="flex items-center justify-between gap-1 w-full">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M20.5853 9.18985L14.8103 3.41484C14.6579 3.2625 14.4587 3.1875 14.2595 3.1875C14.0603 3.1875 13.861 3.2625 13.7087 3.41484L9.93292 7.19297C9.64698 7.16016 9.3587 7.14609 9.07042 7.14609C7.3548 7.14609 5.63917 7.71094 4.23058 8.84063C3.86964 9.12891 3.84151 9.67031 4.1673 9.99844L8.42589 14.257L3.37745 19.3008C3.31559 19.3623 3.27741 19.4436 3.26964 19.5305L3.18995 20.4023C3.16886 20.6227 3.34464 20.8102 3.56261 20.8102C3.57433 20.8102 3.58605 20.8102 3.59776 20.8078L4.46964 20.7281C4.55636 20.7211 4.63839 20.6813 4.69933 20.6203L9.74776 15.5719L14.0064 19.8305C14.1587 19.9828 14.3579 20.0578 14.5571 20.0578C14.7845 20.0578 15.0095 19.9594 15.1642 19.7672C16.4837 18.1195 17.0321 16.057 16.8095 14.0625L20.5853 10.2867C20.8876 9.98672 20.8876 9.49453 20.5853 9.18985Z"
              fill="#DB9E30"
            />
          </svg>
          <p className="text-lg md:text-xl font-medium">Total</p>
        </div>
        <p className="text-lg md:text-xl font-medium">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
}
