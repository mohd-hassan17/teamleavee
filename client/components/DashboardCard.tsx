import Card from "./Card";

type DashboardCardProps = {
  title: string;
  value: string;
  detail: string;
};

export default function DashboardCard({ title, value, detail }: DashboardCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </Card>
  );
}
